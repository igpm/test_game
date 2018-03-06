
var canvasElement, canvasCtx;

document.addEventListener("DOMContentLoaded", function(event) {
	var httpStartRequest = new XMLHttpRequest();
	httpStartRequest.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			canvasElement = document.getElementById('canvas'),
			canvasCtx = canvasElement.getContext('2d')
			gameArea.setBoard();
			canvasElement.addEventListener('click', clickHandler);
		}
	}
	httpStartRequest.open('GET','/cgi-bin/reset_count.py',true);
	httpStartRequest.send();
});

var gameArea = {
	boardElements: [],
	setBoard: function() {
		this.boardElements = [[false, false, false],[false, false, false],[false, false, false]];
		var backgroundImg = new Image();
		backgroundImg.src = './images/Background.png';
		backgroundImg.onload = function() {
			canvasCtx.drawImage(backgroundImg, 0, 0);
		}
	},
	setComponent: function(eCoords, img) {
		this.boardElements[eCoords[0]][eCoords[1]] = true;
		var coords = [];
		if (eCoords[0] == 0 && eCoords[1] == 0) { coords[0] = 0; coords[1] = 0;}
		else if (eCoords[0] == 0 && eCoords[1] == 1) { coords[0] = 0; coords[1] = 134; }
		else if (eCoords[0] == 0 && eCoords[1] == 2) { coords[0] = 0; coords[1] = 267; }
		else if (eCoords[0] == 1 && eCoords[1] == 0) { coords[0] = 134; coords[1] = 0; }
		else if (eCoords[0] == 1 && eCoords[1] == 1) { coords[0] = 134; coords[1] = 134; }
		else if (eCoords[0] == 1 && eCoords[1] == 2) { coords[0] = 134; coords[1] = 267; }
		else if (eCoords[0] == 2 && eCoords[1] == 0) { coords[0] = 267; coords[1] = 0; }
		else if (eCoords[0] == 2 && eCoords[1] == 1) { coords[0] = 267; coords[1] = 134; }
		else if (eCoords[0] == 2 && eCoords[1] == 2) { coords[0] = 267; coords[1] = 267; }
		else { coords[0] = -1; coords[1] = -1; }
		var elementImg = new Image();
		elementImg.src = img;
		elementImg.onload = function() {
			canvasCtx.drawImage(elementImg, coords[0], coords[1]);
		}
	}
};

function clickHandler(event) {
	var elementPos = [];
	if (event.offsetX >= 0 && event.offsetX <= 134) elementPos[0] = 0;
	else if (event.offsetX >= 134 && event.offsetX <= 267) elementPos[0] = 1;
	else if (event.offsetX >= 267 && event.offsetX <= 400) elementPos[0] = 2;
	else elementPos[0] = -1;

	if (event.offsetY >= 0 && event.offsetY <= 134) elementPos[1] = 0;
	else if (event.offsetY >= 134 && event.offsetY <= 267) elementPos[1] = 1;
	else if (event.offsetY >= 267 && event.offsetY <= 400) elementPos[1] = 2;
	else elementPos[1] = -1;
	
	if (gameArea.boardElements[elementPos[0]][elementPos[1]]) return;
	gameArea.setComponent(elementPos,'./images/Cross.png');
	serverAction(elementPos);
}

function handleResult() {
	canvasElement.removeEventListener('click', clickHandler);
	var newGameButton = document.createElement('button');
	var newGameButtonSign = document.createTextNode('Start New Game');
	newGameButton.appendChild(newGameButtonSign);
	var newGameNode = document.getElementById('new_game');
	newGameNode.appendChild(newGameButton);
	newGameButton.addEventListener('click',function() {
		canvasElement.addEventListener('click', clickHandler);
		gameArea.setBoard();
		newGameNode.removeChild(newGameButton);
	});
}

function handleAction(rData) {
	console.log(rData);
	var secondElementPos = [];
	secondElementPos[0] = rData.x;
	secondElementPos[1] = rData.y;
	if (rData.state === 'tie') {
		handleResult();
			return;
	}
	if (rData.state === 'win') {
		if (rData.element === 'o') {
			gameArea.setComponent(secondElementPos, './images/Zero.png');
		}
		if (rData.direction === 'vertical') {
			if (rData.number === 0) gameArea.setComponent([0, 0], './images/Line1.png');
			if (rData.number === 1) gameArea.setComponent([0, 0], './images/Line2.png');
			if (rData.number === 2) gameArea.setComponent([0, 0], './images/Line3.png');
		}
		if (rData.direction === 'horizontal') {
			if (rData.number === 0) gameArea.setComponent([0, 0], './images/Line4.png');
			if (rData.number === 1) gameArea.setComponent([0, 0], './images/Line5.png');
			if (rData.number === 2) gameArea.setComponent([0, 0], './images/Line6.png');
		}
		if (rData.direction === 'diagonal') {
			if (rData.number === 0) gameArea.setComponent([0, 0], './images/Line7.png');
			if (rData.number === 1) gameArea.setComponent([0, 0], './images/Line8.png');
		}
		handleResult();
		return;
	}
	gameArea.setComponent(secondElementPos, './images/Zero.png');
}

function serverAction(firstElementPos) {
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			var respData = JSON.parse(httpRequest.responseText);
			handleAction(respData);
		}
	}
	httpRequest.open('POST','/cgi-bin/cgi_script.py',true);
	httpRequest.setRequestHeader('Content-Type', 'application/json');
	httpRequest.send(JSON.stringify({'x': firstElementPos[0], 'y': firstElementPos[1]}) + '\n');
}
