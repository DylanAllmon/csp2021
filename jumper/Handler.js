const StartState = "menu"; // game or menu
var STATE = StartState;

function setup() {
	createCanvas(windowW, windowH, WEBGL);
	textFont(font);
  textAlign(CENTER, CENTER);
	angleMode(DEGREES);
	noStroke();
	obstacles.addColumn();
	obstacles.addColumn();
	obstacles.addColumn();
	obstacles.addColumn();
	
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
