export function drawStatusText(context, { lastKey }, { currentState }) {
	context.font = "28px Helvetica";
	context.fillText(`Last input: ${lastKey}`, 20, 50);
	context.fillText(`Active State: ${currentState.state}`, 20, 90);
}
