import {utilities} from "./utilities.js";
import {m4} from "./matrix.js";




function initArrayBuffers(gl){
      var SPHERE_DIV = 8;
	  var SCALE = 0.04; // new :p
      var i, ai, si, ci;
      var j, aj, sj, cj;
      var p1, p2;
      var vertices = [],indices = [];
      for (j = 0; j <= SPHERE_DIV; j++) 
      {
        aj = j * Math.PI / SPHERE_DIV;
        sj = Math.sin(aj);
        cj = Math.cos(aj);
        for (i = 0; i <= SPHERE_DIV; i++) 
        {
          ai = i * 2 * Math.PI / SPHERE_DIV;
          si = Math.sin(ai);
          ci = Math.cos(ai);
          vertices.push((si * sj) * SCALE);  // X
          vertices.push(cj * SCALE);       // Y
          vertices.push((ci * sj) * SCALE);  // Z
		  
        }
		
      }

      for (j = 0; j < SPHERE_DIV; j++)
      {
        for (i = 0; i < SPHERE_DIV; i++)
        {
          p1 = j * (SPHERE_DIV+1) + i;
          p2 = p1 + (SPHERE_DIV+1);
          indices.push(p1);
          indices.push(p2);
          indices.push(p1 + 1);
          indices.push(p1 + 1);
          indices.push(p2);
          indices.push(p2 + 1);
        }
      }
	  
      var vertexBuffer = gl.createBuffer();
      if (!vertexBuffer) 
      {
        console.log('Failed to create the buffer object');
        return -1;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); 
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW); 
      var indexBuffer = gl.createBuffer(); 
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer); 
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	  
      return indices.length;
}

function main() {
	const gl = document.global.gl;
	if (!gl) {
		console.log("WebGL not supported in browser.")
		return;
	}
	let program = utilities.createProgramFromScripts(gl, ['ball-vertex','ball-fragment']);
	var positionLocation = gl.getAttribLocation(program, "a_position");
	var matrixLocation = gl.getUniformLocation(program, "u_matrix");
	// var matrixLocation = gl.getUniformLocation(program, "u_matrix");
	// var positionBuffer = gl.createBuffer();
	// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
	// gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	// Put geometry data into buffer
	// setGeometry(gl);
	// window.requestAnimationFrame(drawArena);
	
	
	
	
	function drawBall() {
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
		gl.enableVertexAttribArray( positionLocation );
		// Turn on the position attribute
		var sphere=createSphereVertices(100, 6,6);
		console.log("texcoord", sphere.texcoord);
		console.log("position", sphere.position);
		console.log("normal", sphere.normal);
		console.log("indices", sphere.indices);
		var vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); 
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphere.position), gl.STATIC_DRAW); 
		var indexBuffer = gl.createBuffer(); 
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer); 
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphere.indices), gl.STATIC_DRAW);
		gl.vertexAttribPointer( positionLocation, 3, gl.FLOAT, false, 0, 0 );
    
	var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		var zNear = 1;
		var zFar = 2000;
		var fieldOfViewRadians = utilities.degToRad(60);
		
		
		var matrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
		
		// matrix = m4.translate(matrix, mapToClipSpace(-125), 0, mapToClipSpace(80));
		
		// matrix = m4.yRotate(matrix, utilities.degToRad(document.global.rotation[0]));
		
		// matrix = m4.translate(matrix, 0, 0, -(document.global.arenaDepthOffset + document.global.arenaDepth)/2);
	
	gl.uniformMatrix4fv(matrixLocation, false, matrix);
		
    gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0);
	}

	document.drawBall = drawBall;
}

