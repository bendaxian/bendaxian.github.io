window.onload = function () 
{
    var VSHADER_SOURCE =
        "attribute vec4 a_Position;" +
        "void main() {" +
        "gl_Position = a_Position; " +
        "} ";
    //片元着色器
    var FSHADER_SOURCE =
        "void main() {" +
            //设置三角形颜色
        "gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);" +
        "}";
    var canvas = document.getElementById('canvas');
    //获取绘制二维上下文
    var gl = canvas.getContext('webgl');
    if (!gl) 
	{
        console.log("Failed");
        return;
    }
    //编译着色器
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, VSHADER_SOURCE);
    gl.compileShader(vertShader);

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, FSHADER_SOURCE);
    gl.compileShader(fragShader);
    //合并程序
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    //获取坐标点
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
    // 清除指定画布的颜色
    gl.clearColor(1.0, 1.0, 1.0,0.0);
    // 清空 <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);     
}
function initBuffers(gl,shaderProgram) 
{
    var vertices = new Float32Array([
         -0.5, 0.5,
		 -0.5, -0.5, 
		 0.5, 0.5,
		 0.5, -0.5
    ]);
    var n = 4;                                            //点的个数
    //创建缓冲区对象
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