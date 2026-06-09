# ⚡ Aquifer Explorer: Charity Water Quest

A roguelike dungeon crawler game designed to engage college students in charity: water's mission of providing clean water to all.

**Play as a water engineer descending into the underground to repair ancient water systems and save civilization—one level at a time.**

---

## 🎮 Game Overview

### Core Concept
- **Procedurally-generated** dungeon levels that get harder each time
- **Roguelike mechanics**: Multiple attempts, progression-based
- **Accessibility**: Simple HTML/CSS/JS frontend + Python backend
- **Engagement**: Badges, avatars, leaderboards, surprising moments

### Key Features
- 🧑 **Avatar Customization**: Choose from multiple engineer archetypes
- 🏅 **Badge System**: Earn badges for achievements (speed runs, perfect flow, no damage)
- 💧 **Water Flow Mechanic**: Collect water crystals to unlock power-ups
- 👾 **Dynamic Enemies**: Water Thieves and Corruption Bugs with different behaviors
- 🔧 **Puzzles**: Repair broken pipes by reaching them
- 🎁 **Power-ups**: Shield, Speed Boost, Damage Multiplier
- 📊 **Leaderboards**: Track high scores and levels reached

---

## 📁 Project Structure

```
Charity/
├── index.html              # Main game UI
├── README.md               # This file
├── css/
│   └── styles.css          # Game styling (UI + canvas)
├── js/
│   ├── main.js            # Entry point + initialization
│   ├── utils.js           # Utility functions + helpers
│   ├── entities.js        # Enemy and collectible classes
│   ├── dungeon.js         # Dungeon generation
│   ├── player.js          # Player controller
│   └── game.js            # Main game engine
└── backend/
    ├── app.py             # Flask API server
    └── requirements.txt   # Python dependencies
```

---

## 🛠️ Development Roadmap

### Phase 1: Core Gameplay (This Sprint - ~16 hours)
- [x] Project scaffolding & structure
- [x] Basic game engine & game loop
- [x] Player movement & input handling
- [x] Procedural dungeon generation
- [x] Enemy AI (Water Thieves, Corruption Bugs)
- [x] Collectible items (Water Crystals, Power-ups)
- [x] Collision detection & interaction
- [x] Level progression & game over states
- [ ] **NEXT: Run and test the game**

### Phase 2: Polish & Features (4-6 hours)
- [ ] Audio design (ambient, effects, voice)
- [ ] Visual effects (particle systems, animations)
- [ ] Badge system implementation
- [ ] Leaderboard UI
- [ ] Difficulty tuning & balance

### Phase 3: Backend Integration (4-6 hours)
- [ ] Connect game to Flask API
- [ ] Player data persistence
- [ ] Leaderboard submission
- [ ] Badge tracking
- [ ] Analytics

### Phase 4: Art & Story (2-4 hours)
- [ ] Pixel art or vector graphics
- [ ] Environmental design (theming)
- [ ] NPC dialogue/narrative
- [ ] Loading screens

### Phase 5: Deployment & Marketing (2-4 hours)
- [ ] Deploy frontend (GitHub Pages / Vercel)
- [ ] Deploy backend (Heroku / Railway)
- [ ] Mobile optimization
- [ ] Social features (share scores)

---

## 🚀 Quick Start

### Frontend Only (No Backend)

1. **Open the game:**
   ```bash
   # Simply open index.html in a browser
   cd /workspaces/Charity
   python3 -m http.server 8000
   # Then visit http://localhost:8000
   ```

2. **Controls:**
   - Arrow Keys or WASD: Move
   - Click: Select avatar

3. **Objectives:**
   - Navigate to the yellow EXIT box
   - Collect blue Water Crystals for credits
   - Avoid red and purple enemies
   - Power-ups spawn randomly

### With Backend (Optional)

1. **Install Python dependencies:**
   ```bash
   cd /workspaces/Charity/backend
   pip install -r requirements.txt
   ```

2. **Run the Flask server:**
   ```bash
   python app.py
   # Server runs on http://localhost:5000
   ```

3. **Frontend connects to backend:**
   - Player data is saved to `game_data.json`
   - Leaderboards are tracked
   - Badges are stored

---

## 🎮 Game Mechanics

### Player
- **Speed**: 200 px/sec (faster with Speed power-up)
- **Health**: 100 HP
- **Water Flow**: 0-100 (collected from crystals)
- **Invulnerability**: 1 second after taking damage

