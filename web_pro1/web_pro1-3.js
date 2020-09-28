window.onload = function () 
{
    var VSHADER_SOURCE =
        "attribute vec4 a_Position;" +
        "void main() {" +

        "gl_Position = a_Position; " +
        "} ";

    var FSHADER_SOURCE =
        "void main() {" +

        "gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);" +    
		/*"if(gl_FragCoord.x < 200.0){"+
			"gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);"+
			"}else{"+
				"gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);"+
		"}"+*/
        "}";
    var canvas = document.getElementById('canvas');

    var gl = canvas.getContext('webgl');
    if (!gl) 
	{
        console.log("Failed");
        return;
    }

    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, VSHADER_SOURCE);
    gl.compileShader(vertShader);
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, FSHADER_SOURCE);
    gl.compileShader(fragShader);
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    var a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');

    if (a_Position < 0) 
	{
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    var n = initBuffers(gl,shaderProgram);
    if(n<0)
	{
        console.log('Failed to set the positions');
        return;
    }
    gl.clearColor(1.0, 1.0, 0.0,0.1);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 9);             

}
function initBuffers(gl,shaderProgram) 
{
    var vertices = new Float32Array([
         -0.5, 1.0,
		 -1.0, -0.0, 
		 -0.0, -0.0,
		 
		 0.0,0.0,
		 0.0,-1.0,
		 1.0,0.0,
		 
		 1.0,-0.0,
		 0.0,-1.0,
		 1.0,-1.0
    ]);
	var n=9;              
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer)
	{
        console.log("Failed to create the butter object");
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    return n;

}