(() => {
    // Isolated Game State Variable Tracking
    const state = {
        currentScene: "menu",
        truth: 0,
        corruption: 0,
        inventory: { kit: false, tool: false, decoder: false },
        badges: { listener: false, repairer: false }
    };

    // Coordinate mapping for cropping the asset grid structure
    const scenes = {
        menu: { bgPos: "0% 4%", size: "300% auto" },
        controlRoom: { bgPos: "50% 4%", size: "300% auto" },
        filtration: { bgPos: "100% 4%", size: "300% auto" },
        lab: { bgPos: "0% 53%", size: "300% auto" },
        reservoir: { bgPos: "50% 53%", size: "300% auto" },
        victory: { bgPos: "100% 53%", size: "300% auto" }
    };

    const playerSprites = {
        idleFront: "-45px -740px",
        walkRight1: "-745px -740px",
        walkRight2: "-860px -740px",
        flashlightLeft: "-1105px -740px"
    };

    // Game Engine Dialogue Node Tree
    const storyTree = {
        intro: {
            text: "[SIGNAL DETECTED] Rural Monitoring Outpost Sector-7 has completely stopped automated cleansing cycles. Water toxicity reporting data is highly unstable. Investigate terminal logs?",
            choices: [
                { text: "Initialize Decryption Override", next: "controlCenter", change: { truth: 10, corruption: 0 } },
                { text: "Ignore telemetry anomalies & force bypass", next: "corruptedEntry", change: { truth: 0, corruption: 25 } }
            ]
        },
        controlCenter: {
            scene: "controlRoom",
            text: "You interface directly with Floor 1 Control Room. Screens are flickering wildly. The main mainframe reveals a catastrophic backflow event. You see an available utility toolset on the desk.",
            choices: [
                { text: "Acquire Repair Tool & Diagnostic Kit", next: "grabTools", change: { truth: 10 } },
                { text: "Descend straight to Floor 2 Filtration Wing", next: "filtrationWing", change: { corruption: 10 } }
            ]
        },
        grabTools: {
            scene: "controlRoom",
            action: () => { 
                state.inventory.kit = true; 
                state.inventory.tool = true;
                const kitEl = document.getElementById('item-kit');
                const toolEl = document.getElementById('item-tool');
                if (kitEl) kitEl.classList.add('active');
                if (toolEl) toolEl.classList.add('active');
            },
            text: "Tools secured. Handheld systems synched. Audio data corruption warning indicators light up across the room. A strange rhythm pulses through the sub-level pipes.",
            choices: [
                { text: "Proceed down to Floor 2 Filtration Wing", next: "filtrationWing" }
            ]
        },
        corruptedEntry: {
            scene: "controlRoom",
            text: "Th-ey... d...on't... wa-nt... us to fix it. The console display shifts layouts layout violently, flashing false indicators. You hear structural components groaning somewhere directly below.",
            choices: [
                { text: "S E L E C T   M E", next: "filtrationWing", change: { corruption: 20 } },
                { text: "Attempt Emergency Hard Reset", next: "controlCenter", change: { truth: 15 } }
            ]
        },
        filtrationWing: {
            scene: "filtration",
            playerPos: { left: "150px", sprite: "walkRight1" },
            text: "Floor 2: Filtration Wing. Massive tanks hold back millions of gallons of unpurified fluid assets. System pressure valves are pinned at dangerous limits. Signs warning 'CLEAN WATER FOR ALL' are rusted away.",
            choices: [
                { text: "Deploy Repair Tool to vent pressure safety systems", next: "ventPressure", require: "tool" },
                { text: "Bypass tanks to scan Floor 3 Processing Lab", next: "processingLab" }
            ]
        },
        ventPressure: {
            scene: "filtration",
            action: () => {
                state.badges.repairer = true;
                const badgeEl = document.getElementById('badge-repairer');
                if (badgeEl) badgeEl.classList.add('active');
            },
            text: "Pressure released safely. Automated sub-routines spin back into operation lines. Signal telemetry begins cleaning itself up. You earned the [System Repairer Badge]!",
            choices: [
                { text: "Advance deeper to Processing Lab", next: "processingLab", change: { truth: 20 } }
            ]
        },
        processingLab: {
            scene: "lab",
            playerPos: { left: "450px", sprite: "flashlightLeft" },
            text: "Floor 3: Processing Lab. Testing equipment lies completely shattered here. A wall inscription reads: 'RESTORE THE SYSTEM. RESTORE HOPE.' Deep fluid storage vats reflect shifting bioluminescent greens below.",
            choices: [
                { text: "Run Chemical analysis using Water Kit", next: "analyzeWater", require: "kit" },
                { text: "Drop down directly into the Basement Reservoir hatch", next: "reservoirScene", change: { corruption: 15 } }
            ]
        },
        analyzeWater: {
            scene: "lab",
            text: "Analysis Complete: Heavy toxic metals detected mixed with an anomalous active biological growth agent. This wasn't an accidental hardware failure. This was deliberate structural sabotage.",
            choices: [
                { text: "Log Data & Enter Basement Core Control", next: "reservoirScene", change: { truth: 35 } }
            ]
        },
        reservoirScene: {
            scene: "reservoir",
            playerPos: { left: "200px", sprite: "idleFront" },
            text: "BASEMENT: Contaminated Reservoir. The heart of the regional system. Millions of gallons of raw, blackened backflow runoff stream from the primary processing intake conduits. The main purification matrix console is accessible.",
            choices: [
                { text: "Initiate Complete System Purification Protocol Flush", next: "victoryEnd", require: "tool" },
                { text: "Overload grid infrastructure entirely (Emergency Scuttle)", next: "badEnd" }
            ]
        },
        victoryEnd: {
            scene: "victory",
            action: () => {
                state.badges.listener = true;
                const badgeEl = document.getElementById('badge-listener');
                if (badgeEl) badgeEl.classList.add('active');
            },
            text: "SUCCESS! SYSTEM RESTORED. Clean water vectors successfully re-routed and online.<br><br><hr><strong>CHARITY // WATER REALITY DATA CHECK:</strong><br>Over 703 million people globally live completely without access to safe, clean drinking water. Infrastructure management and community-led repair tracking are critical parameters to ending this crisis permanently. Your data resolution actions helped bring safety back online.",
            choices: []
        },
        badEnd: {
            scene: "menu",
            text: "CRITICAL FAILURE: The mainframe infrastructure suffers an irrecoverable crash. System is dead. The localized contamination plume moves downstream unmonitored. Terminating protocol session...",
            choices: [{ text: "REBOOT TERMINAL", next: "intro", action: () => resetGame() }]
        }
    };

    function updateHUD() {
        const truthEl = document.getElementById('truth-val');
        const corruptEl = document.getElementById('corrupt-val');
        if (truthEl) truthEl.innerText = state.truth;
        if (corruptEl) corruptEl.innerText = state.corruption;
        
        const container = document.getElementById('game-container');
        if (container) {
            if (state.corruption >= 40) {
                container.classList.add('corrupted');
            } else {
                container.classList.remove('corrupted');
            }
        }
    }

    function changeScene(sceneKey) {
        state.currentScene = sceneKey;
        const sData = scenes[sceneKey];
        const bg = document.getElementById('scene-bg');
        if (bg && sData) {
            bg.style.backgroundSize = sData.size;
            bg.style.backgroundPosition = sData.bgPos;
        }

        const player = document.getElementById('player');
        if (player) {
            if (sceneKey === 'menu' || sceneKey === 'victory') {
                player.style.display = 'none';
            } else {
                player.style.display = 'block';
            }
        }
    }

    function movePlayer(posData) {
        if (!posData) return;
        const player = document.getElementById('player');
        if (player && playerSprites[posData.sprite]) {
            player.style.left = posData.left;
            player.style.backgroundPosition = playerSprites[posData.sprite];
        }
    }

    function renderNode(nodeKey) {
        const node = storyTree[nodeKey];
        if (!node) return;

        if (node.scene) changeScene(node.scene);
        if (node.playerPos) movePlayer(node.playerPos);
        if (node.action) node.action();

        const logBox = document.getElementById('text-log');
        if (logBox) logBox.innerHTML = node.text;

        const choicesBox = document.getElementById('choices-box');
        if (!choicesBox) return;
        
        choicesBox.innerHTML = '';

        node.choices.forEach(choice => {
            if (choice.require && !state.inventory[choice.require]) {
                return; 
            }

            const btn = document.createElement('button');
            btn.innerHTML = choice.text;
            
            if (state.corruption > 30 && Math.random() > 0.5) {
                btn.classList.add('corrupted');
            }

            btn.onclick = () => {
                if (choice.change) {
                    if (choice.change.truth) state.truth += choice.change.truth;
                    if (choice.change.corruption) state.corruption += choice.change.corruption;
                }
                updateHUD();
                renderNode(choice.next);
            };
            choicesBox.appendChild(btn);
        });
    }

    function startGame() {
        renderNode('intro');
    }

    function resetGame() {
        state.truth = 0;
        state.corruption = 0;
        state.inventory = { kit: false, tool: false, decoder: false };
        state.badges = { listener: false, repairer: false };
        document.querySelectorAll('.inv-item').forEach(el => el.classList.remove('active'));
        updateHUD();
    }

    // Attach listener after DOM content loads safely
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', startGame);
        }
    });
})();