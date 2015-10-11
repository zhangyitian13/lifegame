var timedelay = 100;
var mouseflag = 0;
var lifedensity = 0.2;
var length = 20;              //细胞边长20px
var c_width = 700;            //画布宽高
var c_height = 500;
var c_offset_x = 0;           //相对于大地图的细胞位置数偏移
var c_offset_y = 0;
var mapsize = 400;
var map = new Array();        //大地图
var timer;
for(var i = 0; i < mapsize; i++){ 
map[i]=new Array(); 
for(var j = 0; j < mapsize; j++){ 
map[i][j] = 0;
}
}
var newmap = new Array();        //大地图
for(var i = 0; i < mapsize; i++){ 
newmap[i]=new Array(); 
for(var j = 0; j < mapsize; j++){ 
newmap[i][j] = 0;
}
}
//---map[i][j] = 0 死
//---map[i][j] = 1 活

//----设置全局变量完毕
function init(){
	document.getElementById("showwindow").width = c_width;
	document.getElementById("showwindow").height = c_height;
	var i, j;                              //随机生成活细胞
	for (i = 0; i < mapsize; i++){
		for (j = 0; j < mapsize; j++){
			if ((Math.random() < lifedensity) && (map[i][j] != -1)){
				map[i][j] = 1;
			}
		}
	}
	return;
}
function draw(i, j, k){       //在地图（i，j）的位置画一个状态为k的细胞
	if (k == 0)
		return;
	if (i*length < 0 || (i+1)*length > c_width || j*length < 0 || (j+1)*length > c_height)
		return;
	var can = document.getElementById("showwindow");
	cans = can.getContext('2d');
	cans.beginPath();
	cans.arc((i+0.5)*length, (j+0.5)*length, length*0.45, 0, Math.PI*2, true);
	cans.closePath();
	if (k == 1){
		cans.fillStyle = 'green';
	}
	else if (k == -1){
		cans.fillStyle = 'black';
	}
	cans.fill();
}
function clearcanvas(){
	var can = document.getElementById("showwindow");
	cans = can.getContext('2d');
	cans.fillStyle="#FFFFFF";
	cans.fillRect(0, 0, c_width, c_height);
	return;
}
function drawmap(){
	var i, j;
	clearcanvas();
	for (i = c_offset_x; i < c_offset_x + c_width/length + 1; i++){
		for (j = c_offset_y; j < c_offset_y + c_height/length + 1; j++){
			draw((i - c_offset_x + mapsize) % mapsize, (j - c_offset_y + mapsize) % mapsize, map[i % mapsize][j % mapsize]);
		}
	}
}
function nextgeneration(){
	var i, j, k;
	for (i = 0; i < mapsize; i++){
		for (j = 0; j < mapsize; j++){
			if (map[i][j] == -1){
				newmap[i][j] = -1;
				continue;
			}
			k = parseInt((map[(i-1+mapsize)%mapsize][j%mapsize]+1)/2) + parseInt((map[(i+1)%mapsize][j%mapsize]+1)/2) + parseInt((map[i%mapsize][(j-1+mapsize)%mapsize]+1)/2) + parseInt((map[i%mapsize][(j+1)%mapsize]+1)/2) + parseInt((map[(i-2+mapsize)%mapsize][(j+mapsize)%mapsize]+1)/2) + parseInt((map[(i+2+mapsize)%mapsize][(j)%mapsize]+1)/2) + parseInt((map[(i)%mapsize][(j-2+mapsize)%mapsize]+1)/2) + parseInt((map[(i)%mapsize][(j+2)%mapsize]+1)/2);
			if (k == 3)
				newmap[i][j] = 1;
			else if (k == 2)
				newmap[i][j] = map[i][j];
			else newmap[i][j] = 0;
		}
	}
	for (i = 0; i < mapsize; i++){
		for (j = 0; j < mapsize; j++){
			map[i][j] = newmap[i][j];
		}
	}
}
function loop(){
	drawmap();
	nextgeneration();
}
function bigger(){
	length += 2;
	return;
}
function smaller(){
	if (length - 2 >= 4)
		length -= 2;
	return;
}
function goleft(){
	c_offset_x = (c_offset_x - parseInt(40/length) + mapsize) % mapsize;
}

function goright(){
	c_offset_x = (c_offset_x + parseInt(40/length) + mapsize) % mapsize;
}

