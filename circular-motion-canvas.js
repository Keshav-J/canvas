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
function Particle(x, y, radius, color) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = color;
	this.radians = Math.random() * Math.PI * 2;
	this.velocity = 0.05;
	this.distanceFromCenter = randomIntFromRange(50, 120);
	this.lastMouse = {x: x, y: y};

	this.draw = lastPoint => {
		c.beginPath();
		c.strokeStyle = this.color;
		c.lineWidth = this.radius;
		c.moveTo(lastPoint.x, lastPoint.y);
		c.lineTo(this.x, this.y);
		c.stroke();
		c.closePath();
	}

	this.update = particles => {
		const lastPoint = {
			x: this.x,
			y: this.y
		}

		// Move points over time
		this.radians += this.velocity;

		// Drag Effect
		this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
		this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;

		// Circular Motion
		this.x = mouse.x + Math.cos(this.radians) * this.distanceFromCenter;
		this.y = mouse.y + Math.sin(this.radians) * this.distanceFromCenter;

		this.draw(lastPoint);
	}
}

// Event Listeners
addEventListener('mousemove', function(event) {
	mouse.x = event.x;
	mouse.y = event.y;
});

addEventListener('resize', function(event) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	init();
});

// addEventListener('click', function() {
// 	init();
// });


// Implementation
var particles = [];
function init() {
	particles = [];

	for(var i=0 ; i<50 ; ++i) {
		const radius = randomIntFromRange(1, 3);
		var x = canvas.width/2; // randomIntFromRange(radius, canvas.width - radius);
		var y = canvas.height/2; // randomIntFromRange(radius, canvas.height - radius);
		var color = randomColor(colors);

		particles.push(new Particle(x, y, radius, color));
	}

}

// Animate loop
function animate() {
	requestAnimationFrame(animate);
	c.fillStyle = 'rgba(30, 31, 35, 0.1)';
	c.fillRect(0, 0, canvas.width, canvas.height);


	particles.forEach(Particle => {
		Particle.update(particles);
	})
}

init();
animate();