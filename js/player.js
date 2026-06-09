// ============ PLAYER CLASS ============

class Player extends Entity {
    constructor(x = 50, y = 50, avatar = '🧑') {
        super(x, y, 25, 25);
        this.avatar = avatar;
        this.speed = 200; // pixels/sec
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.credits = 0;
        this.waterFlow = 0;
        this.maxWaterFlow = 100;
        this.level = 1;
        
        // Movement
        this.inputX = 0;
        this.inputY = 0;
        this.canMove = true;
        
        // Invulnerability
        this.isInvulnerable = false;
        this.invulnerabilityTime = 0;
        this.invulnerabilityDuration = 1; // seconds
        
        // Active power-ups
        this.activePowerUps = {
            'shield': false,
            'speed': false,
            'damage': false
        };
        this.powerUpTimers = {};
        
        // Badges earned
        this.badges = new Set();
        
        // Stats tracking
        this.damageDealt = 0;
        this.enemiesDefeated = 0;
        this.startTime = Date.now();
    }
    
    handleInput(keysPressed) {
        this.inputX = 0;
        this.inputY = 0;
        
        if (keysPressed['ArrowUp'] || keysPressed['w'] || keysPressed['W']) this.inputY = -1;
        if (keysPressed['ArrowDown'] || keysPressed['s'] || keysPressed['S']) this.inputY = 1;
        if (keysPressed['ArrowLeft'] || keysPressed['a'] || keysPressed['A']) this.inputX = -1;
        if (keysPressed['ArrowRight'] || keysPressed['d'] || keysPressed['D']) this.inputX = 1;
    }
    
    update(dt, dungeon) {
        if (!this.canMove) return;
        
        // Movement
        if (this.inputX !== 0 || this.inputY !== 0) {
            // Normalize diagonal movement
            const magnitude = Math.sqrt(this.inputX ** 2 + this.inputY ** 2);
            const dirX = this.inputX / magnitude;
            const dirY = this.inputY / magnitude;
            
            let speed = this.speed;
            if (this.activePowerUps['speed']) {
                speed *= 1.5;
            }
            
            const moveX = dirX * speed * dt;
            const moveY = dirY * speed * dt;
            
            const newX = this.x + moveX;
            const newY = this.y + moveY;
            
            // Boundary check
            if (newX > 0 && newX + this.w < dungeon.width) {
                this.x = newX;
            }
            if (newY > 0 && newY + this.h < dungeon.height) {
                this.y = newY;
            }
        }
        
        // Update invulnerability
        if (this.isInvulnerable) {
            this.invulnerabilityTime -= dt;
            if (this.invulnerabilityTime <= 0) {
                this.isInvulnerable = false;
            }
        }
        
        // Update power-ups
        for (const [type, active] of Object.entries(this.activePowerUps)) {
            if (active && this.powerUpTimers[type]) {
                this.powerUpTimers[type] -= dt;
                if (this.powerUpTimers[type] <= 0) {
                    this.activePowerUps[type] = false;
                    delete this.powerUpTimers[type];
                }
            }
        }
    }
    
    takeDamage(amount) {
        if (this.isInvulnerable) return false;
        
        if (this.activePowerUps['shield']) {
            // Shield absorbs one hit
            this.activePowerUps['shield'] = false;
            return true;
        }
        
        this.health -= amount;
        this.isInvulnerable = true;
        this.invulnerabilityTime = this.invulnerabilityDuration;
        
        return this.health > 0;
    }
    
    addCredits(amount) {
        this.credits += amount;
    }
    
    addWaterFlow(amount) {
        this.waterFlow = clamp(this.waterFlow + amount, 0, this.maxWaterFlow);
    }
    
    activatePowerUp(type, duration) {
        this.activePowerUps[type] = true;
        this.powerUpTimers[type] = duration;
    }
    
    earnBadge(badgeId) {
        this.badges.add(badgeId);
    }
    
    draw(ctx) {
        // Flashing when invulnerable
        if (this.isInvulnerable && Math.sin(Date.now() / 100) > 0) {
            return;
        }
        
        // Player body
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x, this.y, this.w, this.h);
        
        // Avatar display
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.avatar, this.x + this.w / 2, this.y + this.h / 2);
        
        // Health indicator (outline)
        const healthPercent = this.health / this.maxHealth;
        const healthColor = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.2 ? '#ffff00' : '#ff0000';
        ctx.strokeStyle = healthColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        
        // Power-up indicators
        let offsetX = 0;
        for (const [type, active] of Object.entries(this.activePowerUps)) {
            if (active) {
                ctx.fillStyle = '#ffaa00';
                ctx.fillRect(this.x - 5 + offsetX, this.y - 10, 8, 5);
                offsetX += 10;
            }
        }
    }
    
    getElapsedTime() {
        return (Date.now() - this.startTime) / 1000;
    }
}
