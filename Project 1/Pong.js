var WIDTH  = 700, HEIGHT = 600,

pi = Math.PI,

UPQ   = 81,
DownA = 65,
UpP = 80,
DownL = 76;

var canvas, ctx, keystate;
var player, player_two, ball;

player = {
	x: null,
	y: null,
	width: 20,
	height: 100,

	update: function() {
		if (keystate[UPQ]) this.y -= 7;
		if (keystate[DownA]) this.y += 7;
		this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0);
	},
	draw: function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
};

player_two = {
	x: null,
	y: null,
	width: 20,
	height: 100,

	update: function() {
		if (keystate[UpP]) this.y -= 7;
		if (keystate[DownL]) this.y += 7;
		this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0);
	},
	draw: function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);

	}
};

ball = {
	x: null,
	y: null,
	vel: null,
	width: 20,
	speed: 5,
	
	serve: function() {
		var r = Math.random() < 0.5 ? -1 : 1;
		return r;
	},

	update: function() {
		this.x += this.vel.x;
		this.y += this.vel.y;
		
		if (0 > this.y || this.y+this.width > HEIGHT) {
			var offset = this.vel.y < 0 ? 0 - this.y : HEIGHT - (this.y + this.width);
			this.y += 2*offset;
			this.vel.y *= -1;
		}

		var Intersect = function(ax, ay, aw, ah, bx, by, bw, bh) {
			return ax < bx+bw && ay < by+bh && bx < ax+aw && by < ay+ah;
		};

		var paddle = this.vel.x < 0 ? player : player_two;
		if(Intersect(paddle.x, paddle.y, paddle.width, paddle.height,
			this.x, this.y, this.width, this.width)
			) {
			this.x = paddle === player ? player.x + player.width : player_two.x - this.width;
		var s = (this.y+this.width - paddle.y)/(paddle.height+this.width);
		var phi = 0.25*pi*(2*s - 1);
		this.vel.x = (paddle === player ? 1 : -1) * this.speed*Math.cos(phi);
		this.vel.y = this.speed*Math.sin(phi);
		if (ball.speed < 25) ball.speed++;
	}

	if (this.x+this.width < 0 || this.x > WIDTH) {
		if(this.x+this.width < 0) Score.increment_p2();				
		if(this.x > WIDTH) Score.increment_p1();
		ball.speed = 5;


		ball.x = (WIDTH - ball.width)/2;
		ball.y  = (HEIGHT - ball.width)/2;

		ball.vel = {
			x: ball.serve()*ball.speed,
			y: 0
		}
	}
},

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

	keystate = {};
	document.addEventListener("keydown", function(evt) {
		keystate[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt) {
		delete keystate[evt.keyCode];
	});

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

	ball.vel = {
		x: ball.speed,
		y: 0
	}
}

function update () {
	ball.update();
	player.update();
	player_two.update();
}

function draw () {
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
	
	ctx.save();
	ctx.fillStyle = "#fff"

	ball.draw();
	player.draw();
	player_two.draw();
	
	var w = 4;
	var x = (WIDTH - w)*0.5;
	var y = 0;
	var step = HEIGHT/15;
	while (y < HEIGHT) {
		ctx.fillRect(x, y+step*0.25, w, step*0.5);
		y += step;
	}

	//Score text and boxes
	ctx.beginPath();
	ctx.fillRect(0, 0, 0, 0);
	ctx.strokeStyle="white";

	ctx.rect(WIDTH/2 - 80, HEIGHT/4 - 140, 45, 45);
	var off = Score.p1 >= 10 ? 77 : 70;
	ctx.font = Score.p1 >= 10 ? "bold 29px bangers" : "bold 35px bangers";
	ctx.fillText(Score.p1, WIDTH/2 - off, HEIGHT/4 - 105); 		
	
	ctx.rect(WIDTH/2 + 35, HEIGHT/4 - 140, 45, 45);
	off = Score.p2 >= 10 ? 38 : 45;
	ctx.font = Score.p2 >= 10 ? "bold 29px bangers" : "bold 35px bangers";
	ctx.fillText(Score.p2, WIDTH/2 + off, HEIGHT/4 - 105); 		
	
	ctx.stroke();
	ctx.restore();	
}

var Score = new function(){
	this.p1 = 0;
	this.p2 = 0;

	this.increment_p1 = function() {
		this.p1++;
	}

	this.increment_p2 = function() {
		this.p2++;
	}
}

main();