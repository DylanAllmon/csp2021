function menuStart() {
	textSize(ratio*8);
	menuTransition = false;
	menuCam = createCamera();
}

let menuCam;

let menuTransition = false;

function menuTick() {
	menuRender();
}

let e = 30;
let quad = -1;
function menuRender() {
	setCamera(menuCam);
	background(color(('hsl(' + floor(hue*(360/maxHue)) + ',100%,80%)')));
	
	push();
	translate(0,0,-15*blockSize);
	rotateX(frameCount*0.7);
  rotateY(frameCount*0.7);
	
	let size;
	if (!menuTransition) {
		size = 35;
		if (mouseIsPressed) {
			size = 30;
		}
		fill(color(('hsl(' + floor((hue > maxHue/2 ? hue-maxHue/2 : hue+maxHue/2)*(360/maxHue)) + ',100%,30%)')));
		box(size*blockSize,size*blockSize,size*blockSize);
	} else {
		if (e < 75) {
			quad+=0.5;
			e+=quad/10;
			size = e;
			fill(color(('hsl(' + floor((hue > maxHue/2 ? hue-maxHue/2 : hue+maxHue/2)*(360/maxHue)) + ',100%,' + round((e-30)*(4/3)+30) + '%)')));
			box(size*blockSize,size*blockSize,size*blockSize);
		} else {
			background(color(('hsl(' + floor((hue > maxHue/2 ? hue-maxHue/2 : hue+maxHue/2)*(360/maxHue)) + ',100%,' + round((e-30)*(4/3)+30) + '%)')));
			if (round((e-30)*(4/3)+30) == 90) {
				switchState("game");
			}
		}
	}
	pop();
	fill(255);
	translate(0,0,38*blockSize);
	text("Jumper", 0, 0);
}

function mouseReleased() {
	menuTransition = true;
}

















