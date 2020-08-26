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

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
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