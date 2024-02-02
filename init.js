function init() {
	const canvas = document.querySelector("#canvas");
	canvas.style.height = (canvas.clientWidth * 3 / 4) + 'px';
	let global = {
		arenaWidth:250,
		arenaHeight:160,
		arenaDepth:-600,
		arenaDepthOffset:-200,
		rotation:[0,0],
		gl:canvas.getContext("webgl"),
	
	}
	document.global = global;
}

init();