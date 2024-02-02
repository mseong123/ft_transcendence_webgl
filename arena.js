import {utilities} from "./utilities.js";
import {m4} from "./matrix.js";

function main() {
	const gl = document.global.gl;
	if (!gl) {
		console.log("WebGL not supported in browser.")
		return;
	}
	let program = utilities.createProgramFromScripts(gl, ['arena-vertex','arena-fragment']);
	var positionLocation = gl.getAttribLocation(program, "a_position");
	var matrixLocation = gl.getUniformLocation(program, "u_matrix");
	var positionBuffer = gl.createBuffer();
	
	// Put geometry data into buffer
	
	// window.requestAnimationFrame(drawArena);
	
	
	function drawArena() {
		utilities.resizeCanvasToDisplaySize(gl.canvas);
	
		// Tell WebGL how to convert from clip space to pixels
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	
		// Clear the canvas AND the depth buffer.
		// gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
		// Turn on culling. By default backfacing triangles
		// will be culled.
		gl.enable(gl.CULL_FACE);
	
		// Enable the depth buffer
		gl.enable(gl.DEPTH_TEST);
	
		// Tell it to use our program (pair of shaders)
		gl.useProgram(program);
	
		// Turn on the position attribute
		gl.enableVertexAttribArray(positionLocation);
	
		// Bind the position buffer.
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		setGeometry(gl);
	
		// Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
		var size = 3;          // 3 components per iteration
		var type = gl.FLOAT;   // the data is 32bit floats
		var normalize = false; // don't normalize the data
		var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0;        // start at the beginning of the buffer
		gl.vertexAttribPointer(
			positionLocation, size, type, normalize, stride, offset);
			
		//Compute the matrix
		var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		var zNear = 1;
		var zFar = 2000;
		var fieldOfViewRadians = utilities.degToRad(60);
		
		var radius = 50;
		var matrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
		
    	matrix = m4.translate(matrix, 0, 0, (document.global.arenaDepthOffset + document.global.arenaDepth)/2);
		
		matrix = m4.yRotate(matrix, utilities.degToRad(document.global.rotation[0]));
		
		matrix = m4.translate(matrix, 0, 0, -(document.global.arenaDepthOffset + document.global.arenaDepth)/2);
		
		// Set the matrix.
		gl.uniformMatrix4fv(matrixLocation, false, matrix);
	
		// Draw the geometry.
		var primitiveType = gl.LINE_STRIP;
		var offset = 0;
		var count = 24;
		gl.drawArrays(primitiveType, offset, count);
		// rotation[0] += 0.1;
		// requestAnimationFrame(drawArena);
	}
	document.drawArena = drawArena;
}

function setGeometry(gl) {
	let x = document.global.arenaWidth/2;
	let y = document.global.arenaHeight/2;
	let zNear = document.global.arenaDepthOffset;
	let zFar = document.global.arenaDepth + document.global.arenaDepthOffset;
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
			-x, y, zNear,
			x, y, zNear,
			x, y, zNear,
			x,-y, zNear,
			x,-y, zNear,
			-x,-y, zNear,
			-x,-y, zNear,
			-x,y,zNear,

			-x,y,zNear,
			-x,y,zFar,
			-x,y,zFar,
			-x,-y,zFar,
			-x,-y,zFar,
			-x,-y,zNear,

			-x,-y,zFar,
			x,-y,zFar,
			x,-y,zFar,
			x,y,zFar,
			x,y,zFar,
			-x,y,zFar,

			x,y,zFar,
			x,y,zNear,
			x,-y,zNear,
			x,-y,zFar,
			
		]),
		gl.STATIC_DRAW);
  }
main();
