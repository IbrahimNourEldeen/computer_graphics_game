export class Camera {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.y = 0;
        this.targetY = 0;
        this.smoothing = 0.1;
    }
    
    reset() {
        this.y = 0;
        this.targetY = 0;
    }
    
    update(playerY) {
        const playerScreenY = playerY - this.y;
        const threshold = this.height * 0.4;
        
        if (playerScreenY < threshold) {
            this.targetY = playerY - threshold;
        }
        
        this.y += (this.targetY - this.y) * this.smoothing;
    }
}
