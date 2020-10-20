window.onload = function () 
{
    //获取canvas元素
    var canvas = document.getElementById('canvas');
    //获取绘制二维上下文
    var gl = canvas.getContext('webgl');//返回一个API对象

    //编译着色器(初始化)
	var shaderProgram=init(gl);
    //获取坐标点
    var a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
    if (a_Position < 0) 
	{
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    var n = initBuffers(gl,shaderProgram);//画出国旗

    // 清除指定<画布>的颜色
    gl.clearColor(0.0, 1.0, 0.0, 1.0);
    // 清空 <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
	//
	
	var shaderProgram=init_star(gl);
	//获取坐标点
	var a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
	if (a_Position < 0) 
	{
	    console.log('Failed to get the storage location of a_Position');
	    return;
	}
	var n = star1(gl,shaderProgram);//画出国旗
	gl.drawArrays(gl.LINE_LOOP, 0, n);
	//
	var n = star2(gl,shaderProgram);//画出国旗
	gl.drawArrays(gl.LINE_LOOP, 0, n);
	//
	
	var n = star3(gl,shaderProgram);//画出国旗
	gl.drawArrays(gl.LINE_LOOP, 0, n);
	//
	
	var n = star4(gl,shaderProgram);//画出国旗
	gl.drawArrays(gl.LINE_LOOP, 0, n);
	//
	var n = star5(gl,shaderProgram);//画出国旗
	gl.drawArrays(gl.LINE_LOOP, 0, n);
}
function init(gl)
{
	//顶点着色器程序
	var VSHADER_SOURCE =
	    "attribute vec4 a_Position;" +
	    "void main() {" +
	        //设置坐标
	    "gl_Position = a_Position; " +
	    "} ";
	//片元着色器
	var FSHADER_SOURCE =
	    "void main() {" +
	        //设置颜色
	    "gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);" +
	    "}";
	//获取canvas元素
	//创建顶点着色器对象，
	var vertShader = gl.createShader(gl.VERTEX_SHADER);
	//引入顶点
	gl.shaderSource(vertShader, VSHADER_SOURCE);
	gl.compileShader(vertShader);
	//创建片元着色器对象，
	var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
	//引入顶点
	gl.shaderSource(fragShader, FSHADER_SOURCE);
	gl.compileShader(fragShader);
	//创建程序对象shaderProgram
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertShader);
	gl.attachShader(shaderProgram, fragShader);
	//链接shaderProgram
	gl.linkProgram(shaderProgram);
	//使用shaderProgram
	gl.useProgram(shaderProgram);
	//以上是初始化着色器
	return shaderProgram;
}
function initBuffers(gl,shaderProgram) //国旗背景
{
    var vertices = new Float32Array([
        -0.6, 0.6, 
		-0.6,-0.6, 
		0.6, -0.6,
		
		-0.6, 0.6,
		0.6, -0.6,
		0.6,0.6,
    ]);
    var n = 6;//点的个数
    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer)
	{
        console.log("Failed to create the butter object");
        return -1;
    }
    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    //向缓冲区写入数据
	//gl.ARRAY_BUFFER表示目标；vertices表示写入缓存区对象的数据（类型化数组）
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
	//gl.STATIC_DRAW：表示只会向缓存区对象写入一次数据，但需要绘制很多次；
	//gl.STREAM_DRAW：表示只会向缓存区对象写入一次数据，然后绘制若干次；
	//gl.DYNAMIC_DRAW：表示会向缓存区对象多次写入数据，并绘制很多次；
    //获取坐标点
    var a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);
    return n;
}

