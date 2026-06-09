// ============ MAIN ENTRY POINT ============

const avatars = ['🧑', '👨‍🔬', '👩‍🔬', '🧔', '👨‍💼', '👩‍💼'];

function initializeGame() {
    // Create avatar options
    const avatarGrid = document.getElementById('avatarOptions');
    for (const avatar of avatars) {
        const option = document.createElement('div');
        option.className = 'avatar-option';
        option.textContent = avatar;
        option.addEventListener('click', () => {
            document.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
            option.classList.add('selected');
        });
        avatarGrid.appendChild(option);
    }
    
    // Select first by default
    document.querySelector('.avatar-option').classList.add('selected');
    
    // Initialize game
    window.game = new Game();
    
    console.log('🌊 Aquifer Explorer initialized!');
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', initializeGame);
