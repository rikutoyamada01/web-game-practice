import "phaser";

class TitleScene extends Phaser.Scene {
    startButton!: Button;

    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        const titleText = this.add
            .text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'My Phaser Game', {
                fontSize: '48px',
                color: '#000',
            })
            .setOrigin(0.5);

        const instructionText = this.add
            .text(this.cameras.main.centerX, this.cameras.main.centerY + 50, 'Click Space to Start', {
                fontSize: '24px',
                color: '#000',
            })
            .setOrigin(0.5);
        this.startButton = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 100,
            200,
            50,
            0x00ff00,
            'Start',
            () => {
                this.scene.start('GameScene');
            }
        );
    }
}

class GameScene extends Phaser.Scene {
    player!: Player;
    enemies!: Phaser.Physics.Arcade.Group;
    particleEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
    particle!: Phaser.GameObjects.Particles.ParticleEmitter;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    score!: ScoreText;
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('particle', 'img/particle.png');
        this.load.image('player', 'img/player.png');
        this.load.image('enemy', 'img/enemy.png');
    }

    create() {
        this.cursors = this.input.keyboard?.createCursorKeys()!;
        this.physics.world.setBounds(0, 0, 2000, 2000);
        this.player = new Player(this, this.cameras.main.centerX, this.cameras.main.centerY);
        this.player.init(25, 200);
        this.player.setCollideWorldBounds(true);

        this.cameras.main.startFollow(this.player, true, 1, 1);
        this.cameras.main.setBounds(0, 0, 2000, 2000);

        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        for (let i = 0; i < 50; i++) {
            this.spawnEnemy();
        }

        this.particleEmitter = this.add.particles(0, 0, 'particle', {
            speed: { min: 50, max: 150 },
            lifespan: 500,
            quantity: 15,
            scale: { start: 0.5, end: 0 },
            alpha: { start: 1, end: 0 },
            emitting: false
        });

        this.score = new ScoreText(this, 16, 16);
        this.score.setScrollFactor(0);
    }

    update() {
        this.player.move(this.cursors!);
        this.enemies.getChildren().forEach((enemy) => {
            (enemy as Enemy).move();
        });
    }

    private spawnEnemy() {
        const x = Phaser.Math.Between(0, 2000);
        const y = Phaser.Math.Between(0, 2000);
        const enemy = this.enemies.get(x, y) as Enemy;

        enemy.init(20, 100);

        enemy.setCollideWorldBounds(true);
        enemy.enableBody(true, x, y, true, true);

        this.physics.add.collider(this.player, enemy, () => {
            this.handlePlayerEnemyCollision(this.player, enemy);
        });
    }

    private handlePlayerEnemyCollision(player: Player, enemy: Enemy) {
        if (player.radius > enemy.radius) {
            this.playParticleEffect(enemy.x, enemy.y);
            enemy.disableBody(true, true);
            this.spawnEnemy();
            this.score.setScore(this.score.score + 1);
        } else if (player.radius < enemy.radius) {
            this.scene.start('GameOverScene');
        }
    }

    private playParticleEffect(x: number, y: number) {
        this.particleEmitter.explode(100, x, y);
    }
}

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        const gameOverText = this.add
            .text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'Game Over', {
                fontSize: '48px',
                color: '#f00',
            })
            .setOrigin(0.5);

        const instructionText = this.add
            .text(this.cameras.main.centerX, this.cameras.main.centerY + 50, 'Click to Restart', {
                fontSize: '24px',
                color: '#000',
            })
            .setOrigin(0.5);

        this.input.once('pointerup', () => {
            this.scene.start('GameScene');
        });
    }
}

class Player extends Phaser.Physics.Arcade.Sprite {
    radius: number = 25;
    speed: number = 200;
    body!: Phaser.Physics.Arcade.Body;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    init(radius: number, speed: number) {
        this.radius = radius;
        this.speed = speed;

        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x0000ff, 1);
        graphics.fillCircle(radius, radius, radius);
        graphics.generateTexture('player', radius * 2, radius * 2);
        this.setTexture('player');
        graphics.destroy();


        this.body.setCollideWorldBounds(true);
        this.setCircle(radius);
    }


    move(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        const body = this.body;
        let vx = 0;
        let vy = 0;

        if (cursors.left?.isDown) vx -= 1;
        if (cursors.right?.isDown) vx += 1;
        if (cursors.up?.isDown) vy -= 1;
        if (cursors.down?.isDown) vy += 1;
        const vec = new Phaser.Math.Vector2(vx, vy);

        if (vec.lengthSq() > 0) {
            vec.normalize().scale(this.speed);
            body.setVelocity(vec.x, vec.y);
        } else {
            body.setVelocity(0, 0);
        };
    }
}

class Enemy extends Phaser.Physics.Arcade.Sprite {
    radius: number = 20;
    speed: number = 100;
    body!: Phaser.Physics.Arcade.Body;
    moveTimer: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'enemy');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
    }

    init(radius: number, speed: number) {
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0xff0000, 1);
        graphics.fillCircle(radius, radius, radius);
        graphics.generateTexture('enemy', radius * 2, radius * 2);
        this.setTexture('enemy');
        graphics.destroy();

        this.radius = radius;
        this.speed = speed;
        this.moveTimer = 0;
        this.setCircle(radius);
        this.body.setCollideWorldBounds(true);
    }


    move() {
        this.moveTimer -= 1;
        if (this.moveTimer > 0) return;
        this.moveTimer = Phaser.Math.Between(30, 120);
        let vec = Phaser.Math.RandomXY(new Phaser.Math.Vector2(), 1);
        if (vec.lengthSq() > 0) {
            vec.normalize().scale(this.speed);
            this.body.setVelocity(vec.x, vec.y);
        } else {
            this.body.setVelocity(0, 0);
        }
    }
}

class Button extends Phaser.GameObjects.Container {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        color: number,
        text: string,
        onClick: () => void
    ) {
        super(scene, x, y);
        const button = scene.add.rectangle(0, 0, width, height, color).setInteractive({ useHandCursor: true });
        const buttonText = scene.add.text(0, 0, text, { fontSize: '24px', color: '#000' }).setOrigin(0.5);  

        this.add(button);
        this.add(buttonText);

        button.on('pointerup', onClick);
        scene.add.existing(this);

        button.on('pointerover', () => {
            button.setFillStyle(0x555555);
        });

        button.on('pointerout', () => {
            button.setFillStyle(color);
        });
    }
}

class ScoreText extends Phaser.GameObjects.Text {
    score: number;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'Score: 0', { fontSize: '24px', color: '#000' });
        this.score = 0;
        scene.add.existing(this);
    }

    setScore(score: number) {
        this.score = score;
        this.setText(`Score: ${this.score}`);
    }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: '100%',
    height: '100%',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: true
        },  
    },
    scene: [TitleScene, GameScene, GameOverScene],
    parent: 'game-container',
    backgroundColor: '#ffffff',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};

new Phaser.Game(config);
