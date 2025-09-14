import 'phaser';

class MainScene extends Phaser.Scene {
    player!: Phaser.GameObjects.Graphics;
    ball!: Phaser.GameObjects.Graphics & { body: Phaser.Physics.Arcade.Body };
    gameOverText!: Phaser.GameObjects.Text;
    isGameOver: boolean = false;

    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        // Player
        this.player = this.add.graphics({ fillStyle: { color: 0xff0000 } });
        const playerCircle = new Phaser.Geom.Circle(0, 0, 25);
        this.player.fillCircleShape(playerCircle);
        this.physics.world.enable(this.player);
        const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
        playerBody.setCircle(25);


        // Ball
        this.ball = this.add.graphics({ fillStyle: { color: 0x0000ff } }) as any;
        const ballCircle = new Phaser.Geom.Circle(0, 0, 30);
        this.ball.fillCircleShape(ballCircle);
        this.physics.world.enable(this.ball);
        this.ball.body.setCircle(30);
        this.ball.body.setBounce(1, 1);
        this.ball.body.setCollideWorldBounds(true);
        this.ball.body.setVelocity(200, 100);
        this.ball.setPosition(100, 100);


        // Game Over Text
        this.gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Game Over', { fontSize: '64px', color: '#ff0000' });
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.setVisible(false);

        // Collision
        this.physics.add.collider(this.player, this.ball, this.gameOver, undefined, this);

        // Mouse control
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (!this.isGameOver) {
                this.player.setPosition(pointer.x, pointer.y);
            }
        });
    }

    update() {
        if (this.isGameOver) {
            return;
        }
    }

    gameOver() {
        this.isGameOver = true;
        this.physics.pause();
        this.gameOverText.setVisible(true);
        this.player.setVisible(false);
        this.ball.setVisible(false);
    }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x:0, y: 200 }
        }
    },
    scene: [MainScene]
};

const game = new Phaser.Game(config);
