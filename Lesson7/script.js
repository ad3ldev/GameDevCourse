window.addEventListener("load", () => {
	/** @type {HTMLCanvasElement} */
	const canvas = document.querySelector("#canvas1");
	const ctx = canvas.getContext("2d");
	const CANVAS_WIDTH = (canvas.width = 800);
	const CANVAS_HEIGHT = (canvas.height = 720);
	let score = 0;
	let gameOver = false;

	let enemies = [];

	class InputHandler {
		constructor() {
			this.keys = [];
			window.addEventListener("keydown", ({ key }) => {
				if (
					(key == "ArrowDown" ||
						key == "ArrowUp" ||
						key == "ArrowLeft" ||
						key == "ArrowRight") &&
					this.keys.indexOf(key) === -1
				) {
					this.keys.push(key);
				}
			});
			window.addEventListener("keyup", ({ key }) => {
				if (
					key == "ArrowDown" ||
					key == "ArrowUp" ||
					key == "ArrowLeft" ||
					key == "ArrowRight"
				) {
					this.keys.splice(this.keys.indexOf(key), 1);
				}
			});
		}
	}
	class Player {
		constructor(gameWidth, gameHeight) {
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.spriteWidth = 200;
			this.spriteHeight = 200;
			this.width = this.spriteWidth;
			this.height = this.spriteHeight;
			this.x = 0;
			this.y = this.gameHeight - this.height;
			this.image = playerImage;
			this.frameX = 0;
			this.maxFrame = 8;
			this.frameY = 0;
			this.fps = 20;
			this.frameTimer = 0;
			this.frameInterval = 1000 / this.fps;
			this.vx = 0;
			this.vy = 0;
			this.weight = 1;
		}
		draw(context) {
			context.drawImage(
				this.image,
				this.frameX * this.spriteWidth,
				this.frameY * this.spriteHeight,
				this.spriteWidth,
				this.spriteHeight,
				this.x,
				this.y,
				this.width,
				this.height,
			);
		}
		update(input, deltaTime, enemies) {
			enemies.forEach((enemy) => {
				const dx =
					enemy.x + enemy.width / 2 - (this.x + this.width / 2);
				const dy =
					enemy.y + enemy.height / 2 - (this.y + this.height / 2);
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < enemy.width / 2 + this.width / 2) {
					gameOver = true;
				}
			});
			if (this.frameTimer > this.frameInterval) {
				this.frameTimer = 0;
				if (this.frameX >= this.maxFrame) {
					this.frameX = 0;
				} else {
					this.frameX++;
				}
			} else {
				this.frameTimer += deltaTime;
			}

			if (input.keys.indexOf("ArrowRight") > -1) {
				this.vx = 5;
			} else if (input.keys.indexOf("ArrowLeft") > -1) {
				this.vx = -5;
			} else if (input.keys.indexOf("ArrowUp") > -1 && this.onGround()) {
				this.vy -= 30;
			} else {
				this.vx = 0;
			}
			// Horizontal
			this.x += this.vx;
			if (this.x < 0) {
				this.x = 0;
			} else if (this.x > this.gameWidth - this.width) {
				this.x = this.gameWidth - this.width;
			}
			// Vertical
			this.y += this.vy;
			if (!this.onGround()) {
				this.maxFrame = 5;
				this.vy += this.weight;
				this.frameY = 1;
			} else {
				this.maxFrame = 8;
				this.vy = 0;
				this.frameY = 0;
			}
			if (this.y > this.gameHeight - this.height) {
				this.y = this.gameHeight - this.height;
			}
		}
		onGround() {
			return this.y >= this.gameHeight - this.height;
		}
	}
	class Background {
		constructor(gameWidth, gameHeight) {
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.image = backgroundImage;
			this.x = 0;
			this.y = 0;
			this.width = 2400;
			this.height = 720;
			this.speed = 10;
		}
		draw(context) {
			context.drawImage(
				this.image,
				this.x,
				this.y,
				this.width,
				this.height,
			);
			context.drawImage(
				this.image,
				this.x + this.width - this.speed,
				this.y,
				this.width,
				this.height,
			);
		}
		update() {
			this.x -= this.speed;
			if (this.x < 0 - this.width) {
				this.x = 0;
			}
		}
	}
	class Enemy {
		constructor(gameWidth, gameHeight) {
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.width = 160;
			this.height = 119;
			this.image = enemyImage;
			this.x = this.gameWidth;
			this.y = this.gameHeight - this.height;
			this.frameX = 0;
			this.maxFrame = 5;
			this.fps = 20;
			this.frameTimer = 0;
			this.frameInterval = 1000 / this.fps;
			this.speed = Math.random() * 0.1 + 0.1;
			this.markedForDeletion = false;
		}
		draw(context) {
			context.drawImage(
				this.image,
				this.frameX * this.width,
				0,
				this.width,
				this.height,
				this.x,
				this.y,
				this.width,
				this.height,
			);
		}
		update(deltaTime) {
			if (this.frameTimer > this.frameInterval) {
				this.frameTimer = 0;
				if (this.frameX >= this.maxFrame) {
					this.frameX = 0;
				} else {
					this.frameX++;
				}
			} else {
				this.frameTimer += deltaTime;
			}
			this.x -= this.speed * deltaTime;
			if (this.x < 0 - this.width) {
				this.markedForDeletion = true;
				score++;
			}
		}
	}
	let enemyTimer = 0;
	let enemyInterval = 1000;
	let randomEnemyInterval = Math.random() * 1000 + 500;

	function handleEnemies(deltaTime) {
		if (enemyTimer > enemyInterval + randomEnemyInterval) {
			enemies.push(new Enemy(CANVAS_WIDTH, CANVAS_HEIGHT));
			randomEnemyInterval = Math.random() * 1000 + 500;
			enemyTimer = 0;
		} else {
			enemyTimer += deltaTime;
		}
		enemies.forEach((enemy) => {
			enemy.update(deltaTime);
			enemy.draw(ctx);
		});
		enemies = enemies.filter((enemy) => !enemy.markedForDeletion);
	}
	function displayStatusText(context) {
		context.font = "40px Helvetica";
		context.fillStyle = "black";
		context.fillText(`Score: ${score}`, 20, 50);
		context.fillStyle = "white";
		context.fillText(`Score: ${score}`, 22, 52);
		if (gameOver) {
			context.textAlign = "center";
			context.fillStyle = "black";
			context.fillText(
				`GAME OVER, try again`,
				CANVAS_WIDTH / 2,
				CANVAS_HEIGHT / 2,
			);
			context.fillStyle = "white";
			context.fillText(
				`GAME OVER, try again`,
				CANVAS_WIDTH / 2 + 2,
				CANVAS_HEIGHT / 2 + 2,
			);
		}
	}

	const input = new InputHandler();
	const player = new Player(CANVAS_WIDTH, CANVAS_HEIGHT);
	const background = new Background(CANVAS_WIDTH, CANVAS_HEIGHT);

	let lastTime = 0;

	function animate(timestamp) {
		ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		const deltaTime = timestamp - lastTime;
		lastTime = timestamp;
		// background.update();
		background.draw(ctx);
		handleEnemies(deltaTime);
		player.update(input, deltaTime, enemies);
		player.draw(ctx);
		displayStatusText(ctx);
		if (!gameOver) {
			requestAnimationFrame(animate);
		}
	}
	animate(0);
});
