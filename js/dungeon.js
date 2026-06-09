// ============ DUNGEON GENERATOR ============

class Dungeon {
    constructor(level = 1) {
        this.level = level;
        this.width = 800;
        this.height = 500;
        this.tileSize = 40;
        this.grid = [];
        this.entities = [];
        this.exitPosition = null;
        this.entrancePosition = { x: 40, y: 40 };
        
        // Procedural generation based on level seed
        const seed = level * 12345;
        this.rng = new SeededRandom(seed);
        
        this.generate();
    }
    
    generate() {
        // Initialize empty grid
        const cols = Math.ceil(this.width / this.tileSize);
        const rows = Math.ceil(this.height / this.tileSize);
        
        this.grid = Array(rows).fill(0).map(() => Array(cols).fill(0));
        this.entities = [];
        
        // Place exit
        this.exitPosition = {
            x: this.rng.nextInt(10, 19) * this.tileSize,
            y: this.rng.nextInt(8, 11) * this.tileSize
        };
        
        // Random obstacles (broken pipes)
        const pipeCount = 3 + this.level;
        for (let i = 0; i < pipeCount; i++) {
            const x = this.rng.nextInt(2, 19) * this.tileSize;
            const y = this.rng.nextInt(2, 11) * this.tileSize;
            const direction = this.rng.next() > 0.5 ? 'horizontal' : 'vertical';
            this.entities.push(new BrokenPipe(x, y, direction));
        }
        
        // Random enemies (water thieves)
        const thiefCount = 2 + Math.floor(this.level / 2);
        for (let i = 0; i < thiefCount; i++) {
            let x, y;
            let collision = true;
            // Try to place without overlapping
            for (let attempts = 0; attempts < 10 && collision; attempts++) {
                x = this.rng.nextInt(2, 19) * this.tileSize;
                y = this.rng.nextInt(2, 11) * this.tileSize;
                collision = this.entities.some(e => 
                    distance(x, y, e.x, e.y) < 100
                );
            }
            if (!collision) {
                this.entities.push(new WaterThief(x, y));
            }
        }
        
        // Random enemies (corruption bugs)
        const bugCount = 1 + Math.floor(this.level / 3);
        for (let i = 0; i < bugCount; i++) {
            let x, y;
            let collision = true;
            for (let attempts = 0; attempts < 10 && collision; attempts++) {
                x = this.rng.nextInt(2, 19) * this.tileSize;
                y = this.rng.nextInt(2, 11) * this.tileSize;
                collision = this.entities.some(e => 
                    distance(x, y, e.x, e.y) < 100
                );
            }
            if (!collision) {
                this.entities.push(new CorruptionBug(x, y));
            }
        }
        
        // Random collectibles (water crystals)
        const crystalCount = 5 + this.level * 2;
        for (let i = 0; i < crystalCount; i++) {
            const x = this.rng.nextInt(2, 19) * this.tileSize + 20;
            const y = this.rng.nextInt(2, 11) * this.tileSize + 20;
            const value = this.rng.next() > 0.7 ? 50 : 10;
            this.entities.push(new WaterCrystal(x, y, value));
        }
        
        // Random power-ups
        const powerUpChance = 0.3;
        const powerUpTypes = ['shield', 'speed', 'damage'];
        for (let i = 0; i < 2; i++) {
            if (this.rng.next() < powerUpChance) {
                const x = this.rng.nextInt(2, 19) * this.tileSize + 20;
                const y = this.rng.nextInt(2, 11) * this.tileSize + 20;
                const type = randomElement(powerUpTypes);
                this.entities.push(new PowerUp(x, y, type));
            }
        }
    }
    
    update(dt, player) {
        for (const entity of this.entities) {
            if (entity.active) {
                entity.update(dt, this);
            }
        }
        
        // Remove collected items
        this.entities = this.entities.filter(e => !(e.collected && e.active === false));
    }
    
    draw(ctx) {
        // Background
        ctx.fillStyle = '#0f1419';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Grid (debug/visual)
        ctx.strokeStyle = 'rgba(0, 100, 150, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= Math.ceil(this.width / this.tileSize); i++) {
            ctx.beginPath();
            ctx.moveTo(i * this.tileSize, 0);
            ctx.lineTo(i * this.tileSize, this.height);
            ctx.stroke();
        }
        for (let i = 0; i <= Math.ceil(this.height / this.tileSize); i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * this.tileSize);
            ctx.lineTo(this.width, i * this.tileSize);
            ctx.stroke();
        }
        
        // Entrance
        ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.fillRect(this.entrancePosition.x - 5, this.entrancePosition.y - 5, 20, 20);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.entrancePosition.x - 5, this.entrancePosition.y - 5, 20, 20);
        
        // Exit (goal)
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
        ctx.fillRect(this.exitPosition.x - 20, this.exitPosition.y - 20, 40, 40);
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.exitPosition.x - 20, this.exitPosition.y - 20, 40, 40);
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#ffff00';
        ctx.textAlign = 'center';
        ctx.fillText('EXIT', this.exitPosition.x, this.exitPosition.y + 5);
        
        // Draw all entities
        for (const entity of this.entities) {
            entity.draw(ctx);
        }
    }
    
    getEnemies() {
        return this.entities.filter(e => e instanceof WaterThief || e instanceof CorruptionBug);
    }
    
    getObstacles() {
        return this.entities.filter(e => e instanceof BrokenPipe);
    }
    
    getCollectibles() {
        return this.entities.filter(e => e instanceof WaterCrystal || e instanceof PowerUp);
    }
}
