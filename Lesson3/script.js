/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("#canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 400);
const CANVAS_HEIGHT = (canvas.height = 800);
const numberOfEnemies = 20;
const enemiesArray = [];

let gameFrame = 0;

class Enemy {
	constructor() {
		this.image = new Image();
		this.image.src = "enemy1.png";
		// this.speed = Math.random() * 4 - 2;
		this.spriteWidth = 293;
		this.spriteHeight = 155;
		this.width = this.spriteWidth / 2.5;
		this.height = this.spriteHeight / 2.5;
		this.x = Math.random() * (CANVAS_WIDTH - this.width);
		this.y = Math.random() * (CANVAS_HEIGHT - this.height);
		this.frame = 0;
		this.flapSpeed = Math.floor(Math.random() * 3 + 1);
	}
	update() {
		this.x += Math.random() * 5 - 2.5;
		this.y += Math.random() * 5 - 2.5;
		if (gameFrame % this.flapSpeed == 0) {
			this.frame = this.frame > 4 ? 0 : this.frame + 1;
		}
	}
	draw() {
		ctx.drawImage(
			this.image,
			this.frame * this.spriteWidth,
			0,
			this.spriteWidth,
			this.spriteHeight,
			this.x,
			this.y,
			this.width,
			this.height,
		);
	}
}
// const enemy1 = new Enemy();
for (let i = 0; i < numberOfEnemies; i++) {
	enemiesArray.push(new Enemy());
}
function animate() {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	enemiesArray.forEach((enemy) => {
		enemy.update();
		enemy.draw();
	});
	gameFrame++;
	requestAnimationFrame(animate);
}
animate();
