// ============ UTILITY FUNCTIONS ============

/**
 * Random number between min and max (inclusive)
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Random element from array
 */
function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Distance between two points
 */
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * Check if two rectangles overlap
 */
function rectsOverlap(rect1, rect2) {
    return !(rect1.x + rect1.w <= rect2.x ||
             rect2.x + rect2.w <= rect1.x ||
             rect1.y + rect1.h <= rect2.y ||
             rect2.y + rect2.h <= rect1.y);
}

/**
 * Clamp a value between min and max
 */
function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

/**
 * Simple seeded random for dungeon generation (for reproducible levels)
 */
class SeededRandom {
    constructor(seed) {
        this.seed = seed;
    }
    
    next() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }
    
    nextInt(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
}

/**
 * Local Storage wrapper
 */
const Storage = {
    save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
    load: (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },
    remove: (key) => localStorage.removeItem(key),
    clear: () => localStorage.clear()
};

/**
 * Event emitter for game events
 */
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    }
    
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(cb => cb(data));
        }
    }
    
    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }
}

/**
 * Animation helper
 */
class Animation {
    constructor(duration, easing = 'linear') {
        this.duration = duration;
        this.elapsed = 0;
        this.easing = easing;
        this.onComplete = null;
    }
    
    update(dt) {
        this.elapsed += dt;
        if (this.elapsed >= this.duration) {
            this.elapsed = this.duration;
            if (this.onComplete) this.onComplete();
            return 1;
        }
        return this.elapsed / this.duration;
    }
    
    isComplete() {
        return this.elapsed >= this.duration;
    }
}
