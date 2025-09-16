import 'phaser';

class TitleScene extends Phaser.Scene {
    startButton!: Button;

    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        const titleText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'My Phaser Game', {
            fontSize: '48px',
            color: '#000'
        }).setOrigin(0.5);

        const instructionText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 50, 'Click Space to Start', {
            fontSize: '24px',
            color: '#000'
        }).setOrigin(0.5);

        this.startButton = new Button(this, this.cameras.main.centerX, this.cameras.main.centerY + 100, 200, 50, 0x00ff00, 'Start', () => {
            this.scene.start('GameScene');
        });


        this.input.keyboard?.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
    }
}

class GameScene extends Phaser.Scene {
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    player!: Player;
    enemy!: Enemy;
    score: number = 0;
    scoreText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.cursors = this.input.keyboard?.createCursorKeys()!;
        // Player
        this.player = new Player(this, this.cameras.main.centerX, this.cameras.main.height - 50, 25);

        // Enemy
        this.enemy = new Enemy(this, this.cameras.main.centerX, 50, 30);

        // Collider
        this.physics.add.collider(this.player, this.enemy, this.gameOver, undefined, this);

        // UI
        this.scoreText = this.add.text(10, 10, `Score: ${this.player.debugShowVelocity}`, { fontSize: '20px', color: '#000' });
    }

    update() {
        const vecData = this.player.move(this.cursors!);
        this.enemy.move();
        this.scoreText.setText(vecData.x.toString() + "," + vecData.y.toString());
    }

    gameOver = () => {
        this.scene.start('GameOverScene', { score: this.score });
    }
}

class GameOverScene extends Phaser.Scene {
    score: number;
    gameoverButton!: Button;

    constructor() {
        super({ key: 'GameOverScene' });
        this.score = 0;
    }

    init(data: { score: number }) {
        this.score = data.score;
    }

    create() {
        const gameOverText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'Game Over', {
            fontSize: '48px',
            color: '#f00'
        }).setOrigin(0.5);

        const scoreText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, `Score: ${this.score}`, {
            fontSize: '24px',
            color: '#000'
        }).setOrigin(0.5);


        const restartText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 50, 'Click Space to Restart', {
            fontSize: '24px',
            color: '#000'
        }).setOrigin(0.5);

        this.gameoverButton = new Button(this, this.cameras.main.centerX, this.cameras.main.centerY + 100, 200, 50, 0x00ff00, 'Restart', () => {
            this.scene.start('GameScene');
        });

        this.input.keyboard?.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
    }
}

class Player extends Phaser.Physics.Arcade.Sprite {
    radius: number;
    speed: number;
    body!: Phaser.Physics.Arcade.Body;

    constructor(scene: Phaser.Scene, x: number, y: number, radius: number) {
        super(scene, x, y, '');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.radius = radius;
        this.speed = 200;

        this.body.setCollideWorldBounds(true);
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
        }
        return vec;
    }
}

class Enemy extends Phaser.Physics.Arcade.Sprite {
    radius: number;
    speed: number;
    body!: Phaser.Physics.Arcade.Body;

    constructor(scene: Phaser.Scene, x: number, y: number, radius: number) {
        super(scene, x, y, '');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.radius = radius;
        this.speed = 100;

        this.body.setCollideWorldBounds(true);
    }

    move() {
        // シンプルに左右に動く例
        if (this.body.blocked.left || this.body.blocked.right) {
            this.speed *= -1;
        }
        this.body.setVelocityX(this.speed);
    }
}

class Button extends Phaser.GameObjects.Rectangle {
    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, color: number, text: string, onClick: () => void) {
        super(scene, x, y, width, height, color);
        scene.add.existing(this);
        this.setInteractive({ useHandCursor: true })
            .on('pointerdown', onClick);

        const buttonText = scene.add.text(x, y, text, { fontSize: '20px', color: '#000' });
        buttonText.setOrigin(0.5);
    }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x:0, y: 0 },
            debug: true
        }
    },
    scene: [TitleScene, GameScene, GameOverScene]
};

new Phaser.Game(config);
