export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.previousJumpState = false;
        
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }
    
    handleKeyDown(e) {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
            e.preventDefault();
        }
        
        this.keys[e.key] = true;
        this.updatePlayerInput();
    }
    
    handleKeyUp(e) {
        this.keys[e.key] = false;
        this.updatePlayerInput();
    }
    
    updatePlayerInput() {
        const player = this.game.player;
        
        player.moveLeft = this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A'];
        player.moveRight = this.keys['ArrowRight'] || this.keys['d'] || this.keys['D'];
        
        const currentJumpState = this.keys[' '] || this.keys['ArrowUp'] || this.keys['w'] || this.keys['W'];
        player.jumpPressed = currentJumpState;
        
        if (currentJumpState && !this.previousJumpState) {
            player.jumpJustPressed = true;
        }
        
        this.previousJumpState = currentJumpState;
    }
}
