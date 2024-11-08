const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const jumpSound = document.getElementById("jumpSound");
const collectSound = document.getElementById("collectSound");
const backgroundMusic = document.getElementById("backgroundMusic");

// Start background music
backgroundMusic.play();

// Player setup
let player = {
  x: 50,
  y: canvas.height - 60,
  width: 40,
  height: 40,
  speedY: 0,
  isJumping: false,
  score: 0,
  lives: 3
};

// Obstacles
let obstacles = [];
let powerUps = [];

// Particle effect setup
let particles = [];

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background gradient
  let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#87CEEB");
  gradient.addColorStop(1, "#1E90FF");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw ground layer
  ctx.fillStyle = "green";
  ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

  // Update player position
  player.y += player.speedY;
  player.speedY += 1; // Gravity effect
  if (player.y > canvas.height - player.height - 20) {
    player.y = canvas.height - player.height - 20;
    player.isJumping = false;
  }
  
  // Draw player
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw obstacles
  ctx.fillStyle = "darkred";
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    obstacle.x -= 5; // Move obstacle to the left
  });

  // Draw power-ups
  ctx.fillStyle = "gold";
  powerUps.forEach(powerUp => {
    ctx.beginPath();
    ctx.arc(powerUp.x, powerUp.y, 10, 0, Math.PI * 2);
    ctx.fill();
    powerUp.x -= 3;
  });

  // Draw particles
  particles.forEach(particle => {
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    particle.y += particle.speedY;
    particle.lifetime--;
  });

  // Remove old particles
  particles = particles.filter(p => p.lifetime > 0);

  // Update score and lives in the UI
  document.getElementById("score").textContent = "Score: " + player.score;
  document.getElementById("lives").textContent = "Lives: " + player.lives;

  requestAnimationFrame(gameLoop);
}

// Jump function
function jump() {
  if (!player.isJumping) {
    player.speedY = -15;
    player.isJumping = true;
    jumpSound.play();
    
    // Add jump particles
    for (let i = 0; i < 5; i++) {
      particles.push({
        x: player.x + player.width / 2,
        y: player.y + player.height,
        size: Math.random() * 5,
        speedY: Math.random() * -2,
        color: "white",
        lifetime: 20
      });
    }
  }
}

// Generate obstacles and power-ups
function generateObstacles() {
  if (Math.random() < 0.02) {
    obstacles.push({
      x: canvas.width,
      y: canvas.height - 40,
      width: 20,
      height: 20
    });
  }
}

function generatePowerUps() {
  if (Math.random() < 0.01) {
    powerUps.push({
      x: canvas.width,
      y: Math.random() * (canvas.height - 40),
      collected: false
    });
  }
}

// Keydown event for jump
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});

// Start the game loop
setInterval(generateObstacles, 1000);
setInterval(generatePowerUps, 2000);
gameLoop();
