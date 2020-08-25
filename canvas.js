var canvas = document.getElementById('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');


// for(var i=0 ; i<100 ; ++i) {
// 	var x = Math.floor(Math.random() * window.innerWidth);
// 	var y = Math.floor(Math.random() * window.innerHeight);
// 	c.beginPath();
// 	c.arc(x, y, 30, 0, Math.PI * 2, false);
// 	c.strokeStyle = 'white';
// 	c.strokeWidth = 20;
// 	c.stroke();
// }

var x = 200;
var dx = 5;
var y = 200;
var dy = 4;
var radius = 30;
function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);

	c.beginPath();
	c.arc(x+dx, y+dy, radius, 0, Math.PI * 2, false);
	c.strokeStyle = 'white';
	c.strokeWidth = 20;
	c.stroke();

	if(x - radius < 0 || canvas.width < x + radius)
		dx = -dx;
	if(y - radius < 0 || canvas.height < y + radius)
		dy = -dy;

	x += dx;
	y += dy;
}

animate();