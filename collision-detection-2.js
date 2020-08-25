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
	this.velocity = {
		x: 5 * (Math.random() - 0.5),
		y: 5 * (Math.random() - 0.5)
	}
	this.radius = radius;
	this.color = color;
	this.mass = 1;
	this.opacity = 0;

	this.draw = function() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.save();
		
		c.fillStyle = this.color;
		c.globalAlpha = this.opacity;
		
		if(getDistance(this.x, this.y, mouse.x, mouse.y) < 75) {
			c.fill();
			this.opacity = Math.min(1, this.opacity + 0.1);
		} else {
			this.opacity = Math.max(0, this.opacity - 0.1);
		}
		
		c.restore();
		c.strokeStyle = this.color;
		

		c.stroke();
		c.closePath();
	}

	this.update = particles => {
		this.draw();

		for(var i=0 ; i<particles.length ; ++i) {
			if(this == particles[i]) continue;

			if(getDistance(this.x, this.y, particles[i].x, particles[i].y) < 2 * this.radius) {
				resolveCollision(this, particles[i]);
			}
		}

		if(this.x - this.radius <= 0 || canvas.width <= this.x + this.radius)
			this.velocity.x = -this.velocity.x;
		if(this.y - this.radius <= 0 || canvas.height <= this.y + this.radius)
			this.velocity.y = -this.velocity.y;
			
		this.x += this.velocity.x;
		this.y += this.velocity.y;
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
var particles = [];
function init() {
	particles = [];

	const radius = 15; //randomIntFromRange(20, 40);
	for(var i=0 ; i<canvas.width/5 ; ++i) {
		var x = randomIntFromRange(radius, canvas.width - radius);
		var y = randomIntFromRange(radius, canvas.height - radius);
		var color = randomColor(colors);

		if(i != 0) {
			for(var j=0 ; j < particles.length ; ++j) {
				if(getDistance(x, y, particles[j].x, particles[j].y) < 2 * radius) {
					x = randomIntFromRange(radius, canvas.width - radius);
					y = randomIntFromRange(radius, canvas.height - radius);

					j = -1;
				}
			}
		}

		particles.push(new Particle(x, y, radius, color));
	}

}

// Animate loop
function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);

	particles.forEach(Particle => {
		Particle.update(particles);
	})
}

init();
animate();