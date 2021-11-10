function setup() {
	createCanvas(windowW, windowH, WEBGL);
	player.color = color(80,0,200);
	angleMode(DEGREES);
	obstacles.addColumn();
	obstacles.addColumn();
	cam = createCamera();
	distance = cam.eyeZ;
	perspective(80);
	cam.setPosition(mainOffset.x*blockSize,-mainOffset.y*blockSize,mainOffset.z*blockSize);
	
	strokeWeight(0);
	
	//obstacle(0,0,20,5,1,1);
	//obstacle(0,0,30,3,2,1);
	//obstacle(0,0,40,3,2,1);
	//obstacle(0,0,50,3,2,1);
}

function draw() {		
	difficulty();
	
	bg();
	input();
	if (player != null) {
		keyDownActions();
		physics();
	}
	render();	
	if (transitioning) {
		cameraMove();
	}
	
	tickSecond();
}

function physics() {
	if (abs(player.x+player.velX) < (platformWidth/2-0.5)*blockSize) {
		player.x+=player.velX;
	} else {
		player.x = ((player.x+player.velX)/abs(player.x+player.velX)*(platformWidth/2-0.5)*blockSize);
		player.velX = 0;
	}
	player.velY-=gravity;
	if (player.y + player.velY <= 0) {
		player.velY = 0;
		player.y = 0;
		player.onGround = true;
	} else {
		player.onGround = false;
		player.y+=player.velY;
	}
}

function render() {
	ambientLight(brightness);
	
	pointLight(color(255), 0,0,mainOffset.z*blockSize)
	
	renderPlayer();
	renderPlatform();
	renderObstacles();
}

let sec = 0;
function tickSecond() {
	if (seconds() > sec) {
		sec = seconds();
		
		
		leveling();
		
		
	}
}

function leveling() {
	if (sec % spawnRate == 0) {
		obstacle(0,0,40,5,1,1);
	}
}

function cameraMove() {
	if (view === "main") {
		cam.lookAt(0, -mainOffset.y*blockSize,sideOffset.z*blockSize);
		let velX = (mainOffset.x*blockSize-cam.eyeX)/10;
		let velY = (-mainOffset.y*blockSize-cam.eyeY)/10;
		let velZ = (mainOffset.z*blockSize-cam.eyeZ)/10;
		
		if (dist(cam.eyeX,-cam.eyeY,cam.eyeZ,mainOffset.x*blockSize,mainOffset.y*blockSize,mainOffset.z*blockSize) > 0.1) {
			cam.setPosition(cam.eyeX+velX,cam.eyeY+velY,cam.eyeZ+velZ);
		} else {
			cam.setPosition(mainOffset.x*blockSize,-mainOffset.y*blockSize,mainOffset.z*blockSize)
			transitioning = false;
		}
	} else {
		cam.lookAt(0, -sideOffset.y*blockSize,sideOffset.z*blockSize);
		let velX = (sideOffset.x*blockSize-cam.eyeX)/10;
		let velY = (-sideOffset.y*blockSize-cam.eyeY)/10;
		let velZ = (sideOffset.z*blockSize-cam.eyeZ)/10;
		
		if (dist(cam.eyeX,-cam.eyeY,cam.eyeZ,sideOffset.x*blockSize,sideOffset.y*blockSize,sideOffset.z*blockSize) > 0.5) {
			cam.setPosition(cam.eyeX+velX,cam.eyeY+velY,cam.eyeZ+velZ);
		} else {
			cam.setPosition(sideOffset.x*blockSize,-sideOffset.y*blockSize,sideOffset.z*blockSize)
			transitioning = false;
		}
		
	}
}

const slowSpeed = 0.04;
function difficulty() {
		accelMax = baseAccelMax*difficultyMultiplier;
		accelRate = accelMax/10;
 		gravity = baseGravity*difficultyMultiplier;
 		jumpForce = baseJumpForce*(1+(difficultyMultiplier-1)/2);
		obstacleSpeed = baseObstacleSpeed*difficultyMultiplier;
	if (difficultyMultiplier < 2 && player != null) {
		difficultyMultiplier+=0.0001;
	} else {
		if (player == null) {
			if (difficultyMultiplier-slowSpeed > 0) {
				difficultyMultiplier-=slowSpeed;
			} else {
				difficultyMultiplier = 0;
			}
		}
	}
}

function keyDownActions() {
	if (keyDown[1] && !keyDown[3]) {
		if (abs(player.velX) < accelMax) {
			player.velX-=accelRate;
		}
	} else if (keyDown[3] && !keyDown[1]) {
		if (abs(player.velX) < accelMax) {
			player.velX+=accelRate;
		}
	} else {
		if (abs(player.velX) > 0) {
			player.velX-=(player.velX/abs(player.velX)*accelRate);
		} else {
			player.velX = 0;
		}
	}
	if (abs(player.velX) < accelRate) {
		player.velX = 0;
	}
	if (keyDown[4] && player.onGround) {
		player.velY = jumpForce;
		player.onGround = false;
		player.color = randomColor();
	}
}

var keyDown = [];
function input() {
	if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
		keyDown[0] = true;
	} else {
		keyDown[0] = false;
	}
	if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
		keyDown[1] = true;
	} else {
		keyDown[1] = false;
	}
	if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
		keyDown[2] = true;
	} else {
		keyDown[2] = false;
	}
	if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
		keyDown[3] = true;
	} else {
		keyDown[3] = false;
	}
	
	if (keyIsDown(32)) {
		keyDown[4] = true;
	} else {
		keyDown[4] = false;
	}
}

function keyPressed(event) {
  if (event.keyCode === 70) {
		if (transitioning == false) {
    	transitioning = true;
			if (view === "main") {
				view = "side";
			} else {
				view = "main";
			}
		}
  }
}






