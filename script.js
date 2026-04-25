const robot = document.getElementById('robot');
const gameBoard = document.getElementById('gameBoard');
const startBtn = document.getElementById('startBtn');
const startOverlay = document.getElementById('startOverlay');
const scoreVal = document.getElementById('scoreVal');

const jumpSound = new Audio('assets/jump.mp3.wav');
const bgMusic = new Audio('assets/music.mp3.wav');
bgMusic.loop = true;

const obstacleImages = [
    'Bush 16x161.png',
    'Tree 0141.png',
    'Tree 0151.png'
];

let score = 0;
let isJumping = false;
let gameActive = false;
let obstacleTimeout;
let collisionInterval;

function jump() {
    if (isJumping || !gameActive) return;
    
    isJumping = true;
    robot.classList.add('jump-animation');
    robot.classList.add('robot-jump');
    
    jumpSound.currentTime = 0;
    jumpSound.play().catch(() => {});

    setTimeout(() => {
        robot.classList.remove('jump-animation');
        robot.classList.remove('robot-jump');
        isJumping = false;
    }, 600); 
}

function spawnObstacle() {
    if (!gameActive) return;

    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    
    const randomImage = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
    obstacle.style.backgroundImage = `url("assets/${encodeURIComponent(randomImage)}")`;
    
    gameBoard.appendChild(obstacle);

    const nextSpawn = Math.floor(Math.random() * 1300) + 1200;

    obstacle.addEventListener('animationend', () => {
        if (gameActive) {
            score++;
            scoreVal.textContent = score;
        }
        obstacle.remove();
    });

    obstacleTimeout = setTimeout(spawnObstacle, nextSpawn);
}

function checkCollision() {
    if (!gameActive) return;

    const robotRect = robot.getBoundingClientRect();
    const obstacles = document.querySelectorAll('.obstacle');

    obstacles.forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            robotRect.right - 10 > obstacleRect.left &&
            robotRect.left + 10 < obstacleRect.right &&
            robotRect.bottom > obstacleRect.top + 10 &&
            robotRect.top < obstacleRect.bottom
        ) {
            gameOver();
        }
    });
}

function gameOver() {
    gameActive = false;
    bgMusic.pause();
    clearTimeout(obstacleTimeout);
    clearInterval(collisionInterval);

    robot.classList.remove('jump-animation');
    robot.classList.remove('robot-jump');
    robot.classList.add('robot-dead');
    
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => {
        obstacle.style.animationPlayState = 'paused';
    });

    startOverlay.style.display = 'flex';
    startOverlay.querySelector('h2').textContent = 'Game Over';
    startBtn.textContent = 'Restart';
}

function startGame() {
    const existingObstacles = document.querySelectorAll('.obstacle');
    existingObstacles.forEach(obs => obs.remove());

    robot.classList.remove('robot-dead');

    gameActive = true;
    score = 0;
    scoreVal.textContent = score;
    startOverlay.style.display = 'none';
    
    bgMusic.currentTime = 0;
    bgMusic.volume = 0.4;
    bgMusic.play().catch(() => {});
    
    spawnObstacle();
    collisionInterval = setInterval(checkCollision, 10);
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        jump();
    }
});

gameBoard.addEventListener('mousedown', (e) => {
    if (e.target !== startBtn) {
        jump();
    }
});

startBtn.addEventListener('click', startGame);
