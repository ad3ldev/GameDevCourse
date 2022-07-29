const canvas = document.querySelector("#canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 600);
const CANVAS_HEIGHT = (canvas.height = 600);

const playerImage = new Image();
playerImage.src = "shadow_dog.png";

function animate() {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	ctx.fillRect(50, 50, 100, 100);
	requestAnimationFrame(animate);
}
animate();
