export class PlatformManager {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.platforms = [];
        
        this.baseFloorHeight = 120;
        this.minPlatformWidth = 200;
        this.maxPlatformWidth = 400;
        this.platformHeight = 40;
        
        this.startingY = canvasHeight - 100;
        
        this.difficultyFactor = 0;
        
        this.platformTypes = [
            { name: 'wood', color: '#8B4513', accent: '#A0522D' },
            { name: 'ice', color: '#B0E0E6', accent: '#87CEEB' },
            { name: 'stone', color: '#696969', accent: '#808080' },
            { name: 'metal', color: '#4A4A4A', accent: '#6A6A6A' },
            { name: 'crystal', color: '#9370DB', accent: '#BA55D3' }
        ];
        
        this.reset();
    }
    
    reset() {
        this.platforms = [];
        this.difficultyFactor = 0;
        this.highestPlatformY = this.canvasHeight - 180;
        this.startingY = this.canvasHeight - 100;
        
        this.createInitialPlatforms();
    }
    
    createInitialPlatforms() {
        this.platforms.push({
            x: 0,
            y: this.canvasHeight - 100,
            width: this.canvasWidth,
            height: this.platformHeight,
            floor: 0,
            type: this.platformTypes[0]
        });
        
        let currentY = this.canvasHeight - 180;
        let floor = 1;
        
        while (currentY > -this.canvasHeight) {
            this.createPlatform(currentY, floor);
            currentY -= this.getFloorHeight(floor);
            floor++;
        }
    }
    
    createPlatform(y, floor) {
        this.difficultyFactor = Math.min(floor / 100, 3);
        
        const widthReduction = this.difficultyFactor * 50;
        const width = Math.random() * (this.maxPlatformWidth - this.minPlatformWidth - widthReduction) 
                     + this.minPlatformWidth - widthReduction;
        
        const maxX = this.canvasWidth - width;
        const x = Math.random() * maxX;
        
        const typeIndex = Math.floor(floor / 100) % this.platformTypes.length;
        const type = this.platformTypes[typeIndex];
        
        this.platforms.push({
            x: x,
            y: y,
            width: width,
            height: this.platformHeight,
            floor: floor,
            type: type
        });
        
        this.highestPlatformY = Math.min(this.highestPlatformY, y);
    }
    
    getFloorHeight(floor) {
        const heightIncrease = this.difficultyFactor * 20;
        return this.baseFloorHeight + heightIncrease + Math.random() * 20;
    }
    
    update(cameraY) {
        this.platforms = this.platforms.filter(platform => {
            return platform.y < cameraY + this.canvasHeight + 200;
        });
        
        while (this.highestPlatformY > cameraY - this.canvasHeight) {
            const floor = Math.floor((this.canvasHeight - this.highestPlatformY) / this.baseFloorHeight);
            this.highestPlatformY -= this.getFloorHeight(floor);
            this.createPlatform(this.highestPlatformY, floor);
        }
    }
    
    render(ctx, cameraY, discoMode = false, discoColor = '#ff0080') {
        for (const platform of this.platforms) {
            const screenY = platform.y - cameraY;
            
            if (screenY > -50 && screenY < this.canvasHeight + 50) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.fillRect(platform.x + 4, screenY + platform.height - 8, platform.width, 8);
                
                if (discoMode) {
                    ctx.fillStyle = platform.type.color;
                    ctx.fillRect(platform.x, screenY, platform.width, platform.height);
                    
                    ctx.fillStyle = discoColor + '30';
                    ctx.fillRect(platform.x, screenY, platform.width, platform.height);
                } else {
                    ctx.fillStyle = platform.type.color;
                    ctx.fillRect(platform.x, screenY, platform.width, platform.height);
                }
                
                if (discoMode) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                } else {
                    ctx.fillStyle = platform.type.accent;
                }
                ctx.fillRect(platform.x, screenY, platform.width, platform.height / 4);
                
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fillRect(platform.x, screenY, 3, platform.height);
                
                ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.fillRect(platform.x + platform.width - 3, screenY, 3, platform.height);
                
                ctx.strokeStyle = discoMode ? 'rgba(255, 255, 255, 0.5)' : '#000';
                ctx.lineWidth = 2;
                
                ctx.beginPath();
                ctx.moveTo(platform.x + 5, screenY);
                ctx.lineTo(platform.x + platform.width - 5, screenY);
                ctx.quadraticCurveTo(platform.x + platform.width, screenY, platform.x + platform.width, screenY + 5);
                ctx.lineTo(platform.x + platform.width, screenY + platform.height - 5);
                ctx.quadraticCurveTo(platform.x + platform.width, screenY + platform.height, platform.x + platform.width - 5, screenY + platform.height);
                ctx.lineTo(platform.x + 5, screenY + platform.height);
                ctx.quadraticCurveTo(platform.x, screenY + platform.height, platform.x, screenY + platform.height - 5);
                ctx.lineTo(platform.x, screenY + 5);
                ctx.quadraticCurveTo(platform.x, screenY, platform.x + 5, screenY);
                ctx.stroke();
                
                ctx.strokeStyle = discoMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
                ctx.lineWidth = 1;
                for (let i = 0; i < platform.width; i += 25) {
                    ctx.beginPath();
                    ctx.moveTo(platform.x + i, screenY + platform.height / 4);
                    ctx.lineTo(platform.x + i, screenY + platform.height - 8);
                    ctx.stroke();
                }
            }
        }
    }
    
    getPlayerFloor(playerY) {
        const playerFeetY = playerY + 22.5;
        
        let closestPlatform = null;
        let minDistance = Infinity;
        
        for (const platform of this.platforms) {
            if (platform.y >= playerFeetY && platform.y <= playerFeetY + 100) {
                const distance = platform.y - playerFeetY;
                if (distance < minDistance) {
                    minDistance = distance;
                    closestPlatform = platform;
                }
            }
        }
        
        if (closestPlatform) {
            return closestPlatform.floor;
        }
        
        let highestFloor = 0;
        for (const platform of this.platforms) {
            if (platform.y < playerFeetY && platform.floor > highestFloor) {
                highestFloor = platform.floor;
            }
        }
        
        return highestFloor;
    }
}
