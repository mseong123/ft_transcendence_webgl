function createShader(gl, type, source) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) {
	  return shader;
	}
   
	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
  }

  function resizeCanvasToDisplaySize(canvas) {
	// Lookup the size the browser is displaying the canvas in CSS pixels.
	const displayWidth  = canvas.clientWidth;
	const displayHeight = canvas.clientHeight;
   
	// Check if the canvas is not the same size.
	const needResize = canvas.width  !== displayWidth ||
					   canvas.height !== displayHeight;
   
	if (needResize) {
	  // Make the canvas the same size
	  canvas.width  = displayWidth;
	  canvas.height = displayHeight;
	}
   
	return needResize;
  }

  function createProgram(gl, vertexShader, fragmentShader) {
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	var success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) {
	  	return program;
	}
   
	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
  }

  function main() {
	var image = new Image();
	image.src = "./leaves.jpg";
	image.onload = function() {
	  render(image);
	};
  }


function render(image) {
	var canvas = document.querySelector("#c");
	var gl = canvas.getContext("webgl");
	if (!gl) {
		console.log("does not support webgl");
		return;
	}
	var vertexShaderSource = document.querySelector("#vertex").text;
	var fragmentShaderSource = document.querySelector("#fragment").text;
	var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
	
	var program = createProgram(gl, vertexShader, fragmentShader);
	//above is initialization stage. Compiling shader and linking program 99% of time is the same and can be refactored into function and reused.
	resizeCanvasToDisplaySize(gl.canvas);
	gl.viewport(0,0,canvas.width, canvas.height);
	gl.useProgram(program);
	var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
	var rotationLocation = gl.getUniformLocation(program, "u_rotation");
	
	
	var positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	var positions = [
		0, 0,
		0.7, 0,
		0, 0.7,
		0,0.7,
		0.7,0,
		0.7,0.7,
	  ];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	
	//turn attribute on
	gl.enableVertexAttribArray(positionAttributeLocation);

	var size = 2;          // 2 components per iteration
	var type = gl.FLOAT;   // the data is 32bit floats
	var normalize = false; // don't normalize the data
	var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0;        // start at the beginning of the buffer
	//above is specify how to pull data out from buffer. gl.ARRAY_BUFFER already got data. once below is execute, gl.ARRAY_BUFFER is bound to attribute(means positionBuffer is bound to attribute)
	//and gl.ARRAY_BUFFER is freed up.
	gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

	//The below buffer set coordinates for the texture u_image which is binded below.
	var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
	var texCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	//if i don't set below texture coordinates exactly the same vertices as above position, pixels won't interpolate and match and will throw funny values.
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0.0,  0.0,
		1.0,  0.0,
		0.0,  1.0,
		0.0,  1.0,
		1.0,  0.0,
		1.0,  1.0]), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(texCoordLocation);
	gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
	var rotation = [Math.sin(0.524), Math.cos(0.524)];
	gl.uniform2fv(rotationLocation, rotation);

	var texture = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, texture);
  //this automatically binds to sample uniform reference u_image in fragment shader, texture unit 0 is the default. 
 
  // Set the parameters so we can render any size image. HAVEN'T STUDY YET.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 
  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	

	var primitiveType = gl.TRIANGLES;
	var offset = 0;
	var count = 6;
	gl.drawArrays(primitiveType, offset, count);

	


}

main();