function godown(){
	c_offset_y = (c_offset_y + parseInt(40/length) + mapsize) % mapsize;
}

function goup(){
	c_offset_y = (c_offset_y - parseInt(40/length) + mapsize) % mapsize;
}
//----键盘响应函数 上下左右ab键
document.onkeydown=function(event){
var e = event || window.event || arguments.callee.caller.arguments[0];
if(e && e.keyCode==65){ 
	bigger();
	drawmap();
}
if(e && e.keyCode==66){ 
	smaller();
	drawmap();
} 
if(e && e.keyCode==38){ 
	goup();
	drawmap();
}
if(e && e.keyCode==40){ 
	godown();
	drawmap();
}
if(e && e.keyCode==37){ 
	goleft();
	drawmap();
}
if(e && e.keyCode==39){ 
	goright();
	drawmap();
}
}; 
//----键盘响应函数---END

//----鼠标响应函数 
function setwall(event){
	var x, y;
	if (mouseflag == 2){
		x = (parseInt(event.offsetX / length) + c_offset_x) % mapsize;
		y = (parseInt(event.offsetY / length) + c_offset_y) % mapsize;
		map[x][y] = -1;
		drawmap();
	}
	return;
}

function clicksetwall(){
	mouseflag = 1;
}

function startsetwall(event){
	if (mouseflag == 1){
		mouseflag = 2;
		x = (parseInt(event.offsetX / length) + c_offset_x) % mapsize;
		y = (parseInt(event.offsetY / length) + c_offset_y) % mapsize;
		map[x][y] = -1;
	}
}

function endsetwall(event){
	if (mouseflag == 2){
		mouseflag = 1;
	}
	return;
}
//----鼠标响应函数---END
function startgame(){
	mouseflag = 0;
	init();
	if (timer != "undefined"){
		clearInterval(timer);
	}
	timer = setInterval(loop, timedelay);
}

function savesetting(){
	var a, b;
	a = parseFloat(document.getElementById("input_density").value);
	b = parseInt(document.getElementById("input_fps").value);
	if (a >= 0 && a <= 1){
		lifedensity = a;
	}
	if (b >= 0 && b <= 100){
		timedelay = parseInt(1000/b);
	}
}
//---测试---
describe("测试地图初始化状态", function(){
	it("map[i][j], newmap[i][j]应该等于0", function(){
		var i, j;
		for (i = 0; i < 400; i++){
			for (j = 0; j < 400; j++){
				map[i][j].should.eql(0);
				newmap[i][j].should.eql(0);
			}
		}
			
	});
});

describe("测试init函数", function(){
	it('DOM元素"showwindow"的宽和高应该为700和500', function(){
		init();
		document.getElementById("showwindow").width.should.eql(700);
		document.getElementById("showwindow").height.should.eql(500);
	});
});

