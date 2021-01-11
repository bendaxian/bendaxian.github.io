var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Normal;\n' +//法向量
    'uniform mat4 u_MvpMatrix;\n' +
    'uniform mat4 u_NormalMatrix;\n' +//用来变换法向量的矩阵
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
    //计算光照
    '  vec3 lightDirection = normalize(vec3(0.0, 0.5, 0.7));\n' + //归一化的世界坐标
    '  vec4 color = vec4(1.0, 0.4, 0.0, 1.0);\n' + 
    //对法向量归一化
    '  vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);\n' +
   //计算光线方向和法向量的点积
    '  float nDotL = max(dot(normal, lightDirection), 0.0);\n' +
    //计算漫反射光的颜色
    '  v_Color = vec4(color.rgb * nDotL + vec3(0.1), color.a);\n' +
    '}\n';
var FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';
function main() 
{
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!gl) 
    {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) 
    {
        alert("着色器初始化失败")
        return;
    }
    var n = initVertexBuffers(gl);//设置顶点的坐标，颜色和法向量
    if (n < 0) 
    {
        alert('建立缓存对象失败');
        return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    //获取地址
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
   var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    if (a_Position < 0 || !u_MvpMatrix || !u_NormalMatrix) 
    {
        console.log('Failed to get the storage location of attribute or uniform variable');
		return;
	}
    // 计算视图投影矩阵
    var viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0);
    viewProjMatrix.lookAt(20.0, 10.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

	//注册要在按下键时调用的事件处理程序
	document.onkeydown = function(ev){ keydown(ev, gl, n, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix); };
	draw(gl, n, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
}

var ANGLE_STEP = 3.0; //每次按键转动的角度 
//各个部件当前的角度
var g_arm1Angle = 90.0; 
var g_joint1Angle = 45.0; 
var g_joint2Angle = 0.0;  
var g_joint3Angle = 0.0;

function keydown(ev, gl, o, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix) 
{
    switch (ev.keyCode) 
    {
		case 40: // Up arrow key
			if (g_joint1Angle < 135.0) g_joint1Angle += ANGLE_STEP;
			break;
		case 38: // Down arrow key
			if (g_joint1Angle > -135.0) g_joint1Angle -= ANGLE_STEP;
			break;
		case 39: // Right arrow key
			g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
			break;
		case 37: // Left arrow key
			g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
			break;
		case 90: // 'ｚ'key
			g_joint2Angle = (g_joint2Angle + ANGLE_STEP) % 360;
			break; 
		case 88: // 'x'key
			g_joint2Angle = (g_joint2Angle - ANGLE_STEP) % 360;
			break;
		case 86: // 'v'key
			if (g_joint3Angle < 60.0)  g_joint3Angle = (g_joint3Angle + ANGLE_STEP) % 360;
			break;
		case 67: // 'c'key
			if (g_joint3Angle > -60.0) g_joint3Angle = (g_joint3Angle - ANGLE_STEP) % 360;
			break;
		default: return; // Skip drawing at no effective action
    }
    // Draw
    draw(gl, o, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
}
//各个部件的缓存对象
var g_baseBuffer = null;     //base
var g_arm1Buffer = null;     //arm1
var g_arm2Buffer = null;     //arm2
var g_palmBuffer = null;     //palm
var g_fingerBuffer = null;   //fingers

function initVertexBuffers(gl)
{
  //立方体顶点坐标
	var vertices_base = new Float32Array([ //底座(10x2x10)
		5.0, 2.0, 5.0, -5.0, 2.0, 5.0, -5.0, 0.0, 5.0,  5.0, 0.0, 5.0, // v0-v1-v2-v3 front
		5.0, 2.0, 5.0,  5.0, 0.0, 5.0,  5.0, 0.0,-5.0,  5.0, 2.0,-5.0, // v0-v3-v4-v5 right
		5.0, 2.0, 5.0,  5.0, 2.0,-5.0, -5.0, 2.0,-5.0, -5.0, 2.0, 5.0, // v0-v5-v6-v1 up
		-5.0, 2.0, 5.0, -5.0, 2.0,-5.0, -5.0, 0.0,-5.0, -5.0, 0.0, 5.0, // v1-v6-v7-v2 left
		-5.0, 0.0,-5.0,  5.0, 0.0,-5.0,  5.0, 0.0, 5.0, -5.0, 0.0, 5.0, // v7-v4-v3-v2 down
		5.0, 0.0,-5.0, -5.0, 0.0,-5.0, -5.0, 2.0,-5.0,  5.0, 2.0,-5.0  // v4-v7-v6-v5 back
	]);
	var vertices_arm1 = new Float32Array([  // Arm1(3x10x3)
		1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5,  0.0, 1.5,  1.5,  0.0, 1.5, // v0-v1-v2-v3 front
		1.5, 10.0, 1.5,  1.5,  0.0, 1.5,  1.5,  0.0,-1.5,  1.5, 10.0,-1.5, // v0-v3-v4-v5 right
		1.5, 10.0, 1.5,  1.5, 10.0,-1.5, -1.5, 10.0,-1.5, -1.5, 10.0, 1.5, // v0-v5-v6-v1 up
		-1.5, 10.0, 1.5, -1.5, 10.0,-1.5, -1.5,  0.0,-1.5, -1.5,  0.0, 1.5, // v1-v6-v7-v2 left
		-1.5,  0.0,-1.5,  1.5,  0.0,-1.5,  1.5,  0.0, 1.5, -1.5,  0.0, 1.5, // v7-v4-v3-v2 down
		1.5,  0.0,-1.5, -1.5,  0.0,-1.5, -1.5, 10.0,-1.5,  1.5, 10.0,-1.5  // v4-v7-v6-v5 back
	]);
	var vertices_arm2 = new Float32Array([  // Arm2(4x10x4)
		2.0, 10.0, 2.0, -2.0, 10.0, 2.0, -2.0,  0.0, 2.0,  2.0,  0.0, 2.0, // v0-v1-v2-v3 front
		2.0, 10.0, 2.0,  2.0,  0.0, 2.0,  2.0,  0.0,-2.0,  2.0, 10.0,-2.0, // v0-v3-v4-v5 right
		2.0, 10.0, 2.0,  2.0, 10.0,-2.0, -2.0, 10.0,-2.0, -2.0, 10.0, 2.0, // v0-v5-v6-v1 up
		-2.0, 10.0, 2.0, -2.0, 10.0,-2.0, -2.0,  0.0,-2.0, -2.0,  0.0, 2.0, // v1-v6-v7-v2 left
		-2.0,  0.0,-2.0,  2.0,  0.0,-2.0,  2.0,  0.0, 2.0, -2.0,  0.0, 2.0, // v7-v4-v3-v2 down
		2.0,  0.0,-2.0, -2.0,  0.0,-2.0, -2.0, 10.0,-2.0,  2.0, 10.0,-2.0  // v4-v7-v6-v5 back
	]);
	var vertices_palm = new Float32Array([  // Palm(2x2x6)
		1.0, 2.0, 3.0, -1.0, 2.0, 3.0, -1.0, 0.0, 3.0,  1.0, 0.0, 3.0, // v0-v1-v2-v3 front
		1.0, 2.0, 3.0,  1.0, 0.0, 3.0,  1.0, 0.0,-3.0,  1.0, 2.0,-3.0, // v0-v3-v4-v5 right
		1.0, 2.0, 3.0,  1.0, 2.0,-3.0, -1.0, 2.0,-3.0, -1.0, 2.0, 3.0, // v0-v5-v6-v1 up
		-1.0, 2.0, 3.0, -1.0, 2.0,-3.0, -1.0, 0.0,-3.0, -1.0, 0.0, 3.0, // v1-v6-v7-v2 left
		-1.0, 0.0,-3.0,  1.0, 0.0,-3.0,  1.0, 0.0, 3.0, -1.0, 0.0, 3.0, // v7-v4-v3-v2 down
		1.0, 0.0,-3.0, -1.0, 0.0,-3.0, -1.0, 2.0,-3.0,  1.0, 2.0,-3.0  // v4-v7-v6-v5 back
	]);
	var vertices_finger = new Float32Array([  // Fingers(1x2x1)
		0.5, 2.0, 0.5, -0.5, 2.0, 0.5, -0.5, 0.0, 0.5,  0.5, 0.0, 0.5, // v0-v1-v2-v3 front
		0.5, 2.0, 0.5,  0.5, 0.0, 0.5,  0.5, 0.0,-0.5,  0.5, 2.0,-0.5, // v0-v3-v4-v5 right
		0.5, 2.0, 0.5,  0.5, 2.0,-0.5, -0.5, 2.0,-0.5, -0.5, 2.0, 0.5, // v0-v5-v6-v1 up
		-0.5, 2.0, 0.5, -0.5, 2.0,-0.5, -0.5, 0.0,-0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
		-0.5, 0.0,-0.5,  0.5, 0.0,-0.5,  0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
		0.5, 0.0,-0.5, -0.5, 0.0,-0.5, -0.5, 2.0,-0.5,  0.5, 2.0,-0.5  // v4-v7-v6-v5 back
	]);

    //法线
	var normals = new Float32Array([
		0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
		1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
		0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
		-1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
		0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
		0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
	]);
	//顶点索引
	var indices = new Uint8Array([
		0, 1, 2,   0, 2, 3,    // front
		4, 5, 6,   4, 6, 7,    // right
		8, 9,10,   8,10,11,    // up
		12,13,14,  12,14,15,    // left
		16,17,18,  16,18,19,    // down
		20,21,22,  20,22,23     // back
	]);
    // 将坐标值写入缓冲区对象，但不分配attribute变量
	g_baseBuffer = initArrayBufferForLaterUse(gl, vertices_base, 3, gl.FLOAT);
    g_arm1Buffer = initArrayBufferForLaterUse(gl, vertices_arm1, 3, gl.FLOAT);
    g_arm2Buffer = initArrayBufferForLaterUse(gl, vertices_arm2, 3, gl.FLOAT);
    g_palmBuffer = initArrayBufferForLaterUse(gl, vertices_palm, 3, gl.FLOAT);
    g_fingerBuffer = initArrayBufferForLaterUse(gl, vertices_finger, 3, gl.FLOAT);
    if (!g_baseBuffer || !g_arm1Buffer || !g_arm2Buffer || !g_palmBuffer || !g_fingerBuffer)
    {
	    return -1;
    }
    //将法线坐标写入缓冲区对象，分配给a_Normal并开启
    if (!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) 
    {
	    return -1;
    }
    // Write the indices to the buffer object
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) 
    {
      console.log('Failed to create the buffer object');
      return -1;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
	return indices.length;
}
function initArrayBufferForLaterUse(gl, data, num, type)
{
    var buffer = gl.createBuffer();
    if (!buffer) 
    {
      console.log('Failed to create the buffer object');
      return null;
    }
    //将顶点坐标写入缓冲区
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    //保存一些数据提供给将来分配给attribute使用
    buffer.num = num;
    buffer.type = type;
    return buffer;
}
function initArrayBuffer(gl, attribute, data, num, type)
{
    var buffer = gl.createBuffer();
    if (!buffer) 
    {
		console.log('Failed to create the buffer object');
		return false;
    }
    // 将数据写入缓冲区对象
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // Assign the buffer object to the attribute variable
	var a_attribute = gl.getAttribLocation(gl.program, attribute);
	if (a_attribute < 0) 
	{
		console.log('Failed to get the storage location of ' + attribute);
		return false;
	}
	gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
	// Enable the assignment of the buffer object to the attribute variable
	gl.enableVertexAttribArray(a_attribute);
	return true;
}
//坐标变换矩阵
var g_modelMatrix = new Matrix4(), g_mvpMatrix = new Matrix4();
function draw(gl, n, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix) 
{
	//清理颜色和深缓存
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//画底座
	var baseHeight = 2.0;
	g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
	drawSegment(gl, n, g_baseBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
	//小腿
	var arm1Length = 10.0;
	g_modelMatrix.translate(0.0, baseHeight, 0.0);     // Move onto the base
	g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
	drawSegment(gl, n, g_arm1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix); // Draw
	//脚板
	var arm2Length = 10.0;
	g_modelMatrix.translate(0.0, arm1Length, 0.0);       // Move to joint1
	g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);  // Rotate around the z-axis
	drawSegment(gl, n, g_arm2Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix); // Draw
	// A palm
	var palmLength = 2.0;
	g_modelMatrix.translate(0.0, arm2Length, 0.0);       // Move to palm
	g_modelMatrix.rotate(g_joint2Angle, 0.0, 0.0, 1.0);  // Rotate around the y-axis
	drawSegment(gl, n, g_palmBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);  // Draw
	//移动到掌心的中心
	g_modelMatrix.translate(0.0, palmLength, 0.0);
	//脚趾1
	pushMatrix(g_modelMatrix);
    g_modelMatrix.translate(0.0, 0.0, 2.0);
    g_modelMatrix.rotate(g_joint3Angle, 0.0, 0.0, 1.0);  // Rotate around the x-axis
    drawSegment(gl, n, g_fingerBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
	g_modelMatrix = popMatrix();
	//脚趾2
	g_modelMatrix.translate(0.0, 0.0, 0.5);
	g_modelMatrix.rotate(g_joint3Angle, 0.0, 0.0, 1.0);  // Rotate around the x-axis
	drawSegment(gl, n, g_fingerBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
	//脚趾3
	g_modelMatrix.translate(0.0, 0.0, -1.5);
	g_modelMatrix.rotate(g_joint3Angle, 0.0, 0.0, 1.0);  // Rotate around the x-axis
	drawSegment(gl, n, g_fingerBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
	//脚趾4
	g_modelMatrix.translate(0.0, -1.0, -2.0);
	g_modelMatrix.rotate(g_joint3Angle, 0.0, 0.0, 1.0);  // Rotate around the x-axis
	drawSegment(gl, n, g_fingerBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
	//脚趾5
	g_modelMatrix.translate(0.0, -0.5, 6.5);
	g_modelMatrix.rotate(g_joint3Angle, 0.0, 0.0, 1.0);  // Rotate around the x-axis
	drawSegment(gl, n, g_fingerBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
}
var g_matrixStack = []; // 存储矩阵的数组
function pushMatrix(m) //将矩阵压入栈
{
	var m2 = new Matrix4(m);
	g_matrixStack.push(m2);
}
function popMatrix() //将矩阵弹出栈
{
	return g_matrixStack.pop();
}
var g_normalMatrix = new Matrix4();  // Coordinate transformation matrix for normals
//绘制部件
function drawSegment(gl, n, buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix) 
{
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    //将缓冲区对象分配给attribute
    gl.vertexAttribPointer(a_Position, buffer.num, buffer.type, false, 0, 0);
    // 开启变量
    gl.enableVertexAttribArray(a_Position);
    //计算模型视图矩阵并传给u_MvpMatrix
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
    //计算用来变换法线的矩阵并传给u_NormalMatrix
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
    //绘制
	gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}