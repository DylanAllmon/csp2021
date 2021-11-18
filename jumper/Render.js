function renderPlayer() {
	if (player != null) {
		push();
		ambientLight(255);
		translate(player.x,-player.y-player.height/2*blockSize,player.z);
		stroke(color(('hsl(' + floor(hue*(360/maxHue)) + ',100%,90%)')));
		noFill();
		strokeWeight(1*ratio);
		box(player.width*blockSize,player.height*blockSize,player.depth*blockSize);
		strokeWeight(0);
		fill(player.color);
		cube([player.width*blockSize,player.height*blockSize,player.depth*blockSize], all(null), createVector(player.x,player.y,player.z), createVector(cam.eyeX,cam.eyeY,cam.eyeZ));
		ambientLight(brightness);
		pop();
	}
}

function renderPlatform() {
	push();
	translate(0,1*blockSize/2,mainOffset.z*3*blockSize-platformLength/2*blockSize);
	//rotateX(90);
	fill(100);
	//plane(platformWidth*blockSize, platformLength*blockSize);
	cube([platformWidth*blockSize, 1*blockSize, platformLength*blockSize], all(null), null, null);
	//rotateX(-90);
	fill(0);
	translate(0,0,-platformLength*blockSize/2);
	//sphere(platformWidth/2*blockSize);
	pop();
}

function renderObstacles() {
	push();
	fill(255,0,0);
	for (let i = 0; i < obstacles.getRowCount(); i++) {
		let loc = obstacles.get(i,0);
		if (loc != null) {
			let size = obstacles.get(i,1);
			push();
			translate(loc.x,loc.y-size.y/2,-loc.z);
			cube([size.x,size.y,size.z],all(null), createVector(loc.x,-loc.y,-loc.z), createVector(cam.eyeX,cam.eyeY,cam.eyeZ));
			if (obstacles.get(i,2) % 10 == 0 || obstacles.get(i,2) % 25 == 0) {
				fill(255,255,255);
				translate(0,-size.y/8,blockSize/2+1);
				textSize((size.x < size.y ? size.x : size.y));
				text(obstacles.get(i,2), 0, 0);
			}
			pop();
			
			loc.z-=obstacleSpeed;
			if (player != null && collide3D(player.x,player.y,player.z,player.width*blockSize,player.height*blockSize,player.depth*blockSize,loc.x,loc.y,loc.z,size.x,size.y,size.z)) {
				player = null;
			}
						
			if (loc.z < playerZ && !obstacles.get(i,3) && player != null) {
				score++;
				obstacles.set(i,3,true);
			}
			
			if (loc.z < -mainOffset.z*3*blockSize) {
				obstacles.set(i,0,null);
			}
		}
	}
	pop();
}
