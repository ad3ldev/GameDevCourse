import Player from "./player.js";
import InputHandler from "./input.js";
import { drawStatusText } from "./utils.js";
window.addEventListener("load", () => {
	loading.style.display = "none";
	const canvas = canvas1;
	const ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	const player = new Player(canvas.width, canvas.height);
	const input = new InputHandler();

	let lastTime = 0;
	function animate(timestamp) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		const deltaTime = timestamp - lastTime;
		lastTime = timestamp;
		player.update(input.lastKey);
		player.draw(ctx, deltaTime);
		drawStatusText(ctx, input, player);
		requestAnimationFrame(animate);
	}
	animate(0);
});