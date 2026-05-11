export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
        this.displayHeight = 50;
        this.displayWidth = 40;
        
        this.width = 35;
        this.height = 45;
        
        this.image = new Image();
        this.image.src = 'assets/player.png';
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        
        this.velocityX = 0;
        this.velocityY = 0;
        this.acceleration = 0.8;
        this.friction = 0.92;
        this.maxSpeed = 15;
        this.gravity = 0.6;
        this.maxFallSpeed = 20;
        
        this.baseJumpPower = 12;
        this.momentumFactor = 0.5;
        this.minJumpPower = 8;
        this.jumpHoldGravityReduction = 0.4;
        this.maxJumpHoldTime = 15;
        this.isGrounded = false;
        this.canJump = false;
        this.isJumping = false;
        this.jumpHoldTimer = 0;
        
        this.superJumpThreshold = 12;
        this.superJumpMultiplier = 1.8;
        this.isSuperJump = false;
        this.justWallBounced = false;
        this.wallBounceTimer = 0;
        this.wallBounceWindow = 10;
        
        this.wallBounceMultiplier = 0.8;
        this.minWallBounceSpeed = 8;
        
        this.moveLeft = false;
        this.moveRight = false;
        this.jumpPressed = false;
        this.jumpJustPressed = false;
        
        this.lastPlatformY = y;
        this.floorsSkipped = 0;
        this.justLanded = false;
        
        this.facingRight = true;
        this.rotation = 0;
        this.rotationSpeed = 0;
        this.targetRotation = 0;
        
        this.isBalancing = false;
        this.wasBalancing = false;
    }
    
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isGrounded = false;
        this.canJump = false;
        this.isJumping = false;
        this.jumpHoldTimer = 0;
        this.isSuperJump = false;
        this.justWallBounced = false;
        this.wallBounceTimer = 0;
        this.lastPlatformY = y;
        this.floorsSkipped = 0;
        this.justLanded = false;
        this.facingRight = true;
        this.rotation = 0;
        this.rotationSpeed = 0;
        this.targetRotation = 0;
        this.jumpJustPressed = false;
        this.isBalancing = false;
        this.wasBalancing = false;
    }
    
    update(dt, platforms) {
        this.justLanded = false;
        
        if (this.wallBounceTimer > 0) {
            this.wallBounceTimer -= dt;
            if (this.wallBounceTimer <= 0) {
                this.justWallBounced = false;
            }
        }
        
        if (this.moveLeft) {
            this.velocityX -= this.acceleration * dt;
            this.facingRight = false;
        }
        if (this.moveRight) {
            this.velocityX += this.acceleration * dt;
            this.facingRight = true;
        }
        
        this.velocityX *= Math.pow(this.friction, dt);
        
        this.velocityX = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.velocityX));
        
        if (this.jumpJustPressed && this.canJump) {
            const currentSpeed = Math.abs(this.velocityX);
            
            const canSuperJump = this.justWallBounced || currentSpeed >= this.superJumpThreshold;
            
            if (canSuperJump) {
                this.isSuperJump = true;
                const speedBonus = currentSpeed * this.momentumFactor;
                this.velocityY = -(this.baseJumpPower + speedBonus) * this.superJumpMultiplier;
                
                this.targetRotation = Math.PI * 2;
                this.rotationSpeed = this.targetRotation / 30;
            } else {
                this.isSuperJump = false;
                const speedBonus = currentSpeed * this.momentumFactor;
                this.velocityY = -(this.baseJumpPower + speedBonus);
                
                if (currentSpeed > 3) {
                    this.targetRotation = Math.PI * 2;
                    this.rotationSpeed = this.targetRotation / 40;
                } else {
                    this.targetRotation = 0;
                    this.rotationSpeed = 0;
                }
            }
            
            this.isGrounded = false;
            this.canJump = false;
            this.isJumping = true;
            this.jumpHoldTimer = 0;
            this.justWallBounced = false;
            this.jumpJustPressed = false;
        }
        
        if (this.isJumping && this.jumpPressed && this.jumpHoldTimer < this.maxJumpHoldTime) {
            this.jumpHoldTimer += dt;
            const reducedGravity = this.gravity * this.jumpHoldGravityReduction;
            this.velocityY += reducedGravity * dt;
        } else if (!this.isGrounded) {
            this.velocityY += this.gravity * dt;
        }
        
        if (!this.jumpPressed || this.velocityY > 0) {
            this.isJumping = false;
        }
        
        this.velocityY = Math.min(this.velocityY, this.maxFallSpeed);
        
        if (!this.isGrounded) {
            this.rotation += this.rotationSpeed * dt;
        } else {
            this.rotation = 0;
            this.rotationSpeed = 0;
            this.targetRotation = 0;
            this.isSuperJump = false;
        }
        
        this.x += this.velocityX * dt;
        this.y += this.velocityY * dt;
        
        if (this.x < this.width / 2) {
            this.x = this.width / 2;
            const speed = Math.abs(this.velocityX);
            
            if (speed > this.minWallBounceSpeed) {
                this.velocityX = -this.velocityX * this.wallBounceMultiplier;
                this.justWallBounced = true;
                this.wallBounceTimer = this.wallBounceWindow;
            } else if (speed > 1) {
                this.velocityX = -this.velocityX * 0.5;
            } else {
                this.velocityX = 0;
            }
        }
        
        const maxX = 800 - this.width / 2;
        if (this.x > maxX) {
            this.x = maxX;
            const speed = Math.abs(this.velocityX);
            
            if (speed > this.minWallBounceSpeed) {
                this.velocityX = -this.velocityX * this.wallBounceMultiplier;
                this.justWallBounced = true;
                this.wallBounceTimer = this.wallBounceWindow;
            } else if (speed > 1) {
                this.velocityX = -this.velocityX * 0.5;
            } else {
                this.velocityX = 0;
            }
        }
        
        this.isGrounded = false;
        
        for (const platform of platforms) {
            if (this.velocityY >= 0) {
                const playerBottom = this.y + this.height / 2;
                const playerLeft = this.x - this.width / 2;
                const playerRight = this.x + this.width / 2;
                
                const platformTop = platform.y;
                const platformBottom = platform.y + platform.height;
                const platformLeft = platform.x;
                const platformRight = platform.x + platform.width;
                
                if (playerBottom >= platformTop && 
                    playerBottom <= platformBottom &&
                    playerRight > platformLeft && 
                    playerLeft < platformRight) {
                    
                    this.y = platformTop - this.height / 2;
                    this.velocityY = 0;
                    this.isGrounded = true;
                    this.canJump = true;
                    
                    if (platform.y < this.lastPlatformY - 10) {
                        const floorHeight = 80;
                        this.floorsSkipped = Math.floor((this.lastPlatformY - platform.y) / floorHeight);
                        this.justLanded = true;
                    } else {
                        this.floorsSkipped = 0;
                    }
                    
                    this.lastPlatformY = platform.y;
                    break;
                }
            }
        }
    }
    
    render(ctx, cameraY, discoMode = false, discoColor = '#ff0080') {
        const screenY = this.y - cameraY;
        
        ctx.save();
        ctx.translate(this.x, screenY);
        
        ctx.rotate(this.rotation);
        
        if (!this.facingRight) {
            ctx.scale(-1, 1);
        }
        
        if (this.imageLoaded) {
            if (discoMode) {
                ctx.shadowColor = discoColor;
                ctx.shadowBlur = 15;
            } else if (this.isSuperJump) {
                ctx.shadowColor = '#ffff00';
                ctx.shadowBlur = 20;
            }
            
            ctx.drawImage(
                this.image,
                -this.displayWidth / 2,
                -this.displayHeight / 2,
                this.displayWidth,
                this.displayHeight
            );
            
            ctx.shadowBlur = 0;
        } else {
            if (discoMode) {
                ctx.shadowColor = discoColor;
                ctx.shadowBlur = 15;
            } else if (this.isSuperJump) {
                ctx.shadowColor = '#ffff00';
                ctx.shadowBlur = 20;
            }
            
            ctx.fillStyle = this.isSuperJump ? '#ff4757' : '#ff6b6b';
            ctx.fillRect(-this.displayWidth / 2, -this.displayHeight / 2, this.displayWidth, this.displayHeight * 0.6);
            
            ctx.fillStyle = this.isSuperJump ? '#ffd93d' : '#ffd93d';
            ctx.fillRect(-this.displayWidth / 2 + 5, -this.displayHeight / 2 - 10, this.displayWidth - 10, 15);
            
            ctx.fillStyle = '#000';
            ctx.fillRect(-this.displayWidth / 2 + 10, -this.displayHeight / 2 - 5, 4, 4);
            ctx.fillRect(-this.displayWidth / 2 + 18, -this.displayHeight / 2 - 5, 4, 4);
            
            ctx.fillStyle = '#4a4a4a';
            ctx.fillRect(-this.displayWidth / 2 + 5, this.displayHeight / 2 - 15, 8, 15);
            ctx.fillRect(-this.displayWidth / 2 + 17, this.displayHeight / 2 - 15, 8, 15);
            
            ctx.fillStyle = '#2d2d2d';
            ctx.fillRect(-this.displayWidth / 2 + 3, this.displayHeight / 2 - 3, 10, 5);
            ctx.fillRect(-this.displayWidth / 2 + 15, this.displayHeight / 2 - 3, 10, 5);
            
            ctx.shadowBlur = 0;
        }
        
        ctx.restore();
    }
}
