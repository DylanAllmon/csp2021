function obstacle(x,y,z,w,h,d) {
	obstacles.addRow();
	obstacles.set(obstacles.getRowCount()-1,0,createVector(x*blockSize,y*blockSize,z*blockSize));
	obstacles.set(obstacles.getRowCount()-1,1,createVector(w*blockSize,h*blockSize,d*blockSize));

}

function cube(size, textures /*top[0], bottom[1], north[2], south[3], east[4], west[5]*/, location, camera) {
	translate(0,0,size[2]/2);
	push();
	if (textures[3] != null) {
		texture(textures[3]);
	}
	if ((location == null || camera == null) || camera.z > location.z+size[2]/2) {
		plane(size[0],size[1]);
	}
	pop();
	translate(0,0,-size[2]);
	push();
	if (textures[2] != null) {
		texture(textures[2]);
	}
	if ((location == null || camera == null) || camera.z < location.z-size[2]/2) {
		plane(size[0],size[1]);
	}
	pop();
	rotateX(90);
	translate(0,size[2]/2,-size[1]/2);
	push();
	if (textures[1] != null) {
		texture(textures[1]);
	}
	if ((location == null || camera == null) || camera.y > location.y-size[1]/2) {
		plane(size[0],size[2]);
	}
	pop();
	translate(0,0,size[1]);
	push();
	if (textures[0] != null) {
		texture(textures[0])
	}
	if ((location == null || camera == null) || camera.y < location.y-size[1]/2) {
		plane(size[0],size[2]);
	}
	pop();
	rotateY(90);
	translate(size[1]/2,0,size[0]/2);
	push();
	if (textures[4] != null) {
		texture(textures[4])
	}
	if ((location == null || camera == null) || camera.x > location.x+size[0]/2) {
		plane(size[1],size[2]);
	}
	pop();
	translate(0,0,-size[0]);
	push();
	if (textures[5] != null) {
		texture(textures[5]);
	}
	if ((location == null || camera == null) || camera.x < location.x-size[0]/2) {
		plane(size[1],size[2]);
	}
	pop();
	translate(0,0,size[0]/2);
	rotateY(-90);
	rotateX(-90);
}
function all(e) {
	return [e,e,e,e,e,e]
}

function randomColor() {
	return color(random(0,155),random(0,155),random(0,155));
}

let hue = 0;
const maxHue = 500;
function bg() {
	hue++;
	if (hue >= maxHue) {
		hue = 0;
	}
	background(color(('hsl(' + floor(hue*(360/maxHue)) + ',100%,90%)')));
}

function collide1D(x1,x2,x3,x4) {
	if ((x3 >= x1 && x3 <= x2) || (x1 >= x3 && x1 <= x4) || (x4 >= x1 && x4 <= x2) || (x2 >= x3 && x2 <= x4)) {
		return true;
	}
	return false;
}

function collide2D(x1,y1,w1,h1,x2,y2,w2,h2) {
  if (collide1D(x1-w1/2,x1+w1/2, x2-w2/2,x2+w2/2)) {
    if (collide1D(y1,y1+h1, y2,y2+h2)) {
      return true;
    }
  }
  return false;
}

function collide3D(x1,y1,z1,w1,h1,d1,x2,y2,z2,w2,h2,d2) {
	if (collide2D(x1,y1,w1,h1,x2,y2,w2,h2) && collide1D(z1,z1+d1,z2,z2+d2)) {
		return true;
	}
	return false;
}

function seconds() {
	return (round(millis()/1000));
}
