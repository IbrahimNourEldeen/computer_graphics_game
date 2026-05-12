import { Player } from './player.js';
import { PlatformManager } from './platformManager.js';
import { Camera } from './camera.js';
import { ComboSystem } from './comboSystem.js';
import { UI } from './ui.js';
import { SoundManager } from './soundManager.js';

export class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
        
        this.state = 'menu';
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('icyTowerHighScore')) || 0;
        this.currentFloor = 0;
        this.bestCombo = 0;
        
        this.player = new Player(this.width / 2, this.height - 120);
        this.platformManager = new PlatformManager(this.width, this.height);
        this.camera = new Camera(this.width, this.height);
        this.comboSystem = new ComboSystem();
        this.ui = new UI();
        this.soundManager = new SoundManager();
        
        this.deathFloor = this.height + 200;
        this.deathFloorSpeed = 0.5;
        this.deathFloorAcceleration = 0.0001;
        
        this.shakeAmount = 0;
        this.shakeDecay = 0.9;
        
        this.discoMode = false;
        this.discoTimer = 0;
        this.discoColors = ['#ff0080', '#00ff80', '#0080ff', '#ff8000', '#8000ff', '#ffff00', '#00ffff', '#ff00ff'];
        this.discoColorIndex = 0;
        this.discoColorChangeSpeed = 15;
        this.discoColorChangeTimer = 0;
        this.lastDiscoFloor = 0;
        this.nextDiscoFloor = 100;
        
        this.ui.updateHighScore(this.highScore);
    }
    
    start() {
        this.state = 'playing';
        this.ui.showHUD();
        this.ui.hideMenu('main-menu');
        this.reset();
    }
    
    restart() {
        this.state = 'playing';
        this.ui.hideMenu('game-over-menu');
        this.ui.showHUD();
        this.reset();
    }
    
    reset() {
        this.score = 0;
        this.currentFloor = 0;
        this.bestCombo = 0;
        this.deathFloor = this.height + 200;
        this.deathFloorSpeed = 0.5;
        
        this.discoMode = false;
        this.discoTimer = 0;
        this.discoColorIndex = 0;
        this.discoColorChangeTimer = 0;
        this.lastDiscoFloor = 0;
        this.nextDiscoFloor = 100;
        
        this.player.reset(this.width / 2, this.height - 120);
        this.platformManager.reset();
        this.camera.reset();
        this.comboSystem.reset();
        
        this.ui.updateScore(0);
        this.ui.updateFloor(0);
        this.ui.updateCombo(0, 0);
    }
    
    update(deltaTime) {
        if (this.state !== 'playing') return;
        
        const dt = Math.min(deltaTime / 16.67, 2);
        
        const wasGrounded = this.player.isGrounded;
        
        this.player.update(dt, this.platformManager.platforms);
        
        if (wasGrounded && !this.player.isGrounded && this.player.velocityY < 0) {
            this.soundManager.playJump(this.player.velocityX);
        }
        
        if (this.player.isGrounded) {
            const onPlatform = this.platformManager.platforms.find(p => {
                const playerLeft = this.player.x - this.player.width / 2;
                const playerRight = this.player.x + this.player.width / 2;
                const platformLeft = p.x;
                const platformRight = p.x + p.width;
                const playerBottom = this.player.y + this.player.height / 2;
                
                return playerBottom >= p.y && playerBottom <= p.y + p.height &&
                       playerRight > platformLeft && playerLeft < platformRight;
            });
            
            if (onPlatform) {
                const playerLeft = this.player.x - this.player.width / 2;
                const playerRight = this.player.x + this.player.width / 2;
                const platformLeft = onPlatform.x;
                const platformRight = onPlatform.x + onPlatform.width;
                
                const leftOverhang = platformLeft - playerLeft;
                const rightOverhang = playerRight - platformRight;
                
                const nearLeftEdge = leftOverhang > 0 && leftOverhang < this.player.width * 0.7;
                const nearRightEdge = rightOverhang > 0 && rightOverhang < this.player.width * 0.7;
                
                this.player.isBalancing = nearLeftEdge || nearRightEdge;
                
                if (this.player.isBalancing && !this.player.wasBalancing) {
                    this.soundManager.playEdge();
                }
                
                this.player.wasBalancing = this.player.isBalancing;
            } else {
                this.player.isBalancing = false;
                this.player.wasBalancing = false;
            }
        }
        
        this.camera.update(this.player.y);
        
        this.deathFloor += this.deathFloorSpeed * dt;
        this.deathFloorSpeed += this.deathFloorAcceleration * dt;
        
        this.platformManager.update(this.camera.y, this.currentFloor);
        
        if (this.player.isGrounded) {
            const playerFloor = this.platformManager.getPlayerFloor(this.player.y);
            if (playerFloor !== this.currentFloor) {
                if (playerFloor > this.currentFloor) {
                    this.score += 10;
                    this.ui.updateScore(this.score);
                    
                    if (playerFloor >= this.nextDiscoFloor && playerFloor > this.lastDiscoFloor) {
                        const duration = this.soundManager.playRecordBreak();
                        this.discoMode = true;
                        this.discoTimer = duration / 16.67;
                        this.lastDiscoFloor = playerFloor;
                        this.nextDiscoFloor += 50;
                    }
                }
                this.currentFloor = playerFloor;
                this.ui.updateFloor(this.currentFloor);
            }
        }
        
        if (this.player.justLanded) {
            const floorsSkipped = this.player.floorsSkipped;
            if (floorsSkipped > 0) {
                const comboData = this.comboSystem.addCombo(floorsSkipped);
                this.score += comboData.points;
                this.ui.updateScore(this.score);
                
                if (comboData.text) {
                    this.ui.showComboText(comboData.text);
                    this.soundManager.playComboByFloors(floorsSkipped);
                }
                
                if (comboData.combo > this.bestCombo) {
                    this.bestCombo = comboData.combo;
                }
            }
            this.player.justLanded = false;
        }
        
        const comboUpdate = this.comboSystem.update(dt);
        
        if (this.discoMode) {
            this.discoTimer -= dt;
            this.discoColorChangeTimer += dt;
            
            if (this.discoColorChangeTimer >= this.discoColorChangeSpeed) {
                this.discoColorIndex = (this.discoColorIndex + 1) % this.discoColors.length;
                this.discoColorChangeTimer = 0;
            }
            
            if (this.discoTimer <= 0) {
                this.discoMode = false;
                this.discoTimer = 0;
                this.discoColorIndex = 0;
                this.discoColorChangeTimer = 0;
            }
        }
        
        this.ui.updateCombo(this.comboSystem.currentCombo, this.comboSystem.comboTimer / this.comboSystem.comboMaxTime);
        
        const playerScreenY = this.player.y - this.camera.y;
        const deathScreenY = this.deathFloor - this.camera.y;
        
        if (playerScreenY > this.height || this.player.y > this.deathFloor + this.height) {
            this.gameOver();
        }
        
        if (this.shakeAmount > 0.1) {
            this.shakeAmount *= this.shakeDecay;
        } else {
            this.shakeAmount = 0;
        }
    }
    
    render() {
        this.ctx.save();
        if (this.shakeAmount > 0) {
            const shakeX = (Math.random() - 0.5) * this.shakeAmount;
            const shakeY = (Math.random() - 0.5) * this.shakeAmount;
            this.ctx.translate(shakeX, shakeY);
        }
        
        if (this.discoMode) {
            const currentColor = this.discoColors[this.discoColorIndex];
            
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, '#87ceeb');
            gradient.addColorStop(0.5, currentColor + '40');
            gradient.addColorStop(1, '#e0f6ff');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            for (let i = 0; i < 2; i++) {
                const x = Math.random() * this.width;
                const y = Math.random() * this.height;
                const size = Math.random() * 50 + 30;
                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        } else {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, '#87ceeb');
            gradient.addColorStop(1, '#e0f6ff');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
        
        if (this.state === 'playing') {
            this.platformManager.render(
                this.ctx, 
                this.camera.y, 
                this.discoMode, 
                this.discoColors[this.discoColorIndex]
            );
            
            this.player.render(
                this.ctx, 
                this.camera.y, 
                this.discoMode, 
                this.discoColors[this.discoColorIndex]
            );
            
            const deathScreenY = this.deathFloor - this.camera.y;
            if (deathScreenY < this.height + 100) {
                this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
                this.ctx.fillRect(0, deathScreenY, this.width, this.height - deathScreenY);
                
                this.ctx.strokeStyle = '#ff0000';
                this.ctx.lineWidth = 3;
                this.ctx.setLineDash([10, 5]);
                this.ctx.beginPath();
                this.ctx.moveTo(0, deathScreenY);
                this.ctx.lineTo(this.width, deathScreenY);
                this.ctx.stroke();
                this.ctx.setLineDash([]);
            }
        }
        
        this.ctx.restore();
    }
    
    gameOver() {
        this.state = 'gameOver';
        
        this.soundManager.playFalling();
        
        this.ui.hideHUD();
        this.ui.showGameOver(this.currentFloor, this.score, this.bestCombo);
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('icyTowerHighScore', this.highScore);
            this.ui.updateHighScore(this.highScore);
        }
    }
}