describe("测试随机生成点的算法",function(){
	it('根据中心极限定理，此项测试在0.3%的概率下即使程序正确也会不通过', function(){
		var i, j, k;
		k = 0;
		for (i = 10; i < 20; i++){
			for (j = 10; j < 20; j++){
				if (map[i][j] == 1){
					k++;
				}
			}
		}
		k.should.be.within(8, 32);	
	});
});
describe("测试clearcanvas()函数",function(){
	it("clearcanvas()函数应该能够正确的擦除画布",function(){
		clearcanvas();
		var i,j,k;
		var a = document.getElementById("showwindow");
		var b = a.getContext("2d");
		var imagedata;
		for (i = 0; i < 35; i++){
			for (j = 0; j < 25; j++){
				imagedata = b.getImageData(20*i+5,20*j+5,10,10);
				for (k = 0; k < 400; k+=4){
					imagedata.data[k].should.eql(255);
					imagedata.data[k+1].should.eql(255);
					imagedata.data[k+2].should.eql(255);
				}
			}
		}
	});
});
describe("测试draw()函数",function(){
	it("应该正确地在地图canva上绘制出绿色和黑色的圆，并且在超越边界的地方做出正确的处理", function(){
		var i,j,k;
		var a = document.getElementById("showwindow");
		var b = a.getContext("2d");
		var imagedata;
		for (i = 0; i < 35; i++){
			for (j = 0; j < 25; j++){
				draw(i,j,1);
			}
		}
		for (i = 0; i < 35; i++){
			for (j = 0; j < 25; j++){
				imagedata = b.getImageData(20*i+5,20*j+5,10,10);
				for (k = 1; k < 400; k+=4){
					imagedata.data[k].should.eql(128);
				}
			}
		}
		for (i = 0; i < 35; i++){
			for (j = 0; j < 25; j++){
				draw(i,j,-1);
			}
		}
		for (i = 0; i < 35; i++){
			for (j = 0; j < 25; j++){
				imagedata = b.getImageData(20*i+5,20*j+5,10,10);
				for (k = 0; k < 400; k+=4){
					imagedata.data[k].should.eql(0);
					imagedata.data[k+1].should.eql(0);
					imagedata.data[k+2].should.eql(0);
				}
			}
		}
		clearcanvas();
		for (i = 0; i < 35; i++){
			for (j = 0; j < 25; j++){
				draw(i,j,0);
			}
		}
		draw(-1, 0, -1);//---测试越界处理
		draw(0, -1, -1);
		draw(-1,-1, -1);
		draw(35, 24, -1);
		draw(34, 25, -1);
		draw(35, 35, -1);
		draw(35, 0, -1);
		draw(34, -1, -1);
		draw(35, -1, -1);
		draw(-1, 24, -1);
		draw(0, 25, -1);
		draw(-1, 25, -1);
		for (i = 0; i < 35; i++){
			for (j = 0; j < 25; j++){
				imagedata = b.getImageData(20*i+5,20*j+5,10,10);
				for (k = 0; k < 400; k+=4){
					imagedata.data[k].should.eql(255);
					imagedata.data[k+1].should.eql(255);
					imagedata.data[k+2].should.eql(255);
				}
			}
		}
	});
});
function test_clear(){
	var i, j;
	for (i = 1; i <= 5; i++){
		for (j = 1; j <= 5; j++){
			map[i][j] = 0;
		}
	}
}
describe("测试nextgeneration()函数",function(){
	it("应该能够正确的在多种情况下计算出正确的下一代细胞",function(){
		test_clear();
		map[3][3] = -1;
		map[3][1] = 1;
		map[3][5] = 1;
		nextgeneration();
		map[3][3].should.eql(-1);
		test_clear();
		map[3][3] = 0;
		map[1][3] = 1;
		map[2][3] = 1;
		map[4][3] = 1;
		map[5][3] = 1;
		map[3][1] = 1;
		map[3][2] = 1;
		map[3][4] = 1;
		map[3][5] = 1;
		nextgeneration();
		map[3][3].should.eql(0);
		test_clear();
		map[3][3] = 0;
		map[1][3] = 1;
		map[2][3] = 0;
		map[4][3] = 1;
		map[5][3] = 1;
		map[3][1] = 1;
		map[3][2] = 1;
		map[3][4] = 1;
		map[3][5] = 1;
		nextgeneration();
		map[3][3].should.eql(0);
		test_clear();
		map[3][3] = 0;
		map[1][3] = 1;
		map[2][3] = 1;
		map[4][3] = -1;
		map[5][3] = 1;
		map[3][1] = 1;
		map[3][2] = 1;
		map[3][4] = 1;
		map[3][5] = 1;
		nextgeneration();
		map[3][3].should.eql(0);
		test_clear();
		map[3][3] = 0;
		map[1][3] = 0;
		map[2][3] = 0;
		map[4][3] = 1;
		map[5][3] = 1;
		map[3][1] = 1;
		map[3][2] = 1;
		map[3][4] = 1;
		map[3][5] = 1;
		nextgeneration();
		map[3][3].should.eql(0);
		test_clear();
		map[3][3] = 0;
		map[1][3] = 0;
		map[2][3] = -1;
		map[4][3] = 1;
		map[5][3] = 1;
		map[3][1] = 1;
		map[3][2] = 1;
		map[3][4] = 1;
		map[3][5] = 1;
		nextgeneration();
		map[3][3].should.eql(0);
		test_clear();
		map[3][3] = 0;
		map[1][3] = 0;
		map[2][3] = 0;
		map[4][3] = 1;
		map[5][3] = 0;
		map[3][1] = 1;
		map[3][2] = 1;
		map[3][4] = 1;
		map[3][5] = 1;
		nextgeneration();
		map[3][3].should.eql(0);
		test_clear();
		map[3][3] = 0;
		map[1][3] = 0;
		map[2][3] = 0;
		map[4][3] = 1;
		map[5][3] = 1;
		map[3][1] = 0;
		map[3][2] = 0;
		map[3][4] = 1;
		map[3][5] = 1;
		nextgeneration();
		map[3][3].should.eql(0);
		test_clear();
		map[3][3] = 0;
		map[1][3] = 0;
		map[2][3] = 0;
		map[4][3] = 1;
		map[5][3] = 0;
		map[3][1] = 0;
		map[3][2] = 0;
		map[3][4] = 1;
		map[3][5] = 1;
		nextgeneration();
		map[3][3].should.eql(1);
		test_clear();
		map[3][3] = 1;
		map[1][3] = 0;
		map[2][3] = 0;
		map[4][3] = 1;
		map[5][3] = 0;
		map[3][1] = 1;
		map[3][2] = 0;
		map[3][4] = 0;
		map[3][5] = 1;
		nextgeneration();
		map[3][3].should.eql(1);
		test_clear();
		map[3][3] = 0;
		map[1][3] = 0;
		map[2][3] = 0;
		map[4][3] = 1;
		map[5][3] = 0;
		map[3][1] = 0;
		map[3][2] = 0;
		map[3][4] = 1;
		map[3][5] = 0;
		nextgeneration();
		map[3][3].should.eql(0);
		test_clear();
		map[3][3] = 1;
		map[1][3] = 0;
		map[2][3] = 0;
		map[4][3] = 1;
		map[5][3] = 0;
		map[3][1] = 0;
		map[3][2] = 0;
		map[3][4] = 1;
		map[3][5] = 0;
		nextgeneration();
		map[3][3].should.eql(1);
		test_clear();
		map[3][3] = 1;
		map[1][3] = 0;
		map[2][3] = 0;
		map[4][3] = 0;
		map[5][3] = 0;
		map[3][1] = 0;
		map[3][2] = 0;
		map[3][4] = 1;
		map[3][5] = 0;
		nextgeneration();
		map[3][3].should.eql(0);
	});
});

