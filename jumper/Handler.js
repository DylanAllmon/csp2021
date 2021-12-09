const StartState = "menu"; // game or menu
var STATE = StartState;

const windowH = Math.round((window.innerHeight*16/9 < window.innerWidth ? window.innerHeight : window.innerWidth*9/16));

const windowW = Math.round((window.innerHeight*16/9 < window.innerWidth ? window.innerHeight*16/9 : window.innerWidth));

const ratio = windowH/500;

var mobile = false;

function setup() {
	document.getElementById("Form").style.color = "rgb(0,255,0)";
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
		let col = color(color("hsl(' + floor(hue*(360/maxHue)) + ',100%,30%)").levels);
		//document.getElementById("Form").style.color = "rgb(" + col.red() + "," + col.green() + "," + col.blue() + ")";
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
