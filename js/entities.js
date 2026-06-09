// ============ ENTITY BASE CLASS ============

class Entity {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = 0;
        this.vy = 0;
        this.active = true;
    }
    
    update(dt, dungeon) {
        // Override in subclasses
    }
    
    draw(ctx) {
        // Override in subclasses
    }
    
    getRect() {
        return { x: this.x, y: this.y, w: this.w, h: this.h };
    }
}

// ============ ENEMY: WATER THIEF ============
class WaterThief extends Entity {
    constructor(x, y) {
        super(x, y, 30, 30);
        this.speed = randomInt(50, 100); // pixels/sec
        this.direction = randomInt(0, 3); // 0=up, 1=right, 2=down, 3=left
        this.changeTimer = randomInt(2, 5); // seconds until direction change
        this.elapsed = 0;
        this.health = 1;
        this.color = '#ff4444';
    }
    
    update(dt, dungeon) {
        this.elapsed += dt;
        
        // Random direction changes
        if (this.elapsed >= this.changeTimer) {
            this.direction = randomInt(0, 3);
            this.changeTimer = randomInt(2, 5);
            this.elapsed = 0;
        }
        
        // Move
        const moveDistance = this.speed * dt;
        const dirs = [
            { dx: 0, dy: -moveDistance }, // up
            { dx: moveDistance, dy: 0 },   // right
            { dx: 0, dy: moveDistance },   // down
            { dx: -moveDistance, dy: 0 }   // left
        ];
        
        const dir = dirs[this.direction];
        const newX = this.x + dir.dx;
        const newY = this.y + dir.dy;
        
        // Bounce off walls
        if (newX < 0 || newX + this.w > 800) {
            this.direction = (this.direction === 1) ? 3 : 1;
        } else {
            this.x = newX;
        }
        
        if (newY < 0 || newY + this.h > 500) {
            this.direction = (this.direction === 2) ? 0 : 2;
        } else {
            this.y = newY;
        }
    }
    
    draw(ctx) {
        // Enemy sprite
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        
        // Eyes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 8, this.y + 8, 6, 6);
        ctx.fillRect(this.x + 16, this.y + 8, 6, 6);
        
        // Angry mouth
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y + 20);
        ctx.lineTo(this.x + 20, this.y + 20);
        ctx.stroke();
    }
}

// ============ ENEMY: CORRUPTION BUG ============
class CorruptionBug extends Entity {
    constructor(x, y) {
        super(x, y, 20, 20);
        this.speed = randomInt(80, 150);
        this.angle = Math.random() * Math.PI * 2;
        this.turnSpeed = randomInt(2, 5); // radians per second
        this.health = 1;
        this.color = '#8844ff';
    }
    
    update(dt, dungeon) {
        // Gentle circular motion
        this.angle += (this.turnSpeed * dt);
        
        const moveDistance = this.speed * dt;
        const newX = this.x + Math.cos(this.angle) * moveDistance;
        const newY = this.y + Math.sin(this.angle) * moveDistance;
        
        // Bounce
        if (newX < 0 || newX + this.w > 800) {
            this.angle = Math.PI - this.angle;
        } else {
            this.x = newX;
        }
        
        if (newY < 0 || newY + this.h > 500) {
            this.angle = -this.angle;
        } else {
            this.y = newY;
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(this.x + 3, this.y + 5, 4, 4);
        ctx.fillRect(this.x + 13, this.y + 5, 4, 4);
    }
}

// ============ OBSTACLE: BROKEN PIPE ============
class BrokenPipe extends Entity {
    constructor(x, y, direction = 'horizontal') {
        const size = 40;
        super(x, y, size, size);
        this.direction = direction; // 'horizontal' or 'vertical'
        this.repaired = false;
        this.color = repaired ? '#44ff44' : '#ff4444';
    }
    
    draw(ctx) {
        ctx.fillStyle = this.repaired ? '#44ff44' : '#cc4444';
        ctx.fillRect(this.x, this.y, this.w, this.h);
        
        // Draw pipe direction
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        if (this.direction === 'horizontal') {
            ctx.moveTo(this.x + 5, this.y + this.h / 2);
            ctx.lineTo(this.x + this.w - 5, this.y + this.h / 2);
        } else {
            ctx.moveTo(this.x + this.w / 2, this.y + 5);
            ctx.lineTo(this.x + this.w / 2, this.y + this.h - 5);
        }
        ctx.stroke();
        
        // Damage indicator
        if (!this.repaired) {
            ctx.fillStyle = '#ff0000';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('✕', this.x + this.w / 2, this.y + this.h / 2 + 7);
        }
    }
}

// ============ COLLECTIBLE: WATER CRYSTAL ============
class WaterCrystal extends Entity {
    constructor(x, y, value = 10) {
        super(x, y, 15, 15);
        this.value = value;
        this.bobbing = 0;
        this.bobSpeed = 3; // Hz
        this.collected = false;
    }
    
    update(dt, dungeon) {
        this.bobbing += dt * this.bobSpeed * Math.PI * 2;
        this.y += Math.sin(this.bobbing) * 2;
    }
    
    draw(ctx) {
        ctx.fillStyle = '#00ddff';
        ctx.beginPath();
        ctx.arc(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow
        ctx.strokeStyle = 'rgba(0, 221, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x + this.w / 2, this.y + this.h / 2, this.w / 2 + 5, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// ============ COLLECTIBLE: POWER-UP ============
class PowerUp extends Entity {
    constructor(x, y, type = 'shield') {
        super(x, y, 20, 20);
        this.type = type; // 'shield', 'speed', 'damage'
        this.duration = 5; // seconds
        this.spinning = 0;
    }
    
    update(dt, dungeon) {
        this.spinning += dt * 180; // 180 degrees per second
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
        ctx.rotate((this.spinning * Math.PI) / 180);
        
        const colors = {
            'shield': '#ffaa00',
            'speed': '#00ff00',
            'damage': '#ff0000'
        };
        const symbols = {
            'shield': '⚔',
            'speed': '→',
            'damage': '⚡'
        };
        
        ctx.fillStyle = colors[this.type];
        ctx.fillRect(-10, -10, 20, 20);
        
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbols[this.type], 0, 0);
        
        ctx.restore();
    }
}
