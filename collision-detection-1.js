var canvas = document.getElementById('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');
var circleArray = [];
var mouse = {
	x: undefined,
	y: undefined
};
var colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

const gravity = 1;
const friction = 0.91;

var maxRadius = 40;
var minRadius = 1;

// Utility Functions
function randomIntFromRange(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

function randomColor(colors) {
	return colors[Math.floor(Math.random() * colors.length)];
}

function getDistance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

// Objects
function Circle(x, y, radius, color) {
	this.x = x;
	this.y = y;
	// this.dy = dy;
	// this.dx = dx;
	this.radius = radius;
	this.color = color;

	this.draw = function() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.fillStyle = this.color;
		c.fill();
		c.stroke();
		c.closePath();
	}

	this.update = function() {
		// if(this.y + this.radius + this.dy > canvas.height) {
		// 	this.dy = -this.dy * friction;
		// } else {
		// 	this.dy += gravity;
		// }

		// if(this.x + this.radius + this.dx > canvas.width
		// 	|| this.x - this.radius < 0)
		// 	this.dx = -this.dx;

		// this.x += this.dx;
		// this.y += this.dy;

		this.draw();
	}
}

// Event Listeners
addEventListener('mousemove', function(event) {
	// console.log(event);
	mouse.x = event.x;
	mouse.y = event.y;
	// console.log(mouse);
});

addEventListener('resize', function(event) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	init();
});

addEventListener('click', function() {
	init();
});



// Implementation
var circle1, circle2;
function init() {
	circle1 = new Circle(300, 300, 100, 'black');
	circle2 = new Circle(undefined, undefined, 30, 'red');

	animate();
}

// Animate loop
function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);

	circle1.update();

	if(getDistance(circle1.x, circle1.y, mouse.x, mouse.y)
		<= (circle1.radius + circle2.radius)) {
		circle1.color = 'red';
		console.log('Collision!');
	}
	else {
		circle1.color = 'black';
		circle2.x = mouse.x;
		circle2.y = mouse.y;
	}
	
	circle2.update();
}

init();