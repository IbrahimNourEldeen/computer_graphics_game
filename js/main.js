import { Game } from './game.js';
import { InputHandler } from './input.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 800;
    canvas.height = 600;
    
    const game = new Game(canvas, ctx);
    const input = new InputHandler(game);
    
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    
    let musicStarted = false;
    
    const startMusic = () => {
        if (!musicStarted) {
            game.soundManager.playBackgroundMusic();
            musicStarted = true;
        }
    };
    
    document.addEventListener('click', startMusic, { once: true });
    document.addEventListener('keydown', startMusic, { once: true });
    
    startButton.addEventListener('click', () => {
        startMusic();
        game.start();
    });
    
    restartButton.addEventListener('click', () => {
        game.restart();
    });
    
    let lastTime = 0;
    
    function gameLoop(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        
        game.update(deltaTime);
        game.render();
        
        requestAnimationFrame(gameLoop);
    }
    
    requestAnimationFrame(gameLoop);
});
