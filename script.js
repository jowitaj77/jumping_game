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


function jump() {
    if (isJumping || !gameActive) return;
    
    isJumping = true;
    robot.classList.add('jump-animation');
    

    jumpSound.currentTime = 0;
    jumpSound.play();

    setTimeout(() => {
        robot.classList.remove('jump-animation');
        isJumping = false;
    }, 500);
}

function createObstacle() {
    if (!gameActive) return;

    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    gameBoard.appendChild(obstacle);

    let randomDelay = Math.floor(Math.random() * 1300) + 1200;


    obstacle.addEventListener('animationend', () => {
        obstacle.remove();
        score++;
        scoreVal.innerText = score;
    });

    setTimeout(createObstacle, randomDelay);
}

function startGame() {
    gameActive = true;
    score = 0;
    scoreVal.innerText = score;
    startOverlay.style.display = 'none';
    
    bgMusic.play().catch(err => console.log("Music autoplay blocked"));
    
    createObstacle();
}


window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') jump();
});

gameBoard.addEventListener('click', jump);
startBtn.addEventListener('click', startGame);