### Enemies

**Water Thief** 🔴
- Wanders randomly, bounces off walls
- Speed: 50-100 px/sec
- Damage: 10 HP
- Behavior: Predictable patrol

**Corruption Bug** 🟣
- Moves in smooth circular patterns
- Speed: 80-150 px/sec
- Damage: 10 HP
- Behavior: Elegant but evasive

### Collectibles

**Water Crystal** 💧
- Value: 10-50 credits
- Bobs gently up and down
- Randomly scattered throughout level

**Power-ups** ⭐
- **Shield**: Absorbs one hit
- **Speed**: 50% faster movement for 5 seconds
- **Damage**: Increases attack power (future combat system)

### Level Progression

- Level 1: 2 Thieves, 1 Bug, 3 Pipes, Easy
- Level 2: 3 Thieves, 1 Bug, 4 Pipes, Medium
- Level 3+: Scaling difficulty

---

## 🏅 Badge System

Badges reward specific achievements:

| Badge | Requirement | Icon |
|-------|-------------|------|
| Speed Runner | Complete level < 1 min | ⚡ |
| Perfect Flow | Reach max water flow | 💧 |
| Unscathed | Complete level without damage | 🛡️ |
| Crystal Collector | Collect 50+ crystals total | 💎 |
| Deep Diver | Reach level 10 | 🌊 |
| Survivor | Reach level 5 | 🏆 |

---

## 🔌 API Endpoints (Backend)

```
GET  /api/health              # Health check
GET  /api/player/<id>         # Get player data
POST /api/player/<id>         # Save player data
GET  /api/leaderboard         # Top 10 by credits
GET  /api/leaderboard/level   # Top 10 by level
GET  /api/badges              # All available badges
GET  /api/stats               # Overall game stats
```

---

## 🎨 Design Notes

### Art Style
- Pixel art / retro aesthetic (easy to build with Canvas)
- Neon colors (cyan, green, red) for accessibility
- Simple geometric shapes for quick iteration

### Sound Design
- Ambient: Water drips, echoing depths
- Effects: Beeps for pickups, danger sounds for enemies
- Music: Tense synth for fights, calm for exploration

### UX
- Clear HUD showing health, water flow, credits, level
- Modals for menu, game over, level complete
- Mobile-friendly (arrow key fallback)

---

## 🐛 Known Issues & TODOs

- [ ] Audio not yet implemented
- [ ] Particle effects needed for visual polish
- [ ] Mobile touch controls
- [ ] Difficulty curve tuning
- [ ] Pipe repair mechanic (currently just obstacle avoidance)
- [ ] Narrative/story elements
- [ ] Settings menu (volume, difficulty)

---

## 📱 Charity: Water Integration

**Mission Tie-ins:**
- Each level's "water credits" collected maps to real clean water impact
- Potential: "You just provided 1 day of clean water for 1 person!"
- Leaderboards show "total impact" across all players
- Share button: "I just helped provide clean water!"
- Embed donation link in game over screen

**Example integration:**
```
1 Water Credit = $0.10 towards charity: water
Player earned 500 credits = $50 donated
```

---

## 🤝 Contributing

### How to Add Features

1. **New Enemy Type**: Add class in `entities.js`, add to `dungeon.js` generation
2. **New Power-up**: Add `PowerUp` subclass or variant
3. **New Badge**: Add to `player.badges` tracking, update badge UI
4. **New Visual Effect**: Add Canvas drawing in `draw()` methods

### Testing
- Test each level generation 3+ times (should be different each time)
- Check collision detection with all entity types
- Verify power-up timers and effects
- Run performance test on low-end devices

---

## 📊 Future Ideas

- **Multiplayer**: Real-time leaderboards with live race mode
- **Daily Challenges**: Special modifiers (low gravity, darkness, etc.)
- **Story Mode**: Progressive narrative across levels
- **Customization**: Skins, emotes, progression tree
- **Accessibility**: Colorblind modes, adjustable difficulty
- **VR Version**: 3D immersive water temple experience

---

## 📝 License

This game is created as an educational project to support [charity: water](https://www.charitywater.org). 

Built with love for college students who want to make a difference.

---

**Questions?** Check the code comments for detailed implementation notes.

**Let's save the world, one level at a time.** 💧