/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("#canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = window.innerWidth);
const CANVAS_HEIGHT = (canvas.height = window.innerHeight);

const collisionCanvas = document.querySelector("#collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");
const COLL_CANVAS_WIDTH = (collisionCanvas.width = window.innerWidth);
const COLL_CANVAS_HEIGHT = (collisionCanvas.height = window.innerHeight);

let score = 0;
let gameOver = false;
ctx.font = "50px Impact";

let timeToNextRave = 0;
let ravenInterval = 500;
let lastTime = 0;

let explosions = [];
class Explosion {
	constructor(x, y, size) {
		this.spriteWidth = 200;
		this.spriteHeight = 179;
		this.size = size;
		this.x = x;
		this.y = y;
		this.image = new Image();
		this.image.src = "boom.png";
		this.frame = 0;
		this.timer = 0;
		this.sound = new Audio();
		this.sound.src = "boom.wav";
		this.timeSinceLastFrame = 0;
		this.frameInterval = 200;
		this.markedForDeletion = false;
	}
	update(deltaTime) {
		this.timeSinceLastFrame += deltaTime;
		if (this.timeSinceLastFrame > this.frameInterval) {
			this.frame++;
			this.timeSinceLastFrame = 0;
		}
		if (this.frame == 0) {
			this.sound.play();
		}
		if (this.frame > 5) {
			this.markedForDeletion = true;
		}
	}
	draw() {
		ctx.drawImage(
			this.image,
			this.spriteWidth * this.frame,
			0,
			this.spriteWidth,
			this.spriteWidth,
			this.x,
			this.y - this.size / 4,
			this.size,
			this.size,
		);
	}
}

let ravens = [];

class Raven {
	constructor() {
		this.spriteWidth = 271;
		this.spriteHeight = 194;
		this.sizeModifier = Math.random() * 0.6 + 0.4;
		this.width = this.spriteWidth * this.sizeModifier;
		this.height = this.spriteHeight * this.sizeModifier;
		this.x = CANVAS_WIDTH;
		this.y = Math.random() * (CANVAS_HEIGHT - this.height);
		this.directionX = Math.random() * 5 + 3;
		this.directionY = Math.random() * 5 - 2.5;
		this.markedForDeletion = false;
		this.image = new Image();
		this.image.src = "raven.png";
		this.frame = 0;
		this.maxFrame = 4;
		this.timeSinceFlap = 0;
		this.flapInterval = Math.random() * 50 + 50;
		this.randomColors = [
			Math.floor(Math.random() * 255),
			Math.floor(Math.random() * 255),
			Math.floor(Math.random() * 255),
		];
		this.color = `rgb(${this.randomColors[0]},${this.randomColors[1]},${this.randomColors[2]} )`;
		this.hasTrail = Math.random() > 0.5;
	}
	update(deltaTime) {
		this.x -= this.directionX;
		this.y -= this.directionY;
		if (this.y < 0 || this.y > CANVAS_HEIGHT - this.height) {
			this.directionY *= -1;
		}
		if (this.x < 0 - this.width) {
			this.markedForDeletion = true;
			gameOver = true;
		}
		this.timeSinceFlap += deltaTime;
		if (this.timeSinceFlap > this.flapInterval) {
			if (this.frame > this.maxFrame) {
				this.frame = 0;
			} else {
				this.frame++;
			}
			this.timeSinceFlap = 0;
			if (this.hasTrail) {
				for (let i = 0; i < 5; i++) {
					particles.push(
						new Particle(this.x, this.y, this.width, this.color),
					);
				}
			}
		}
	}
	draw() {
		collisionCtx.fillStyle = this.color;
		collisionCtx.fillRect(this.x, this.y, this.width, this.height);
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

let particles = [];
class Particle {
	constructor(x, y, size, color) {
		this.size = size;
		this.x = x + this.size / 2;
		this.y = y + this.size / 3;
		this.radius = (Math.random() * this.size) / 10;
		this.maxRadius = Math.random() * 20 + 35;
		this.speedX = Math.random() * 1 + 0.5;
		this.color = color;
		this.markedForDeletion = false;
	}
	update() {
		this.x += this.speedX;
		this.radius += 0.3;
		if (this.radius > this.maxRadius - 5) {
			this.markedForDeletion = true;
		}
	}
	draw() {
		ctx.save();
		ctx.globalAlpha = 1 - this.radius / this.maxRadius;
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}
}

function drawScore() {
	ctx.fillStyle = "black";
	ctx.fillText(`Score: ${score}`, 50, 75);
	ctx.fillStyle = "white";
	ctx.fillText(`Score: ${score}`, 55, 80);
}

function drawGameOver() {
	ctx.textAlign = "center";
	ctx.fillStyle = "black";
	ctx.fillText(
		`GAME OVER, your score is: ${score}`,
		CANVAS_WIDTH / 2,
		CANVAS_HEIGHT / 2,
	);
	ctx.textAlign = "center";
	ctx.fillStyle = "white";
	ctx.fillText(
		`GAME OVER, your score is: ${score}`,
		CANVAS_WIDTH / 2 + 5,
		CANVAS_HEIGHT / 2 + 5,
	);
}

window.addEventListener("click", (e) => {
	const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
	const pc = detectPixelColor.data;
	ravens.forEach((object) => {
		if (
			object.randomColors[0] == pc[0] &&
			object.randomColors[1] == pc[1] &&
			object.randomColors[2] == pc[2]
		) {
			object.markedForDeletion = true;
			explosions.push(new Explosion(object.x, object.y, object.width));
			score++;
		}
	});
});

function animate(timestamp) {
	ctx.clearRect(2, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	collisionCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	let deltaTime = timestamp - lastTime;
	lastTime = timestamp;
	timeToNextRave += deltaTime;
	if (timeToNextRave > ravenInterval) {
		ravens.push(new Raven());
		timeToNextRave = 0;
		ravens.sort((a, b) => {
			return a.width - b.width;
		});
	}
	drawScore();
	[...particles, ...ravens, ...explosions].forEach((object) =>
		object.update(deltaTime),
	);
	[...particles, ...ravens, ...explosions].forEach((object) => object.draw());
	ravens = ravens.filter((object) => !object.markedForDeletion);
	explosions = explosions.filter((object) => !object.markedForDeletion);
	if (!gameOver) {
		requestAnimationFrame(animate);
	} else {
		drawGameOver();
	}
}
animate(0);
