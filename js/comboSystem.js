export class ComboSystem {
    constructor() {
        this.currentCombo = 0;
        this.comboTimer = 0;
        this.comboMaxTime = 100;
        this.bestComboInSession = 0;
        
        this.comboMessages = [
            { threshold: 4, text: 'Good!', color: '#4ecca3' },
            { threshold: 7, text: 'Sweet!', color: '#48dbfb' },
            { threshold: 10, text: 'Great!', color: '#feca57' },
            { threshold: 13, text: 'Super!', color: '#ff9ff3' },
            { threshold: 16, text: 'WOW!', color: '#ff6b6b' },
            { threshold: 21, text: 'Amazing!', color: '#ee5a6f' },
            { threshold: 25, text: 'EXTREME!', color: '#c44569' },
            { threshold: 30, text: 'Fantastic!', color: '#f368e0' },
            { threshold: 35, text: 'UNBELIEVABLE!', color: '#fd79a8' }
        ];
    }
    
    reset() {
        this.currentCombo = 0;
        this.comboTimer = 0;
        this.bestComboInSession = 0;
    }
    
    addCombo(floorsSkipped) {
        if (this.comboTimer > 0) {
            this.currentCombo++;
        } else {
            this.currentCombo = 1;
        }
        
        this.comboTimer = this.comboMaxTime;
        
        const basePoints = floorsSkipped * 10;
        const comboMultiplier = Math.pow(1.5, this.currentCombo - 1);
        const points = Math.floor(basePoints * comboMultiplier);
        
        let message = null;
        for (let i = this.comboMessages.length - 1; i >= 0; i--) {
            if (floorsSkipped >= this.comboMessages[i].threshold) {
                message = this.comboMessages[i];
                break;
            }
        }
        
        return {
            combo: this.currentCombo,
            points: points,
            floorsSkipped: floorsSkipped,
            text: message ? message.text : null,
            color: message ? message.color : null
        };
    }
    
    update(dt) {
        if (this.comboTimer > 0) {
            this.comboTimer -= dt;
            if (this.comboTimer <= 0) {
                const wasRecord = this.currentCombo > this.bestComboInSession;
                if (wasRecord && this.currentCombo >= 3) {
                    this.bestComboInSession = this.currentCombo;
                }
                
                this.currentCombo = 0;
                this.comboTimer = 0;
                
                return { comboEnded: true, wasRecord: wasRecord };
            }
        }
        return { comboEnded: false, wasRecord: false };
    }
}
