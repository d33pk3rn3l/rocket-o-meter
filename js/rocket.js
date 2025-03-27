let launchCount = 0;
let timer;
let countdownInterval;
let timeLeft = 10;
const duration = 10; // duration in seconds
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
let gameActive = true; // Track if the game is accepting input

// Add keyboard support for space bar
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && timeLeft > 0 && gameActive) {
        event.preventDefault(); // Prevent scrolling with space bar
        if (!timer) {
            startTimer();
            startCountdown();
        }
        launchCount++;
        animateRocket();
        updateLaunchCount();
    }
});

function startTimer() {
    timer = setTimeout(() => {
        endGame();
    }, duration * 1000);
}

function startCountdown() {
    countdownInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time left: ${timeLeft} seconds`;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
        }
    }, 1000);
}

function updateLaunchCount() {
    scoreElement.textContent = `Are you enough rocket? ${Math.round(calculateScore())} (${launchCount} launches)`;
}

function calculateScore() {
    // Linear mapping from 0-130 launches to 1-10 score
    return 1 + (launchCount / 130) * 9;
}

function animateRocket() {
    const rocket = document.getElementById('rocket');
    const container = document.querySelector('.container');
    
    // Apply shake to the container
    container.classList.add('shake');
    
    // Remove shake after animation completes
    setTimeout(() => {
        container.classList.remove('shake');
    }, 300);
    
    rocket.style.transition = 'transform 0.2s ease-out';
    rocket.style.transform = 'translateY(-80px)';
    
    // Create particles at the initial rocket position
    createParticles();
    
    setTimeout(() => {
        rocket.style.transition = 'transform 0.3s ease-in';
        rocket.style.transform = 'translateY(0)';
    }, 200);
}

function createParticles() {
    const rocketContainer = document.querySelector('.rocket-container');
    
    // Create 3-5 particles
    const particleCount = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Randomly choose between fire and smoke emojis
        particle.textContent = Math.random() > 0.4 ? '🔥' : '💨';
        
        // Position particles centered at the bottom of rocket
        particle.style.position = 'absolute';
        particle.style.left = `calc(50% + ${Math.random() * 20 - 10}px)`; // Center ± random offset
        particle.style.top = 'calc(100% - 10px)'; // Bottom of container with small offset
        particle.style.transform = 'translateX(-50%)'; // Center the particle itself
        
        // Random particle size between 1em and 5em
        const randomSize = 1 + Math.random() * 4;
        particle.style.fontSize = `${randomSize}em`;
        
        // Add to the rocket container
        rocketContainer.appendChild(particle);
        
        // Animate the particle
        setTimeout(() => {
            // Only move downwards, no horizontal drift
            particle.style.transition = 'all 1s ease-out';
            particle.style.top = `calc(100% + ${30 + Math.random() * 20}px)`;
            particle.style.opacity = '0';
            
            // Remove the particle after animation completes
            setTimeout(() => {
                rocketContainer.removeChild(particle);
            }, 1000);
        }, 10);
    }
}

function endGame() {
    clearTimeout(timer);
    clearInterval(countdownInterval);
    timer = null;
    gameActive = false; // Disable game input
    
    // Get the final score
    const finalScore = Math.round(calculateScore());
    
    // Determine rocket category
    let category;
    if (finalScore <= 2) {
        category = "Human Equivalent of a Wet Firework 💧";
    } else if (finalScore <= 4) {
        category = "Successfully Glued Wings Onto a Potato 🥔";
    } else if (finalScore <= 6) {
        category = "Mistakes Loud Noises for Progress 💥";
    } else if (finalScore <= 8) {
        category = "Powered by Optimism and Baking Soda Volcanoes 🌋";
    } else {
        category = "Thomas The Rocket ✨";
    }
    
    // Update display
    timerElement.textContent = "Game Over!";
    scoreElement.innerHTML = `
        <strong>Final Score: ${finalScore}/15</strong><br>
        You launched the rocket ${launchCount} times.<br>
        Category: <span class="category">${category}</span>
    `;
    
    // Add a restart button
    const restartButton = document.createElement('button');
    restartButton.textContent = "Play Again";
    restartButton.classList.add('restart-button');
    restartButton.addEventListener('click', resetGame);
    
    // Check if button already exists
    const existingButton = document.querySelector('.restart-button');
    if (!existingButton) {
        document.querySelector('.container').appendChild(restartButton);
    }
}

function resetGame() {
    launchCount = 0;
    timeLeft = 10;
    scoreElement.textContent = 'Are you enough rocket? 0';
    timerElement.textContent = 'Time left: 10 seconds';
    gameActive = true; // Re-enable game input
    
    // Remove restart button
    const restartButton = document.querySelector('.restart-button');
    if (restartButton) {
        restartButton.remove();
    }
}