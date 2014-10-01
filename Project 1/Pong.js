var

WIDTH  = 700,
HEIGHT = 600,

pi = Math.PI,

UpArrow   = 38,
DownArrow = 40,

canvas,
ctx,
keystate;
var player, player_two, ball;

player = {
	x = null,
	y = null,
	width = 20,
	height = 100

	update: function() {},
	draw: function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);

	}

};
player_two = {
	x = null,
	y = null,
	width = 20,
	height = 100

	update: function() {},
	draw: function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);

	}

};
ball = {
	x = null,
	y = null,
	width = 20

	update: function() {},
	draw: function() {
		ctx.fillRect(this.x, this.y, this.width, this.width);

	}

};

function main () {
	canvas = document.createElement("canvas");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);

	init();

	var loop = function() {
		update();
		draw();

		window.requestAnimationFrame(loop, canvas);
	};
	window.requestAnimationFrame(loop, canvas);

}

function init () {
	player.x = player.width;
	player.y = (HEIGHT - player.height)/2;

	player_two.x = WIDTH - (player.width + player_two.width);
	player_two.y = (HEIGHT - player_two.height)/2;

	ball.x = (WIDTH - ball.width)/2;
	ball.y  = (HEIGHT - ball.width)/2;
}

function update () {
	ball.update();
	player.update();
	player_two.update();
}

function draw () {
	ball.draw();
	player.draw();
	player_two.draw();
}

main();