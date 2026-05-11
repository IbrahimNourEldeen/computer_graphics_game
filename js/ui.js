export class UI {
    constructor() {
        this.mainMenu = document.getElementById('main-menu');
        this.gameOverMenu = document.getElementById('game-over-menu');
        this.hud = document.getElementById('hud');
        
        this.floorCounter = document.getElementById('floor-counter');
        this.scoreCounter = document.getElementById('score-counter');
        this.comboCounter = document.getElementById('combo-counter');
        this.comboBar = document.getElementById('combo-bar');
        
        this.highScoreDisplay = document.getElementById('high-score');
        this.finalFloor = document.getElementById('final-floor');
        this.finalScore = document.getElementById('final-score');
        this.bestCombo = document.getElementById('best-combo');
        
        this.comboText = document.getElementById('combo-text');
        this.comboTextTimeout = null;
    }
    
    showMenu(menuId) {
        const menu = document.getElementById(menuId);
        if (menu) {
            menu.classList.remove('hidden');
        }
    }
    
    hideMenu(menuId) {
        const menu = document.getElementById(menuId);
        if (menu) {
            menu.classList.add('hidden');
        }
    }
    
    showHUD() {
        this.hud.classList.remove('hidden');
    }
    
    hideHUD() {
        this.hud.classList.add('hidden');
    }
    
    updateFloor(floor) {
        this.floorCounter.textContent = floor;
    }
    
    updateScore(score) {
        this.scoreCounter.textContent = score;
    }
    
    updateCombo(combo, timerPercent) {
        this.comboCounter.textContent = `Combo: ${combo}`;
        this.comboBar.style.width = `${timerPercent * 100}%`;
        
        if (combo >= 20) {
            this.comboBar.style.background = 'linear-gradient(90deg, #f368e0, #c44569)';
        } else if (combo >= 10) {
            this.comboBar.style.background = 'linear-gradient(90deg, #ee5a6f, #c44569)';
        } else if (combo >= 5) {
            this.comboBar.style.background = 'linear-gradient(90deg, #ff6b6b, #feca57)';
        } else {
            this.comboBar.style.background = 'linear-gradient(90deg, #ff6b6b, #feca57)';
        }
    }
    
    updateHighScore(score) {
        this.highScoreDisplay.textContent = score;
    }
    
    showComboText(text) {
        if (this.comboTextTimeout) {
            clearTimeout(this.comboTextTimeout);
        }
        
        this.comboText.textContent = text;
        this.comboText.style.animation = 'none';
        
        void this.comboText.offsetWidth;
        
        this.comboText.style.animation = 'comboPopup 0.8s ease-out';
        
        this.comboTextTimeout = setTimeout(() => {
            this.comboText.textContent = '';
        }, 800);
    }
    
    showGameOver(floor, score, bestCombo) {
        this.finalFloor.textContent = floor;
        this.finalScore.textContent = score;
        this.bestCombo.textContent = bestCombo;
        this.showMenu('game-over-menu');
    }
}
