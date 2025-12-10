const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

let score = 0;
const numEnemies = 5;
const enemies = [];

const player = {
    x: 50,
    y: 550,
    width: 30,
    height: 30,
    color: 'blue',
    speed: 5,
    dx: 0,
    dy: 0
};

const coin = {
    x: 150,
    y: 150,
    radius: 10,
    color: 'gold'
};

const keys = {
    ArrowRight: false,
    ArrowLeft: false,
    ArrowUp: false,
    ArrowDown: false
};

function createEnemies() {
    enemies.length = 0; // Clear existing enemies
    for (let i = 0; i < numEnemies; i++) {
        enemies.push({
            x: Math.random() * (canvas.width - 40),
            y: 20 + Math.random() * (canvas.height / 2),
            width: 40,
            height: 40,
            color: 'red',
            speed: Math.random() * 2 + 1 // Random speed between 1 and 3
        });
    }
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawCoin() {
    ctx.beginPath();
    ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
    ctx.fillStyle = coin.color;
    ctx.fill();
    ctx.closePath();
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updatePlayerPosition() {
    player.x += player.dx;
    player.y += player.dy;

    // Wall collision detection
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

function updateEnemyPositions() {
    enemies.forEach(enemy => {
        enemy.x += enemy.speed;
        // Wall collision for enemy
        if (enemy.x < 0 || enemy.x + enemy.width > canvas.width) {
            enemy.speed *= -1;
        }
    });
}

function movePlayer() {
    player.dx = 0;
    player.dy = 0;
    if (keys.ArrowRight) player.dx = player.speed;
    if (keys.ArrowLeft) player.dx = -player.speed;
    if (keys.ArrowUp) player.dy = -player.speed;
    if (keys.ArrowDown) player.dy = player.speed;
}

function checkCollisions() {
    // Player and coin collision
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;
    const dx = playerCenterX - coin.x;
    const dy = playerCenterY - coin.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < player.width / 2 + coin.radius) {
        collectCoin();
    }

    // Player and enemy collision
    enemies.forEach(enemy => {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            gameOver();
        }
    });
}

function collectCoin() {
    score++;
    scoreDisplay.textContent = 'Score: ' + score;
    coin.x = Math.random() * (canvas.width - coin.radius * 2) + coin.radius;
    coin.y = Math.random() * (canvas.height - coin.radius * 2) + coin.radius;
}

function gameOver() {
    alert('Game Over! Your score was: ' + score);
    score = 0;
    scoreDisplay.textContent = 'Score: ' + score;
    player.x = 50;
    player.y = canvas.height - player.height - 10;
    createEnemies(); // Reset enemies
}

function gameLoop() {
    clearCanvas();
    movePlayer();
    updatePlayerPosition();
    updateEnemyPositions();
    checkCollisions();
    
    drawPlayer();
    drawCoin();
    drawEnemies();
    
    requestAnimationFrame(gameLoop);
}

function keyDown(e) {
    if (keys[e.key] !== undefined) keys[e.key] = true;
}

function keyUp(e) {
    if (keys[e.key] !== undefined) keys[e.key] = false;
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

player.y = canvas.height - player.height - 10; // Start at the bottom
createEnemies();
gameLoop();
