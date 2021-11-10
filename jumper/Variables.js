//Variables were taking up too much space.

const windowH = window.innerHeight;

const windowW = Math.round(windowH*16/9);

const ratio = windowH/500;

const blockSize = 10*ratio;

var obstacles = new p5.Table(0);

const baseAccelMax = 1.85*ratio;
var accelMax = baseAccelMax*difficultyMultiplier;

const baseAccelRate = accelMax/10;
var accelRate = baseAccelRate;

const baseGravity = 0.1*ratio;
var gravity = baseGravity*difficultyMultiplier;

const baseJumpForce = 2.5*ratio;
var jumpForce = baseJumpForce*difficultyMultiplier;

const brightness = 200;

const baseObstacleSpeed = 2;
var obstacleSpeed = baseObstacleSpeed*difficultyMultiplier;

var difficultyMultiplier = 1;

const platformWidth = 8;
const platformLength = 425;

const mainOffset = new p5.Vector(0,5,8);
const mainCamera = 0;

const sideOffset = new p5.Vector(-30,5,-30);
const sideCamera = 90;

const spawnRate = 2;

var view = "main";
var transitioning = false;

var cam;
var distance;

var player = {
	x:0,velX:0,
	y:0,velY:0,
	z:0,
	height:1,width:1,depth:1,
	onGround:true,
	color:null
}
