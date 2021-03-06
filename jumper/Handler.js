const StartState = "menu"; // game or menu
var STATE = StartState;

const windowH = Math.round((window.innerHeight*16/9 < window.innerWidth ? window.innerHeight : window.innerWidth*9/16));

const windowW = Math.round((window.innerHeight*16/9 < window.innerWidth ? window.innerHeight*16/9 : window.innerWidth));

const ratio = windowH/500;

var mobile = false;

function setup() {
	createCanvas(windowW, windowH, WEBGL);
	textFont(Helvetica);
  textAlign(CENTER, CENTER);
	angleMode(DEGREES);
	noStroke();
	obstacles.addColumn();
	obstacles.addColumn();
	obstacles.addColumn();
	obstacles.addColumn();
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
 		mobile = true;
		setShakeThreshold(3);
	}
	
	switch (STATE.toLowerCase()) {
		case ("menu"):
			menuStart();
			break
		case "game":
			gameStart();
			break
	}
}

function draw() {
	if (!openProcessing) {
		let col = color('hsl(' + floor(hue*(360/maxHue)) + ',100%,50%)');
		document.getElementById("Form").style.color = "rgb(" + round(red(col)) + "," + round(green(col)) + "," + round(blue(col)) + ")";
	}
	backgroundProcesses();
	if (STATE.toLowerCase() == "menu") {
		menuTick();
	} else {
		gameTick();
	}
}

function switchState(st) {
	switch (st.toLowerCase()) {
		case ("menu"):
			STATE = "menu";
			menuStart();
			break
		case "game":
			STATE = "game";
			gameStart();
			break
	}
}

function mouseOnScreen() {
	if (mouseX >=0 && mouseX <= canvas.width) {
		if (mouseY >=0 && mouseY <= canvas.height) {
			return true;
		}
	}
	return false;
}