function init_star(gl)
{
	//顶点着色器程序
	var VSHADER_SOURCE =
	    "attribute vec4 a_Position;" +
	    "void main() {" +
	        //设置坐标
	    "gl_Position = a_Position; " +
	    "} ";
	//片元着色器
	var FSHADER_SOURCE =
	    "void main() {" +
	        //设置颜色
	    "gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);" +
	    "}";
	//获取canvas元素
	//创建顶点着色器对象，
	var vertShader = gl.createShader(gl.VERTEX_SHADER);
	//引入顶点
	gl.shaderSource(vertShader, VSHADER_SOURCE);
	gl.compileShader(vertShader);
	//创建片元着色器对象，
	var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
	//引入顶点
	gl.shaderSource(fragShader, FSHADER_SOURCE);
	gl.compileShader(fragShader);
	//创建程序对象shaderProgram
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertShader);
	gl.attachShader(shaderProgram, fragShader);
	//链接shaderProgram
	gl.linkProgram(shaderProgram);
	//使用shaderProgram
	gl.useProgram(shaderProgram);
	//以上是初始化着色器
	return shaderProgram;
}
function star1(gl,shaderProgram) //国旗背景
{
    var vertices = new Float32Array([
        -0.5, 0.4, 
        -0.4,0.4, 
        -0.35, 0.5,
        -0.3,0.4,
        -0.2,0.4,
        		
        -0.28,0.3,
        -0.24,0.2,
        -0.35,0.25,
        -0.45,0.2,
        -0.43,0.3,
    ]);
    var n = 10;//点的个数
    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer)
	{
        console.log("Failed to create the butter object");
        return -1;
    }
    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    //向缓冲区写入数据
	//gl.ARRAY_BUFFER表示目标；vertices表示写入缓存区对象的数据（类型化数组）
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
	//gl.STATIC_DRAW：表示只会向缓存区对象写入一次数据，但需要绘制很多次；
	//gl.STREAM_DRAW：表示只会向缓存区对象写入一次数据，然后绘制若干次；
	//gl.DYNAMIC_DRAW：表示会向缓存区对象多次写入数据，并绘制很多次；
    //获取坐标点
    var a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);
    return n;
}
function star2(gl,shaderProgram) //国旗背景
{
    var vertices = new Float32Array([
        -0.1, 0.28,
        -0.08,0.28, 
        -0.07, 0.3,
        -0.06,0.28,
        -0.04,0.28,
        		
        -0.056,0.26,
        -0.048,0.24,
        -0.07,0.25,
        -0.09,0.24,
        -0.086,0.26,
    ]);
    var n = 10;//点的个数
    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer)
	{
        console.log("Failed to create the butter object");
        return -1;
    }
    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    //向缓冲区写入数据
	//gl.ARRAY_BUFFER表示目标；vertices表示写入缓存区对象的数据（类型化数组）
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
	//gl.STATIC_DRAW：表示只会向缓存区对象写入一次数据，但需要绘制很多次；
	//gl.STREAM_DRAW：表示只会向缓存区对象写入一次数据，然后绘制若干次；
	//gl.DYNAMIC_DRAW：表示会向缓存区对象多次写入数据，并绘制很多次；
    //获取坐标点
    var a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);
    return n;
}
function star3(gl,shaderProgram) //国旗背景
{
    var vertices = new Float32Array([
        -0.1, 0.48,
        -0.08,0.48, 
        -0.07, 0.5,
        -0.06,0.48,
        -0.04,0.48,
                		
        -0.056,0.46,
        -0.048,0.44,
        -0.07,0.45,
        -0.09,0.44,
        -0.086,0.46,
    ]);
    var n = 10;//点的个数
    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer)
	{
        console.log("Failed to create the butter object");
        return -1;
    }
    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    //向缓冲区写入数据
	//gl.ARRAY_BUFFER表示目标；vertices表示写入缓存区对象的数据（类型化数组）
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
	//gl.STATIC_DRAW：表示只会向缓存区对象写入一次数据，但需要绘制很多次；
	//gl.STREAM_DRAW：表示只会向缓存区对象写入一次数据，然后绘制若干次；
	//gl.DYNAMIC_DRAW：表示会向缓存区对象多次写入数据，并绘制很多次；
    //获取坐标点
    var a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);
    return n;
}
function star4(gl,shaderProgram) //国旗背景
{
    var vertices = new Float32Array([
        -0.2, 0.08,
        -0.18,0.08, 
        -0.17, 0.1,
        -0.16,0.08,
        -0.14,0.08,
                		
        -0.156,0.06,
        -0.148,0.04,
        -0.17,0.05,
        -0.19,0.04,
        -0.186,0.06,
    ]);
    var n = 10;//点的个数
    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer)
	{
        console.log("Failed to create the butter object");
        return -1;
    }
    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    //向缓冲区写入数据
	//gl.ARRAY_BUFFER表示目标；vertices表示写入缓存区对象的数据（类型化数组）
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
	//gl.STATIC_DRAW：表示只会向缓存区对象写入一次数据，但需要绘制很多次；
	//gl.STREAM_DRAW：表示只会向缓存区对象写入一次数据，然后绘制若干次；
	//gl.DYNAMIC_DRAW：表示会向缓存区对象多次写入数据，并绘制很多次；
    //获取坐标点
    var a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);
    return n;
}
function star5(gl,shaderProgram) //国旗背景
{
    var vertices = new Float32Array([
        -0.4, 0.08,
        -0.38,0.08, 
        -0.37, 0.1,
        -0.36,0.08,
        -0.34,0.08,
                		
        -0.356,0.06,
        -0.348,0.04,
        -0.37,0.05,
        -0.39,0.04,
        -0.386,0.06,
    ]);
    var n = 10;//点的个数
    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer)
	{
        console.log("Failed to create the butter object");
        return -1;
    }
    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    //向缓冲区写入数据
	//gl.ARRAY_BUFFER表示目标；vertices表示写入缓存区对象的数据（类型化数组）
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
	//gl.STATIC_DRAW：表示只会向缓存区对象写入一次数据，但需要绘制很多次；
	//gl.STREAM_DRAW：表示只会向缓存区对象写入一次数据，然后绘制若干次；
	//gl.DYNAMIC_DRAW：表示会向缓存区对象多次写入数据，并绘制很多次；
    //获取坐标点
    var a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);
    return n;
}
/*
-0.1, 0.08,
-0.08,0.08, 
-0.07, 0.1,
-0.06,0.08,
-0.04,0.08,
        		
-0.056,0.06,
-0.048,0.04,
-0.07,0.05,
-0.09,0.04,
-0.086,0.06,
*/