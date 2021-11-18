//Variables were taking up too much space.

let txtr = null;

var score = 0;

var count = 0;

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

const baseObstacleSpeed = 2.5*ratio;
var obstacleSpeed = baseObstacleSpeed*difficultyMultiplier;

var difficultyMultiplier = 1;

const platformWidth = 8;
const platformLength = 425;

const mainOffset = new p5.Vector(0,7,10);
const mainCamera = 0;

const sideOffset = new p5.Vector(-30,5,-30);
const sideCamera = 90;

const baseSpawnRate = 100;
var spawnRate = baseSpawnRate/difficultyMultiplier;

var view = "main";
var transitioning = false;

var cam;
var distance;

const playerZ = 0;
var player = {
	x:0,velX:0,
	y:0,velY:0,
	z:0,
	height:1,width:1,depth:1,
	onGround:true,
	color:null
}

function resetVars() {
	score = 0;
	count = 0;
	
	ticks = 0;

	obstacles = new p5.Table(0);

	accelMax = baseAccelMax*difficultyMultiplier;

	accelRate = baseAccelRate;

	gravity = baseGravity*difficultyMultiplier;

	jumpForce = baseJumpForce*difficultyMultiplier;

	obstacleSpeed = baseObstacleSpeed*difficultyMultiplier;

	difficultyMultiplier = 1;
	
	view = "main";
	transitioning = false;
	
	cam = null;
	distance = null;
	
	player = {
		x:0,velX:0,
		y:0,velY:0,
		z:0,
		height:1,width:1,depth:1,
		onGround:true,
		color:null
	}
}

let pizza;
let font;
function preload() {
	pizza = loadImage("b05a0af72ad845f3a6abe16143d7853a.jpg");
	font = loadFont("Font.ttf");
}
