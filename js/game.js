// ============ GAME ENGINE ============

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.running = false;
        this.paused = false;
        this.state = 'menu'; // 'menu', 'playing', 'levelComplete', 'gameOver'
        
        // Game objects
        this.player = null;
        this.dungeon = null;
        this.level = 1;
        
        // Timing
        this.lastFrameTime = Date.now();
        this.deltaTime = 0;
        this.fps = 0;
        
        // Input
        this.keysPressed = {};
        
        // Game events
        this.events = new EventEmitter();
        
        // Setup
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Keyboard
        document.addEventListener('keydown', (e) => {
            this.keysPressed[e.key] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keysPressed[e.key] = false;
        });
        
        // Mouse (for click-to-move or attacks in future)
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handleCanvasClick(x, y);
        });
        
        // Buttons
        document.getElementById('startBtn').addEventListener('click', () => this.startNewGame());
        document.getElementById('continueBtn').addEventListener('click', () => this.continueGame());
        document.getElementById('retryBtn').addEventListener('click', () => this.retryLevel());
        document.getElementById('nextLevelBtn').addEventListener('click', () => this.nextLevel());
        document.getElementById('menuBtn').addEventListener('click', () => this.showMenu());
        document.getElementById('menuBtn2').addEventListener('click', () => this.showMenu());
    }
    
    startNewGame() {
        const selected = document.querySelector('.avatar-option.selected');
        const avatar = selected ? selected.textContent : '🧑';
        
        this.player = new Player(50, 50, avatar);
        this.level = 1;
        this.dungeon = new Dungeon(this.level);
        this.state = 'playing';
        this.running = true;
        
        this.hideMenus();
        document.getElementById('gameContainer').classList.add('active');
        this.gameLoop();
    }
    
    continueGame() {
        const saved = Storage.load('gameProgress');
        if (saved) {
            this.player = Object.assign(new Player(), saved.player);
            this.level = saved.level;
            this.dungeon = new Dungeon(this.level);
            this.state = 'playing';
            this.running = true;
            
            this.hideMenus();
            document.getElementById('gameContainer').classList.add('active');
            this.gameLoop();
        } else {
            alert('No saved game found!');
        }
    }
    
    retryLevel() {
        this.player.health = this.player.maxHealth;
        this.player.waterFlow = 0;
        this.dungeon = new Dungeon(this.level);
        this.state = 'playing';
        this.running = true;
        
        this.hideMenus();
        this.gameLoop();
    }
    
    nextLevel() {
        this.level++;
        this.player.level = this.level;
        this.dungeon = new Dungeon(this.level);
        this.state = 'playing';
        this.running = true;
        
        this.hideMenus();
        this.gameLoop();
    }
    
    showMenu() {
        this.running = false;
        this.state = 'menu';
        document.getElementById('mainMenu').classList.add('active');
        document.getElementById('gameContainer').classList.remove('active');
        document.getElementById('gameOverModal').classList.remove('active');
        document.getElementById('levelCompleteModal').classList.remove('active');
    }
    
    hideMenus() {
        document.getElementById('mainMenu').classList.remove('active');
        document.getElementById('gameOverModal').classList.remove('active');
        document.getElementById('levelCompleteModal').classList.remove('active');
    }
    
    handleCanvasClick(x, y) {
        if (this.state !== 'playing' || !this.player) return;
        
        // Could implement special attacks or interactions here
        // For now, just log for debugging
    }
    
    update(dt) {
        if (!this.player || !this.dungeon) return;
        
        // Player input
        this.player.handleInput(this.keysPressed);
        
        // Update game objects
        this.player.update(dt, this.dungeon);
        this.dungeon.update(dt, this.player);
        
        // Collision detection: player vs enemies
        const enemies = this.dungeon.getEnemies();
        for (const enemy of enemies) {
            if (rectsOverlap(this.player.getRect(), enemy.getRect())) {
                const survived = this.player.takeDamage(10);
                if (!survived) {
                    this.endLevel(false, 'Defeated by enemies!');
                }
            }
        }
        
        // Collision detection: player vs collectibles
        const collectibles = this.dungeon.getCollectibles();
        for (const collectible of collectibles) {
            if (rectsOverlap(this.player.getRect(), collectible.getRect())) {
                if (collectible instanceof WaterCrystal) {
                    this.player.addCredits(collectible.value);
                    this.player.addWaterFlow(5);
                    collectible.collected = true;
                    collectible.active = false;
                } else if (collectible instanceof PowerUp) {
                    this.player.activatePowerUp(collectible.type, collectible.duration);
                    collectible.collected = true;
                    collectible.active = false;
                }
            }
        }
        
        // Check if player reached exit
        const exitDist = distance(
            this.player.x + this.player.w / 2,
            this.player.y + this.player.h / 2,
            this.dungeon.exitPosition.x,
            this.dungeon.exitPosition.y
        );
        
        if (exitDist < 40) {
            this.endLevel(true, `Level ${this.level} Complete!`);
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#0f1419';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.dungeon) {
            this.dungeon.draw(this.ctx);
        }
        
        if (this.player) {
            this.player.draw(this.ctx);
        }
        
        // Debug info
        this.drawDebugInfo();
    }
    
    drawDebugInfo() {
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`FPS: ${this.fps.toFixed(1)}`, 10, 20);
        this.ctx.fillText(`Pos: ${this.player.x.toFixed(0)}, ${this.player.y.toFixed(0)}`, 10, 35);
        this.ctx.fillText(`Credits: ${this.player.credits}`, 10, 50);
    }
    
    updateHUD() {
        // Health bar
        const healthPercent = this.player.health / this.player.maxHealth;
        document.querySelector('#healthBar .fill').style.width = (healthPercent * 100) + '%';
        
        // Water flow bar
        const waterPercent = this.player.waterFlow / this.player.maxWaterFlow;
        document.querySelector('#waterBar .fill').style.width = (waterPercent * 100) + '%';
        
        // Credits
        document.getElementById('creditsDisplay').textContent = this.player.credits;
        
        // Level
        document.getElementById('levelNumber').textContent = this.level;
    }
    
    endLevel(success, message) {
        this.running = false;
        this.state = success ? 'levelComplete' : 'gameOver';
        
        // Save progress
        Storage.save('gameProgress', {
            player: this.player,
            level: this.level
        });
        
        if (success) {
            this.showLevelComplete(message);
        } else {
            this.showGameOver(message);
        }
    }
    
    showGameOver(message) {
        document.getElementById('gameOverTitle').textContent = 'Mission Failed';
        document.getElementById('gameOverMessage').textContent = message;
        document.getElementById('scoreDisplay').textContent = `Credits Earned: ${this.player.credits}`;
        
        // Show earned badges
        if (this.player.badges.size > 0) {
            const badgesList = document.getElementById('badgesList');
            badgesList.innerHTML = '';
            for (const badge of this.player.badges) {
                const badgeEl = document.createElement('div');
                badgeEl.className = 'badge';
                badgeEl.textContent = badge;
                badgesList.appendChild(badgeEl);
            }
            document.getElementById('badgesEarned').style.display = 'block';
        } else {
            document.getElementById('badgesEarned').style.display = 'none';
        }
        
        document.getElementById('gameOverModal').classList.add('active');
    }
    
    showLevelComplete(message) {
        document.getElementById('levelCompleteMessage').textContent = message;
        document.getElementById('rewardCredits').textContent = this.player.credits;
        
        // Show earned badges
        if (this.player.badges.size > 0) {
            const badgesList = document.getElementById('badgesList2');
            badgesList.innerHTML = '';
            for (const badge of this.player.badges) {
                const badgeEl = document.createElement('div');
                badgeEl.className = 'badge';
                badgeEl.textContent = badge;
                badgesList.appendChild(badgeEl);
            }
            document.getElementById('badgesEarned2').style.display = 'block';
        } else {
            document.getElementById('badgesEarned2').style.display = 'none';
        }
        
        document.getElementById('levelCompleteModal').classList.add('active');
    }
    
    gameLoop = () => {
        const now = Date.now();
        const dt = Math.min((now - this.lastFrameTime) / 1000, 0.016); // Cap at 60fps
        this.lastFrameTime = now;
        
        // FPS calculation
        this.fps = 1 / dt;
        
        if (this.running) {
            this.update(dt);
        }
        
        this.draw();
        this.updateHUD();
        
        if (this.running || this.state === 'playing') {
            requestAnimationFrame(this.gameLoop);
        }
    }
}
