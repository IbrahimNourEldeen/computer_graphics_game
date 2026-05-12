export class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        
        this.loadSound('edge', 'sound/edge.ogg');
        this.loadSound('falling', 'sound/falling.ogg');
        this.loadSound('jump_lo', 'sound/jump_lo.ogg');
        this.loadSound('jump_mid', 'sound/jump_mid.ogg');
        this.loadSound('jump_hi', 'sound/jump_hi.ogg');
        this.loadSound('wazup', 'sound/wazup.ogg');
        this.loadSound('yo', 'sound/yo.ogg');
        
        this.loadSound('good', 'sound/good.ogg');
        this.loadSound('sweet', 'sound/sweet.ogg');
        this.loadSound('great', 'sound/great.ogg');
        this.loadSound('super', 'sound/super.ogg');
        this.loadSound('wow', 'sound/wow.ogg');
        this.loadSound('amazing', 'sound/amazing.ogg');
        this.loadSound('extreme', 'sound/extreme.ogg');
        this.loadSound('fantastic', 'sound/fantastic.ogg');
        this.loadSound('unbelievable', 'sound/unbelievable.ogg');
        this.loadSound('aight', 'sound/aight.ogg');
        this.loadSound('cheer', 'sound/cheer.ogg');
        
        this.bgMusic = new Audio('sound/icy_tower_theme.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.3;
        this.isMusicPlaying = false;
    }
    
    loadSound(name, path) {
        const audio = new Audio(path);
        audio.preload = 'auto';
        this.sounds[name] = audio;
    }
    
    play(name, volume = 1.0) {
        if (!this.enabled || !this.sounds[name]) return;
        
        const sound = this.sounds[name].cloneNode();
        sound.volume = volume;
        sound.play().catch(err => {
            console.log(`Sound ${name} could not play:`, err);
        });
    }
    
    playJump(speed) {
        const absSpeed = Math.abs(speed);
        
        if (absSpeed < 5) {
            this.play('jump_lo', 0.7);
        } else if (absSpeed < 12) {
            this.play('jump_mid', 0.8);
        } else {
            this.play('jump_hi', 0.9);
        }
    }
    
    playCombo(combo) {
        if (combo === 1) {
            this.play('yo', 0.8);
        } else if (combo >= 4) {
            this.play('wazup', 0.9);
        }
    }
    
    playComboByFloors(floorsSkipped) {
        if (floorsSkipped >= 35) {
            this.play('unbelievable', 0.95);
        } else if (floorsSkipped >= 30) {
            this.play('fantastic', 0.95);
        } else if (floorsSkipped >= 25) {
            this.play('extreme', 0.9);
        } else if (floorsSkipped >= 21) {
            this.play('amazing', 0.9);
        } else if (floorsSkipped >= 16) {
            this.play('wow', 0.85);
        } else if (floorsSkipped >= 13) {
            this.play('super', 0.85);
        } else if (floorsSkipped >= 10) {
            this.play('great', 0.8);
        } else if (floorsSkipped >= 7) {
            this.play('sweet', 0.8);
        } else if (floorsSkipped >= 4) {
            this.play('good', 0.75);
        }
    }
    
    playRecordBreak() {
        const random = Math.random();
        let duration = 3000;
        
        if (random > 0.5) {
            this.play('aight', 0.9);
            duration = 3000;
        } else {
            this.play('cheer', 0.9);
            duration = 3000;
        }
        
        return duration;
    }
    
    playEdge() {
        this.play('edge', 0.6);
    }
    
    playFalling() {
        this.play('falling', 1.0);
    }
    
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
    
    playBackgroundMusic() {
        if (!this.isMusicPlaying) {
            this.bgMusic.play().catch(err => {
                console.log('Background music could not play:', err);
            });
            this.isMusicPlaying = true;
        }
    }
    
    stopBackgroundMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
        this.isMusicPlaying = false;
    }
    
    pauseBackgroundMusic() {
        this.bgMusic.pause();
        this.isMusicPlaying = false;
    }
    
    resumeBackgroundMusic() {
        if (!this.isMusicPlaying) {
            this.bgMusic.play().catch(err => {
                console.log('Background music could not resume:', err);
            });
            this.isMusicPlaying = true;
        }
    }
}
