const robot = document.getElementById('robot');
const gameBoard = document.getElementById('gameBoard');
const startBtn = document.getElementById('startBtn');
const startOverlay = document.getElementById('startOverlay');
const scoreVal = document.getElementById('scoreVal');

const jumpSound = new Audio('jump.mp3');
const bgMusic = new Audio('music.mp3');
bgMusic.loop = true;

let score = 0;
let isJumping = false;
let gameActive = false;
let obstacleTimeout;

function jump() {
    if (isJumping || !gameActive) return;
    
    isJumping = true;
    robot.classList.add('jump-animation');
    
    jumpSound.currentTime = 0;
    jumpSound.play().catch(() => {});

    setTimeout(() => {
        robot.classList.remove('jump-animation');
        isJumping = false;
    }, 600); 
}

function spawnObstacle() {
    if (!gameActive) return;

    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
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

function startGame() {
    gameActive = true;
    score = 0;
    scoreVal.textContent = score;
    startOverlay.style.display = 'none';
    
    bgMusic.volume = 0.4;
    bgMusic.play().catch(() => {});
    
    spawnObstacle();
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
