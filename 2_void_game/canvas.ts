export {};

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
let raf: number;

class Player {
    x: number;
    y: number;
    radius: number;

    constructor(x: number, y: number, radius: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = 'red';
        ctx.fill();
    }

    update(mouseX: number, mouseY: number) {
        this.x = mouseX;
        this.y = mouseY;
    }

    collideWith(ball: Ball): boolean{
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const squaredDistance = dx * dx + dy * dy;
        if (squaredDistance < (this.radius + ball.radius) ** 2) {
            return true;
            // Collision detected
        }
        return false;
    }
}

class Ball {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;

    constructor(x: number, y: number, vx: number, vy: number, radius: number, color: string) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy *= 0.999;
        this.vy += 0.25; //gravity
        if(this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.vx = -this.vx;
        }
        if(this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.vy = -this.vy;
        }
    }
}

const ball = new Ball(100, 100, 4, 2, 30, 'blue');
const player = new Player(canvas.width / 2, canvas.height / 2, 25);

function init() {
    loop();
}

function loop () {
    ball.update();
    if(player.collideWith(ball)) {
        console.log("game over");
        ctx.fillText("Game Over", canvas.width / 2 - 30, canvas.height / 2);
        window.cancelAnimationFrame(raf);
    }
    draw();
    raf = window.requestAnimationFrame(loop);
}

function draw() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ball.draw();
    player.draw();
}

function movePlayer(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    player.update(mouseX, mouseY);
}

canvas.addEventListener("mouseover", (e) => {
    raf = window.requestAnimationFrame(draw);
})

canvas.addEventListener("mouseout", (e) => {
    window.cancelAnimationFrame(raf);
})

canvas.addEventListener("mousemove", (e) => {
    movePlayer(e);
})



ball.draw();
init();
