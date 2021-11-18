function setup() {
	createCanvas(windowW, windowH, WEBGL);
	textFont(font);
  	textSize(ratio*40);
  	textAlign(CENTER, CENTER);
	player.color = color(80,0,200);
	angleMode(DEGREES);
	obstacles.addColumn();
	obstacles.addColumn();
	obstacles.addColumn();
	obstacles.addColumn();
	cam = createCamera();
	distance = cam.eyeZ;
	perspective(80);
	cam.setPosition(mainOffset.x*blockSize,-mainOffset.y*blockSize,mainOffset.z*blockSize);
	
	txtr = createGraphics(blockSize,blockSize);
	
	strokeWeight(0);
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
	let e = hue+maxHue/2;
	
	if (e > maxHue) {
		e-=maxHue;
	}
	push();
	let a = atan2(0+cam.eyeX,cam.eyeZ-sideOffset.z*blockSize);
	translate(0,0,sideOffset.z*blockSize);
  rotateY(a);
	fill(color(('hsl(' + floor(e*(360/maxHue)) + ',100%,30%)')));
	text("Score: " + score, 0, -100*ratio);
	pop();
	renderPlayer();
	renderPlatform();
	renderObstacles();
}

let ticks = 0;
function tickSecond() {
	ticks++;
	leveling();
}

function leveling() {
	if (ticks == spawnRate/2) {
		let r = round(random(-1,1));
		let e = round(random(1,5));
		if (r == 0) {
			e = round(random(4,5));
		}
		obstacle((r*4+(-r)*(e/2)),0,40,e,round(random(1,3)),1,count);
	}
	if (ticks>=spawnRate) {
		ticks = 0;
		let e = round(random(1,5));
		let r = round(random(-1,1));
		if (r == 0) {
			e = round(random(4,5));
		}
		obstacle((r*4+(-r)*(e/2)),0,40,e,round(random(1,3)),1,count);
	}
}

function cameraMove() {
	if (view === "main") {
		//perspective(80);
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
		//ortho();
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
		spawnRate = round(baseSpawnRate/difficultyMultiplier);
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
	if (player === null) {
		resetVars();
		setup();
		return;
	}
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






