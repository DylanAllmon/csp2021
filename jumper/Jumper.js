function gameStart() {
	player.color = color(80,0,200);
	textSize(ratio*40);
	gameCam = createCamera();
	distance = gameCam.eyeZ;
	perspective(80);
	gameCam.setPosition(mainOffset.x*blockSize,-mainOffset.y*blockSize,mainOffset.z*blockSize);
}

function gameTick() {
	setCamera(gameCam);
	textSize(ratio*40);
	difficulty();
	
	input();
	if (player != null) {
		keyDownActions();
		gamePhysics();
	}
	gameRender();	
	if (transitioning) {
		gameCameraMove();
	}
	
	tickSecond();
}

function gamePhysics() {
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

function gameRender() {
	background(color(('hsl(' + floor((hue > maxHue/2 ? hue-maxHue/2 : hue+maxHue/2)*(360/maxHue)) + ',100%,90%)')));
	ambientLight(brightness);
	
	pointLight(color(255), 0,0,mainOffset.z*blockSize)
	
	push();
	let a = atan2(0+gameCam.eyeX,gameCam.eyeZ-sideOffset.z*blockSize);
	translate(0,0,sideOffset.z*blockSize);
  rotateY(a);
	fill(color(('hsl(' + floor(hue*(360/maxHue)) + ',100%,30%)')));
	text("Score: " + score, 0, -100*ratio);
	pop();
	renderPlayer();
	renderPlatform();
	renderObstacles();
}

let ticks = 100;
function tickSecond() {
	ticks++;
	leveling();
}

function leveling() {
	
	if (ticks == spawnRate/2) {
		randomObstacle(spawnZ);
	}
	if (ticks>=spawnRate) {
		if (count == 0) {
			for (let z = 20; z < spawnZ; z+=20) {
				randomObstacle(z);
			}
		}
		ticks = 0;
		randomObstacle(spawnZ);
	}
}

const spawnZ = 80;

function randomObstacle(z) {
	if (round(random(0,3)) > 0) {
		let r = round(random(-1,1));
		let e = round(random(2,5));
		if (r == 0) {
			e = round(random(4,5));
		}
		obstacle((r*4+(-r)*(e/2)),0,z,e,round(random(1,3)),1,false);
	} else {
		let location = round(random(-2,2));
		let holeSize = round(random(2,4));
		let height = round(random(1,3));
				
		let ob1Size = (platformWidth/2-holeSize/2+location/2), ob1Loc = (-platformWidth/2+ob1Size/2);
		let ob2Size = (platformWidth/2-holeSize/2-location/2), ob2Loc = (platformWidth/2+location/2-ob1Size/2);
		
		obstacle(ob1Loc,0,z,ob1Size,height,1,(ob1Size > ob2Size ? false : true));
		obstacle(ob2Loc,0,z,ob2Size,height,1,(ob2Size >= ob1Size ? false : true));
	}
}

function gameCameraMove() {
	if (view === "main") {
		//perspective(80);
		gameCam.lookAt(0, -mainOffset.y*blockSize,sideOffset.z*blockSize);
		let velX = (mainOffset.x*blockSize-gameCam.eyeX)/10;
		let velY = (-mainOffset.y*blockSize-gameCam.eyeY)/10;
		let velZ = (mainOffset.z*blockSize-gameCam.eyeZ)/10;
		
		if (dist(gameCam.eyeX,-gameCam.eyeY,gameCam.eyeZ,mainOffset.x*blockSize,mainOffset.y*blockSize,mainOffset.z*blockSize) > 0.1) {
			gameCam.setPosition(gameCam.eyeX+velX,gameCam.eyeY+velY,gameCam.eyeZ+velZ);
		} else {
			gameCam.setPosition(mainOffset.x*blockSize,-mainOffset.y*blockSize,mainOffset.z*blockSize)
			transitioning = false;
		}
	} else {
		//ortho();
		gameCam.lookAt(0, -sideOffset.y*blockSize,sideOffset.z*blockSize);
		let velX = (sideOffset.x*blockSize-gameCam.eyeX)/10;
		let velY = (-sideOffset.y*blockSize-gameCam.eyeY)/10;
		let velZ = (sideOffset.z*blockSize-gameCam.eyeZ)/10;
		
		if (dist(gameCam.eyeX,-gameCam.eyeY,gameCam.eyeZ,sideOffset.x*blockSize,sideOffset.y*blockSize,sideOffset.z*blockSize) > 0.5) {
			gameCam.setPosition(gameCam.eyeX+velX,gameCam.eyeY+velY,gameCam.eyeZ+velZ);
		} else {
			gameCam.setPosition(sideOffset.x*blockSize,-sideOffset.y*blockSize,sideOffset.z*blockSize)
			transitioning = false;
		}
		
	}
}

const slowSpeed = 0.04;
const fastSpeed = 0.00015;
const maxDif = 3;
function difficulty() {
		accelMax = baseAccelMax*difficultyMultiplier;
		accelRate = accelMax/10;
 		gravity = baseGravity*difficultyMultiplier;
 		jumpForce = baseJumpForce*(1+(difficultyMultiplier-1)/2);
		obstacleSpeed = baseObstacleSpeed*difficultyMultiplier;
		spawnRate = round(baseSpawnRate/difficultyMultiplier);
	if (difficultyMultiplier < maxDif && player != null) {
		difficultyMultiplier+=fastSpeed;
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
	if ((keyDown[4] || keyDown[0] || mouseIsPressed) && player.onGround) {
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






