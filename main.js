/*
원리
1. 아직 간 적 없는 위치에 들어왔을 경우 흰색을 칠해주고 방문했음을 변수로 남김.

2. 막다른 골목에 도달했을 경우는 막다르지 않은 지점까지 백트랙킹을 함. 
이 때, 여태껏 걸어온 경로를 스택에 저장해두면 역으로 꺼내면서 되돌아가는 게 가능.
헨델과 그레텔 빵조각떨구기 생각하면 이해하기 쉽다.

3. 새 길을 만들 때마다 스택에 저장하고, 다시 백트랙킹 할 때마다 스택에서 빼면서 진행하면 
자동으로 전 구역을 스캔한 후 최초 지점으로 돌아오고 스택은 제로가 되며 알고리즘이 종료됨.

*/


var tc = 21; // tile count (무조건 홀수)
var gs = 20; // grid size
var field; // map position array which value is 0 for wall, 1~2 for way // 미로 벽에 대해 값이 0인 맵 위치 배열
var px = py = 1; // 0 < =  px,py < tc
var xv = yv = 0;
var tracker;
var stack;
var stucked;

var cx, cy; 

window.onload = function(){
	canv = document.getElementById("maze");	// 미로 캔버스
	ctx = canv.getContext("2d"); // 2d 그래픽의 컨텍스트 타입 지정
	document.addEventListener("keydown", keyPush); // 키를 누르면 발생하는 keydown 타입의 이벤트
	initialize(); // 객체 초기화 함수, 변수들을 계속해서 유지? 사용하기 위한??
	
}

// 키를 눌렀다가 땠을 때 이벤트
function enterkey() {
    if (window.event.keyCode == 13) {
    	var sizeInput = document.getElementById("sizeInput").value; // sizeInput Id 찾기
    	if(sizeInput % 2 == 0){
    		alert("Please enter an odd number."); // 미로의 길이가 홀수여야해서
    	} else {
    		tc = sizeInput; // 홀수라면 지정해준 미로의 길이를 tc에 저장
    		initialize();
    	}
    }
}


function initialize(){
	document.getElementById("sizeInput").value = tc;
	make2DArray();
	
	ctx.fillStyle = "black"; // 캔버스의 스타일 지정
	canv.width = canv.height = tc*gs; // 캔버스 크기 지정
	ctx.fillRect(0, 0, canv.width, canv.height); // 캔버스 시작점과 지정한 크기만큼의 사각형 생성
	
	// 알고리즘.. 모르겠다..

	makeWay(0, 1);
	makeWay(tc - 1, tc - 2);
	
	px = py = 1;
	// tracker initial position
	tracker = {x: px, y: py};
	stack = [];
	stack.push(tracker);
	stucked = false;
	randomMazeGenerator();
	
	cx = 0; cy = 1;
	// character initial position
	ctx.fillStyle="red";
	ctx.fillRect(cx*gs, cy*gs, gs, gs);
	
}

function makeWay(xx,yy){
	//console.log("makeWay: " + xx + " " + yy);
	field[yy][xx]++;
	ctx.fillStyle="white";
	ctx.fillRect(xx*gs, yy*gs, gs, gs);
}

function keyPush(evt){
	switch(evt.keyCode){
	case 37:
		xv = -1; yv = 0;
		break;
	case 38:
		xv = 0; yv = -1;
		break;
	case 39:
		xv = 1; yv = 0;
		break;
	case 40:
		xv = 0; yv = 1;
		break;
	}
	cx += xv;
	cy += yv;
	if(cx < 0 || cx > tc-1 || cy < 0 || cy > tc-1 || field[cy][cx] == 0){
		cx -= xv;
		cy -= yv;
		return;
	} else{
		ctx.fillStyle="red";
		ctx.fillRect(cx*gs, cy*gs, gs, gs);
		ctx.fillStyle="white";
		ctx.fillRect((cx-xv)*gs, (cy-yv)*gs, gs, gs);
		document.getElementById("text").innerHTML = "cx: " + cx + " cy: " + cy;

		if(cx == tc-1 && cy == tc-2){
			alert("You Win!");
			initialize();
		}
	}
		
}

function make2DArray(){
	console.log("tc: " + tc);
	field = new Array(parseInt(tc));
	for(var i=0; i<field.length; i++){
		field[i] = new Array(parseInt(tc));
	}
	console.log("field length: " + field.length);
	for(var i = 0; i < field.length; i++){
		for(var j = 0; j < field[i].length; j++){
			field[i][j] = 0; // value of 0 is for not visited, 1 for visited, 2 for backtracked.
		}
	}
	console.log("field: " + field);
}

function randomMazeGenerator(){
	while(stack.length > 0){
		if(stucked)
			backtracking();
		else	
			tracking();
	}			
}


function tracking(){
	
	/* Random Move */
	key = Math.floor(Math.random() * 4); // Math.floor : 주어진 숫자와 같거나 작은 정수 중에서 가장 큰 수를 반환
	                                     // Math.random : 0 이상 1 미만의 구간에서 근사적으로 균일한 부동소숫점 의사난수를 반환
	switch(key){
	case 0: // left move
		xv =- 2; yv = 0;
		break;
	case 1: // up move
		xv = 0; yv =- 2;
		break;
	case 2: // right move
		xv = 2; yv = 0;
		break;
	case 3: // down move
		xv = 0; yv = 2;
		break;
	}
	
	px += xv;
	py += yv;
	if(px < 0 || px > tc-1 || py < 0 || py > tc-1){
		px -= xv;
		py -= yv;
		return;
	} 
	if(field[py][px] < 1){
		makeWay(px - xv / 2, py - yv /2);
		makeWay(px, py);
		tracker = {x: px, y: py};
		stack.push(tracker);
		blockCheck();	
	}else{
		px -= xv;
		py -= yv;
		return;
	}

}

function blockCheck(){
	var blockCount = 0;
	if(py+2 > tc-1 || field[py+2][px] != 0)
		blockCount++;
	if(py-2 < 0 || field[py-2][px] != 0)
		blockCount++;
	if(px+2 > tc-1 || field[py][px+2] != 0)
		blockCount++;
	if(px-2 < 0 || field[py][px-2] != 0)
		blockCount++;
	if(blockCount >= 4)
		stucked = true;
	else
		stucked = false;
}


// 백트래킹 : 해를 찾는 도중 해가 아니어서 막히면, 되돌아가서 다시 해를 찾아가는 기법
function backtracking(){
	var backtracker = stack.pop(); //stack 배열의 마지막 요소를 제거한 후, 제거한 요소를 반환
	px = backtracker.x;
	py = backtracker.y;
	blockCheck();	
}
