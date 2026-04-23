const player = document.getElementById("player");
const gameContainer = document.getElementById("game-container");
const scoreBoard = document.getElementById("score-board");

let score = 0;
let isGameOver = false;

function jump() {
    if (isGameOver) return;
    
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
    if (isGameOver) return;

    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
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

const gameLoop = setInterval(() => {
    if (isGameOver) return;

    const playerBottom = parseInt(window.getComputedStyle(player).getPropertyValue("bottom"));
    const obstacles = document.querySelectorAll(".obstacle");

    obstacles.forEach(obs => {
        const obsLeft = obs.offsetLeft;
        
        // Collision Detection:
        // Player is at left 50px. Obstacle is at bottom 40px.
        // We check if obstacle is in player's X-range and if player is low enough to hit it.
        if (obsLeft > 50 && obsLeft < 110 && playerBottom < 85) {
            handleGameOver();
        }
    });
}, 10);

function handleGameOver() {
    isGameOver = true;
    player.style.backgroundImage = "url('skeleton-08_get_hit_01.png')";
    
    const obstacles = document.querySelectorAll(".obstacle");
    obstacles.forEach(obs => obs.style.animation = "none");
    player.style.animation = "none";

    setTimeout(() => {
        alert(`GAME OVER! Final Score: ${score}`);
        location.reload();
    }, 150);
}

spawnObstacle();