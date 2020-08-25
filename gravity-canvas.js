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

// Objects
function Ball(x, y, dx, dy, radius, color) {
	this.x = x;
	this.y = y;
	this.dy = dy;
	this.dx = dx;
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
		if(this.y + this.radius + this.dy > canvas.height) {
			this.dy = -this.dy * friction;
		} else {
			this.dy += gravity;
		}

		if(this.x + this.radius + this.dx > canvas.width
			|| this.x - this.radius < 0)
			this.dx = -this.dx;

		this.x += this.dx;
		this.y += this.dy;

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
var ball;
var ballArray = [];
function init() {
	ballArray = [];
	var radius = 30;
	for(var i=0 ; i<50 ; ++i) {
		var x = randomIntFromRange(radius, canvas.width - radius);
		var y = randomIntFromRange(radius, canvas.height - radius);
		var dx = randomIntFromRange(-4, 4);
		var dy = randomIntFromRange(-2, 2);
		var color = randomColor(colors);
		ballArray.push(new Ball(x, y, dx, dy, 30, color));
	}
	// console.log(ballArray);

	animate();
}

// Animate loop
function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);

	for(var i=0 ; i<ballArray.length ; ++i) {
		ballArray[i].update();
	}
}

init();