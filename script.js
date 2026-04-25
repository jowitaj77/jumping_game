const player = document.getElementById("player");
const gameContainer = document.getElementById("game-container");
const scoreBoard = document.getElementById("score-board");
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");

let score = 0;
let isGameOver = false;
let gameLoop;
let isGameRunning = false;

const obstacleData = [
    { url: "url('Tree 0141.png')", width: "35px", height: "70px" },
    { url: "url('Tree 0151.png')", width: "45px", height: "60px" },
    { url: "url('Bush 16x161.png')", width: "30px", height: "30px" }
];

function startGame() {
    startScreen.style.display = "none";
    isGameRunning = true;
    score = 0;
    scoreBoard.innerText = `Score: ${score}`;
    
    spawnObstacle();
    
    gameLoop = setInterval(checkCollisions, 10);
}

startButton.addEventListener("click", startGame);

function jump() {
    if (isGameOver || !isGameRunning) return;
    
    if (!player.classList.contains("jump-animation")) {
        player.classList.add("jump-animation");
        player.style.backgroundImage = "url('skeleton-04_jump_00.png')";

        setTimeout(() => {
            player.classList.remove("jump-animation");
            if (!isGameOver) {
                player.style.backgroundImage = "url('skeleton-03_run_00.png')";
            }
        }, 600);
    }
}

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        jump();
    }
});

function spawnObstacle() {
    if (isGameOver || !isGameRunning) return;

    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    
    const randomType = obstacleData[Math.floor(Math.random() * obstacleData.length)];
    
    obstacle.style.backgroundImage = randomType.url;
    obstacle.style.width = randomType.width;
    obstacle.style.height = randomType.height;
    
    gameContainer.appendChild(obstacle);

    setTimeout(() => {
        if (!isGameOver) {
            score++;
            scoreBoard.innerText = `Score: ${score}`;
        }
        obstacle.remove();
    }, 1500);

    let nextSpawn = Math.random() * 1500 + 1000;
    setTimeout(spawnObstacle, nextSpawn);
}

function checkCollisions() {
    if (isGameOver) return;

    const playerBottom = parseInt(window.getComputedStyle(player).getPropertyValue("bottom"));
    const obstacles = document.querySelectorAll(".obstacle");

    obstacles.forEach(obs => {
        const obsLeft = obs.offsetLeft;
        const obsWidth = obs.offsetWidth;
        const obsHeight = obs.offsetHeight;
        
        if (obsLeft < 110 && obsLeft + obsWidth > 50 && playerBottom < 40 + obsHeight - 10) {
            handleGameOver();
        }
    });
}

function handleGameOver() {
    isGameOver = true;
    isGameRunning = false;
    clearInterval(gameLoop);
    
    player.style.backgroundImage = "url('skeleton-08_get_hit_01.png')";
    
    const obstacles = document.querySelectorAll(".obstacle");
    obstacles.forEach(obs => obs.style.animation = "none");
    player.style.animation = "none";

    setTimeout(() => {
        alert(`GAME OVER! Final Score: ${score}`);
        location.reload();
    }, 150);
}