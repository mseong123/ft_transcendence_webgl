function loadShader(gl, shaderSource, shaderType) {
    // Create the shader object
    const shader = gl.createShader(shaderType);

    // Load the shader source
    gl.shaderSource(shader, shaderSource);

    // Compile the shader
    gl.compileShader(shader);

    // Check the compile status
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      // Something went wrong during compilation; get the error
      const lastError = gl.getShaderInfoLog(shader);
      console.log('*** Error compiling shader \'' + shader + '\':' + lastError + `\n` + shaderSource.split('\n').map((l,i) => `${i + 1}: ${l}`).join('\n'));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }


function createShaderFromScript(gl, scriptId) {
	let shaderSource = '';
	let shaderType;
	let shaderScript = document.getElementById(scriptId);
	
	if (!shaderScript) {
		throw('*** Error: unknown script element ' + scriptId);
	}
	shaderSource = shaderScript.text;

	if (shaderScript.type === 'vertex') {
		shaderType = gl.VERTEX_SHADER;
	} else if (shaderScript.type === 'fragment') {
		shaderType = gl.FRAGMENT_SHADER;
	} else if (shaderType !== gl.VERTEX_SHADER && shaderType !== gl.FRAGMENT_SHADER) {
		throw ('*** Error: unknown shader type');
	}

	return loadShader(gl, shaderSource, shaderType);
}


function createProgramFromScripts(gl, shaderScriptIds) {
  let shaders = [];
  for (let ii = 0; ii < shaderScriptIds.length; ++ii) {
	shaders.push(createShaderFromScript(
		gl, shaderScriptIds[ii]));
  }
  return createProgram(gl, shaders);
}

function createProgram(gl, shaders) {
  let program = gl.createProgram();
  shaders.forEach(function(shader) {
	gl.attachShader(program, shader);
  });
 
  gl.linkProgram(program);

  // Check the link status
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
	  // something went wrong with the link
	  const lastError = gl.getProgramInfoLog(program);
	  console.log('Error in program linking:' + lastError);

	  gl.deleteProgram(program);
	  return null;
  }
  return program;
}

function resizeCanvasToDisplaySize(canvas, multiplier) {
    multiplier = multiplier || 1;
    const width  = canvas.clientWidth  * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width ||  canvas.height !== height) {
      canvas.width  = width;
      canvas.height = height;
      return true;
    }
    return false;
}

function resizeCanvas(canvas) {
	console.log(canvas.clientHeight);
    canvas.style.height = (canvas.clientWidth * 3 / 4) + 'px';
	console.log(canvas.clientWidth);
	console.log(canvas.clientHeight);


}

function radToDeg(r) {
    return r * 180 / Math.PI;
  }

  function degToRad(d) {
    return d * Math.PI / 180;
  }

export const utilities = {createProgramFromScripts, 
							resizeCanvasToDisplaySize,
							
							radToDeg,
							degToRad
						};