function setGeometry(gl) {
	let x = document.global.arenaWidth/2/2;
	let y = document.global.arenaHeight/2/2;
	let zNear = document.global.arenaDepthOffset/2;
	let zFar = document.global.arenaDepth + document.global.arenaDepthOffset/2;
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

function createSphereVertices(
	radius,
	subdivisionsAxis,
	subdivisionsHeight,
	opt_startLatitudeInRadians,
	opt_endLatitudeInRadians,
	opt_startLongitudeInRadians,
	opt_endLongitudeInRadians) {
  if (subdivisionsAxis <= 0 || subdivisionsHeight <= 0) {
	throw Error('subdivisionAxis and subdivisionHeight must be > 0');
  }

  opt_startLatitudeInRadians = opt_startLatitudeInRadians || 0;
  opt_endLatitudeInRadians = opt_endLatitudeInRadians || Math.PI;
  opt_startLongitudeInRadians = opt_startLongitudeInRadians || 0;
  opt_endLongitudeInRadians = opt_endLongitudeInRadians || (Math.PI * 2);

  const latRange = opt_endLatitudeInRadians - opt_startLatitudeInRadians;
  const longRange = opt_endLongitudeInRadians - opt_startLongitudeInRadians;

  // We are going to generate our sphere by iterating through its
  // spherical coordinates and generating 2 triangles for each quad on a
  // ring of the sphere.
  const numVertices = (subdivisionsAxis + 1) * (subdivisionsHeight + 1);
  const positions = createAugmentedTypedArray(3, numVertices);
  const normals   = createAugmentedTypedArray(3, numVertices);
  const texCoords = createAugmentedTypedArray(2 , numVertices);

  // Generate the individual vertices in our vertex buffer.
  for (let y = 0; y <= subdivisionsHeight; y++) {
	for (let x = 0; x <= subdivisionsAxis; x++) {
	  // Generate a vertex based on its spherical coordinates
	  const u = x / subdivisionsAxis;
	  const v = y / subdivisionsHeight;
	  const theta = longRange * u + opt_startLongitudeInRadians;
	  const phi = latRange * v + opt_startLatitudeInRadians;
	  const sinTheta = Math.sin(theta);
	  const cosTheta = Math.cos(theta);
	  const sinPhi = Math.sin(phi);
	  const cosPhi = Math.cos(phi);
	  const ux = cosTheta * sinPhi;
	  const uy = cosPhi;
	  const uz = sinTheta * sinPhi;
	  positions.push(radius * ux, radius * uy, radius * uz);
	  normals.push(ux, uy, uz);
	  texCoords.push(1 - u, v);
	}
  }

  const numVertsAround = subdivisionsAxis + 1;
  const indices = createAugmentedTypedArray(3, subdivisionsAxis * subdivisionsHeight * 2, Uint16Array);
  for (let x = 0; x < subdivisionsAxis; x++) {
	for (let y = 0; y < subdivisionsHeight; y++) {
	  // Make triangle 1 of quad.
	  indices.push(
		  (y + 0) * numVertsAround + x,
		  (y + 0) * numVertsAround + x + 1,
		  (y + 1) * numVertsAround + x);

	  // Make triangle 2 of quad.
	  indices.push(
		  (y + 1) * numVertsAround + x,
		  (y + 0) * numVertsAround + x + 1,
		  (y + 1) * numVertsAround + x + 1);
	}
  }

  return {
	position: positions,
	normal: normals,
	texcoord: texCoords,
	indices: indices,
  };
}

function createAugmentedTypedArray(numComponents, numElements, opt_type) {
    const Type = opt_type || Float32Array;
    return augmentTypedArray(new Type(numComponents * numElements), numComponents);
  }

  function augmentTypedArray(typedArray, numComponents) {
    let cursor = 0;
    typedArray.push = function() {
      for (let ii = 0; ii < arguments.length; ++ii) {
        const value = arguments[ii];
        if (value instanceof Array || (value.buffer && value.buffer instanceof ArrayBuffer)) {
          for (let jj = 0; jj < value.length; ++jj) {
            typedArray[cursor++] = value[jj];
          }
        } else {
          typedArray[cursor++] = value;
        }
      }
    };
    typedArray.reset = function(opt_index) {
      cursor = opt_index || 0;
    };
    typedArray.numComponents = numComponents;
    Object.defineProperty(typedArray, 'numElements', {
      get: function() {
        return this.length / this.numComponents | 0;
      },
    });
    return typedArray;
  }

main();
