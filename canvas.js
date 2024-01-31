function main() {
	const canvas = document.querySelector("#canvas");
	const gl = canvas.getContext("webgl");
	if (!gl) {
		console.log("WebGL not supported in browser.")
		return;
	}
	document.utilities.createProgramFromScripts(gl, ['arena-vertex','arena-fragment']);
}
main();