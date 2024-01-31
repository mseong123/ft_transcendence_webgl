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
  console.log("shaderScript",shaderScript);
  if (!shaderScript) {
	throw('*** Error: unknown script element ' + scriptId);
  }
  shaderSource = shaderScript.text;
  console.log("shaderSource",shaderSource);
  

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

document.utilities = {createProgramFromScripts};