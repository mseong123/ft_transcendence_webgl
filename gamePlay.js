function render() {
	document.global.rotation[0] += 0.1;
	document.drawArena();
	
	document.drawBall();
	// requestAnimationFrame(render);
}

requestAnimationFrame(render);