describe("测试函数bigger(),smaller(),goup(),godown(),goleft(),godown()", function(){
	it("应该能正确地放大缩小地图，向并各个方向移动",function(){
		length = 20;
		bigger();
		length.should.eql(22);
		smaller();
		length.should.eql(20);
		length = 2;
		smaller();
		length.should.eql(2);
		length = 20;
		goleft();
		c_offset_x.should.eql(398);
		goright();
		c_offset_x.should.eql(0);
		goup();
		c_offset_y.should.eql(398);
		godown();
		c_offset_y.should.eql(0);
	});
});

describe("测试drawmap()和loop()", function(){
	it("应该能够正确的绘制地图和实现一次循环", function(){
		map[0][0] = 1;
		map[0][1] = 0;
		map[1][0] = 0;
		map[1][1] = -1;
		map[2][2] = 1;
		map[0][2] = 0;
		map[1][2] = 0;
		map[2][0] = 0;
		map[2][1] = 0;
		map[2][3] = 0;
		map[2][4] = 0;
		map[3][2] = 0;
		map[4][2] = 0;
		drawmap();
		var i,j,k;
		var a = document.getElementById("showwindow");
		var b = a.getContext("2d");
		var imagedata;
		imagedata = b.getImageData(5,5,10,10);
		for (k = 1; k < 400; k+=4){
			imagedata.data[k].should.eql(128);
		}
		imagedata = b.getImageData(5,25,10,10);
		for (k = 0; k < 400; k+=4){
			imagedata.data[k].should.eql(255);
			imagedata.data[k+1].should.eql(255);
			imagedata.data[k+2].should.eql(255);
		}
		imagedata = b.getImageData(25,5,10,10);
		for (k = 0; k < 400; k+=4){
			imagedata.data[k].should.eql(255);
			imagedata.data[k+1].should.eql(255);
			imagedata.data[k+2].should.eql(255);
		}
		imagedata = b.getImageData(25,25,10,10);
		for (k = 0; k < 400; k+=4){
			imagedata.data[k].should.eql(0);
			imagedata.data[k+1].should.eql(0);
			imagedata.data[k+2].should.eql(0);
		}
		loop();
		map[2][2].should.eql(0);
	});
});

