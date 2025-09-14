export {};

// ===== 画像オブジェクトの準備 =====
const moonImage = new Image();
const earthImage = new Image();
const sunImage = new Image();

// ===== 天体クラスの定義 =====
class CelestialBody {
    name: string;
    image: HTMLImageElement;
    orbitRadius: number;
    speed: number; // 1秒あたりの回転角度(ラジアン)
    size: number; // 描画サイズ (ピクセル)
    angle: number;
    children: CelestialBody[];

    constructor(name: string, image: HTMLImageElement, orbitRadius: number, speed: number, size: number) {
        this.name = name;
        this.image = image;
        this.orbitRadius = orbitRadius;
        this.speed = speed;
        this.size = size;
        this.angle = Math.random() * Math.PI * 2; // 開始角度をランダムに
        this.children = [];
    }

    addChild(child: CelestialBody) {
        this.children.push(child);
    }

    update(deltaTime: number) {
        this.angle += this.speed * deltaTime;
        this.children.forEach(child => child.update(deltaTime));
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.rotate(this.angle);
        ctx.translate(this.orbitRadius, 0);

        // 指定されたsizeで画像を中心に描画
        ctx.drawImage(this.image, -this.size / 2, -this.size / 2, this.size, this.size);

        this.children.forEach(child => child.draw(ctx));
        ctx.restore();
    }
}

// ===== グローバル変数 =====
let sun: CelestialBody;
let lastTime = 0;
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

// ===== メインの描画ループ =====
function gameLoop(currentTime: number) {
    if (!sun) { // 初期化が完了するまで待つ
        requestAnimationFrame(gameLoop);
        return;
    }
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    sun.update(deltaTime);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    ctx.beginPath();
    ctx.arc(0, 0, 150, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.stroke();

    sun.draw(ctx);

    ctx.restore();

    requestAnimationFrame(gameLoop);
}

// ===== 初期化処理 =====
async function init() {
    const loadImage = (img: HTMLImageElement, src: string) => new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
    });

    try {
        await Promise.all([
            loadImage(sunImage, new URL('img/canvas_sun.png', import.meta.url).href),
            loadImage(earthImage, new URL('img/canvas_earth.png', import.meta.url).href),
            loadImage(moonImage, new URL('img/canvas_moon.png', import.meta.url).href)
        ]);
    } catch (error) {
        console.error("画像の読み込みに失敗しました:", error);
        return;
    }

    // 天体オブジェクトの作成時に、sizeをピクセルで指定
    sun = new CelestialBody('sun', sunImage, 0, 0, 80);
    const earth = new CelestialBody('earth', earthImage, 100, 0.8, 30);
    const moon = new CelestialBody('moon', moonImage, 30, 2.5, 12);
    
    sun.addChild(earth);
    earth.addChild(moon);

    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}

init();
