var canvas = document.getElementById('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');
var circleArray = [];
var mouse = {
	x: undefined,
	y: undefined
};

var maxRadius = 40;
var minRadius = 1;

function Circle(x, y, dx, dy, radius) {
	this.x = x;
	this.dx = dx;
	this.y = y;
	this.dy = dy;
	this.radius = radius;

	this.draw = function() {
		c.beginPath();
		c.arc(this.x + this.dx, this.y + this.dy, this.radius, 0, Math.PI * 2, false);
		if(this.radius <= 2)
			c.strokeStyle = '#1e1f26';
		else
			c.strokeStyle = 'white';
		c.stroke();
	}

	this.update = function() {
		if(this.x - this.radius < 0 || canvas.width < this.x + this.radius)
			this.dx = -this.dx;
		if(this.y - this.radius < 0 || canvas.height < this.y + this.radius)
			this.dy = -this.dy;

		this.x += this.dx;
		this.y += this.dy;

		// interacivity
		// console.log(mouse);
		// console.log(this.x, this.y, this.dx, this.dy, this.radius);
		var mouseRange = 50;
		if(mouse.x-mouseRange < this.x && this.x < mouse.x+mouseRange
			&& mouse.y-mouseRange < this.y && this.y < mouse.y+mouseRange) {
			if(this.radius < maxRadius)
				this.radius++;
		}
		else if(this.radius > minRadius)
			this.radius--;

		this.draw();
	}
}

canvas.addEventListener('mousemove', function(event) {
	// console.log(event);
	mouse.x = event.x;
	mouse.y = event.y;
	console.log(mouse);
});

window.addEventListener('resize', function(event) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	init();
});

function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);
	
	for(var i=0 ; i<circleArray.length ; ++i)
		circleArray[i].update();
}

function init() {
	circleArray = [];
	for(var i=0 ; i<window.innerWidth ; ++i) {
		var radius = 30;
		var x = Math.floor(Math.random() * window.innerWidth) - radius;
		var y = Math.floor(Math.random() * window.innerHeight) - radius;
		var dx = Math.floor((Math.random()-0.5) * 2);
		var dy = Math.floor((Math.random()-0.5) * 2);

		if(dx == 0) dx = 1;
		if(dy == 0) dy = 1;

		var circle = new Circle(x, y, dx, dy, radius);
		circleArray.push(circle);
	}

	animate();
}

init();