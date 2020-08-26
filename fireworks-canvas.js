var canvas = document.getElementById('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');
var circleArray = [];
var mouse = {
	x: undefined,
	y: undefined
};
var colors = ['#C63347', '#F28363', '#FC7F81', '#FAEFC4', 'F9AE9B',
				'#792BB2', '#2E42CB', '#F75781', '#E365E4', '#FA5348'];

const gravity = 0.2;
const friction = 0.99;

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
function Particle(x, y, radius, color, velocity) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = color;
	this.velocity = velocity;
	this.opacity = 1;

	this.draw = () => {
		c.save();
		c.globalAlpha = this.opacity;
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.fillStyle = this.color;
		c.fill();
		c.closePath();
		c.restore();
	}

	this.update = particles => {
		this.draw();

		this.velocity.x *= friction;
		this.velocity.y *= friction;
		this.velocity.y += gravity;

		this.x += this.velocity.x;
		this.y += this.velocity.y;

		this.opacity -= 0.03;
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

addEventListener('click', function() {
	mouse.x = event.clientX;
	mouse.y = event.clientY;

	const particleCount = 100;
	const power = 12;
	const angleIncrement = (Math.PI * 2) / particleCount;
	
	for(var i=0 ; i<particleCount ; ++i) {
		const radius = randomIntFromRange(1, 3);
		var x = mouse.x;
		var y = mouse.y;
		var color = randomColor(colors);
		var velocity = {
			x: Math.cos(angleIncrement * i) * Math.random() * power,
			y: Math.sin(angleIncrement * i) * Math.random() * power
		}

		particles.push(new Particle(x, y, radius, color, velocity));
	}
});


// Implementation
var particles = [];
function init() {
	particles = [];
}

// Animate loop
function animate() {
	requestAnimationFrame(animate);
	c.fillStyle = 'rgba(0, 0, 0, 0.1)';
	c.fillRect(0, 0, canvas.width, canvas.height);


	particles.forEach((particle, i) => {
		if(particle.opacity > 0) {
			particle.update(particles);
		} else {
			particles.splice(i, 1);
		}
	})
}

init();
animate();