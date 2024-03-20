import { Scene } from 'phaser'

export default class CollectingStarsScene extends Scene {
	constructor() {
		super('collecting-stars-scene')
	}
	init() {
		this.platforms = []
		this.player = undefined
		this.stars = undefined
		this.cursor = undefined
		this.scoreText = undefined
		this.score = 0
		this.bombs = undefined
	}
	preload() {
		this.load.image('ground', 'images/platform.png')
		this.load.image('star', 'images/star.png')
		this.load.image('sky', 'images/sky.png')
		this.load.image('bomb', 'images/bomb.png')
		this.load.spritesheet('dude', 'images/hood.png', {
			frameWidth: 32,
			frameHeight: 32,
		})
	}

	create() {
		this.add.image(400, 300, 'sky')
		this.platforms = this.physics.add.staticGroup()
		this.platforms.create(600, 400, 'ground')
		this.platforms.create(50, 250, 'ground')
		this.platforms.create(750, 220, 'ground')
		this.platforms.create(400, 568, 'ground').setScale(2).refreshBody()
		this.player = this.physics.add.sprite(100, 450, 'dude')
		this.player.setCollideWorldBounds(true)
		this.physics.add.collider(this.player, this.platforms)
		this.stars = this.physics.add.group({
			key: 'star',
			repeat: 10,
			setXY: { x: 50, y: 0, stepX: 70 },
		})

		this.bombs = this.physics.add.group({
			key: 'bomb',
			repeat: 5,
			setXY: { x: 30, y: 0, stepX: 120 },
		})

		this.physics.add.collider(this.stars, this.platforms)
		this.stars.children.iterate((child) => {
			child.setBounce(0.5)
		})
		this.physics.add.collider(this.bombs, this.platforms)
		this.bombs.children.iterate((child) => {
			child.setBounce(0.5)
		})
		this.cursor = this.input.keyboard.createCursorKeys()

		// this.anims.create({
		// 	key: 'left',
		// 	frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
		// 	frameRate: 10,
		// 	repeat: -1,
		// })

		this.anims.create({
			key: 'turn',
			frames: [{ key: 'dude', frame: 0 }],
			frameRate: 20,
		})

		this.anims.create({
			key: 'walk',
			frames: this.anims.generateFrameNumbers('dude', { start: 24, end: 31 }),
			frameRate: 10,
			repeat: -1,
		})

		this.physics.add.overlap(
			this.player,
			this.stars,
			this.collectStar,
			null,
			this,
		)
		this.scoreText = this.add.text(16, 16, 'Score: 0', {
			fontSize: '32',
			fill: 'yellow',
		})

		this.physics.add.overlap(this.player, this.bombs, this.gameOver, null, this)
	}
	update() {
		if (this.cursor.left.isDown) {
			this.player.setVelocityX(-200)
			this.player.anims.play('walk', true)
			this.player.setFlipX(true)
		} else if (this.cursor.right.isDown) {
			this.player.setVelocityX(200)
			this.player.anims.play('walk', true)
			this.player.setFlipX(false)
		} else {
			this.player.setVelocity(0, 0)
			this.player.anims.play('turn')
		}

		// up and down
		if (this.cursor.up.isDown) {
			this.player.setVelocityY(-200)
			this.player.anims.play('turn')
		}
		if (this.cursor.up.isUp) {
			this.player.setVelocityY(200)
		}
		if (this.score >= 100) {
			this.physics.pause()
			this.add.text(300, 300, 'You Win!!!', {
				fontSize: '48px',
				fill: 'yellow',
			})
		}
	}

	collectStar(player, star) {
		star.destroy()
		this.score += 10
		this.scoreText.setText('Score: ' + this.score)
	}

	gameOver() {
		this.physics.pause()
		this.add.text(300, 300, 'Game Over', {
			fontSize: '48px',
			fill: 'yellow',
		})
	}
}
