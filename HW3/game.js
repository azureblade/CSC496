// NOTE: I have added an additional powerup called bomb.
// This will destroy all enemies missiles and powerups on the board
// in front of the player.
// You are given 1 bomb as my gift to you as I have set the bomb 
// drops to be pretty low.
//I will admit the hit detection for the bomb is weird, and I think
//it has something to do with what frame the game is on.

var sprites = {
 ship: { 
    sx: 0,
    sy: 0,
    w: 37,
    h: 42,
    frames: 1
    },
 missile: { 
    sx: 0,
    sy: 42,
    w: 6,
    h: 20,
    frames: 1
    },
 enemy_purple: { 
    sx: 74,
    sy: 0,
    w: 42,
    h: 43,
    frames: 1
    },
 enemy_bee: {
    sx: 118,
    sy: 0,
    w: 37,
    h: 43,
    frames: 1
    },
 enemy_ship: {
    sx: 154,
    sy: 0,
    w: 42,
    h: 43,
    frames: 1
    },
 enemy_circle: {
    sx: 195,
    sy: 0,
    w: 32,
    h: 33,
    frames: 1
    },
 enemy_line: {
    sx: 154,
    sy: 0,
    w: 42,
    h: 43,
    frames: 1
 },
 explosion: { 
    sx: 0,
    sy: 64,
    w: 64,
    h: 64,
    frames: 12
    },
 enemy_missile: { 
    sx: 9,
    sy: 42,
    w: 3,
    h: 20, 
    frame: 1
    },
  star_powerup: {
    sx: 33,
    sy: 46,
    w: 20,
    h: 20,
    frame: 1,
    },
 poison_pill: {
    sx: 12,
    sy: 46,
    w: 20,
    h: 20,
    frame: 1,
    },
 bomb_: {
    sx: 80,
    sy: 0,
    w: 20,
    h: 20,
    frame: 1,
    },
 bomb_wave: {
    sx: 130,
    sy: 0,
    w: 1000,
    h: 5,
    frame: 1
 }
};

var enemies = {
    straight: {
        x: 0,
        y: -50,
        sprite: 'enemy_ship',
        health: 10,
        E: 100
    },
    ltr: {
        x: 0,
        y: -100,
        sprite: 'enemy_purple',
        health: 10,
        B: 75,
        C: 1,
        E: 100,
        missiles: 2
    },
    circle: {
        x: 250,
        y: -50,
        sprite: 'enemy_circle',
        health: 10,
        A: 0,
        B: -100,
        C: 1,
        E: 20,
        F: 100,
        G: 1,
        H: Math.PI / 2
    },
    wiggle: {
        x: 100,
        y: -50,
        sprite: 'enemy_bee',
        health: 20,
        B: 50,
        C: 4,
        E: 100,
        firePercentage: 0.001,
        missiles: 2
    },
    step: {
        x: 0,
        y: -50,
        sprite: 'enemy_circle',
        health: 10,
        B: 150,
        C: 1.2,
        E: 75
    },
    line: {
        x: 40,
        y: 50,
        sprite: 'enemy_line',
        health: 10,
        A: 50,
        B: 25
    }
};

var OBJECT_PLAYER = 1,
    OBJECT_PLAYER_PROJECTILE = 2,
    OBJECT_ENEMY = 4,
    OBJECT_ENEMY_PROJECTILE = 8,
    OBJECT_POWERUP = 16;

var startGame = function () {
    Game.setBoard(0, new Starfield(20, 0.4, 100, true));
    Game.setBoard(1, new Starfield(50, 0.6, 100));
    Game.setBoard(2, new Starfield(100, 1.0, 50));
    Game.setBoard(3, new TitleScreen('Alien Invasion', 'fire', 'Press fire to start playing', playGame, 'Matthew Wallace'));
};

var levels = {
    1: [
        // Start,   End, Gap,  Type,   Override
        [ 0,      4000,  500, 'step' ],
        [ 6000,   13000, 800, 'ltr' ],
        [ 10000,  16000, 400, 'circle' ],
        [ 12000,  17000, 1000, 'line' ],
        [ 17800,  20000, 500, 'straight', { x: 50 } ],
        [ 18200,  20000, 500, 'straight', { x: 90 } ],
        [ 18200,  20000, 500, 'straight', { x: 10 } ],
        [ 22000,  25000, 400, 'wiggle', { x: 150 }],
        [ 22000,  25000, 400, 'wiggle', { x: 100 }]
    ],
    2: [
        [ 0, 5000, 800, 'straight', { x: 25 } ],
        [ 6000,   13000, 800, 'ltr' ],
        [ 1000, 6000, 800, 'straight', { x: 250 } ],
        [ 6000, 14000, 400, 'circle', { x: 150 }],
        [ 14000, 16000, 1000, 'line' ],
        [ 16000, 20000, 600, 'wiggle' ],
        [ 22000, 25000, 300, 'straight', { x: 200 }] 
    ]
   
};

var invulnerability;
var bomb_count;

var playGame = function () {
    var board = new GameBoard();
    board.add(new PlayerShip());
    board.add(new PlayerShipTwo());
    board.add(new Level(levels, winGame));
    Game.setBoard(3, board);
    Game.setBoard(4, new GamePoints(0));
    Game.setBoard(5, new LevelCounter());
    Game.setBoard(6, new BombCounter(0))
    Game.shipCount = 2;
    Game.bomb_counter =1;
    invulnerability = 0;
    bomb_count = 1;
};

/*
I added a listener for the enter button rather than the fire button.
This way even if the player rapidly hits the fire button the game will not
advance after it has been run once.
*/
var winGame = function () {
    Game.setBoard(3, new TitleScreen('You win!', 'restart', 'Press enter to play again', playGame));
};

var loseGame = function () {
    Game.setBoard(3, new TitleScreen('You lose!', 'restart', 'Press enter to play again', playGame));
};

window.addEventListener ('load', function () {
    Game.initialize('game', sprites, startGame);
});

var Starfield = function (speed, opacity, numStars, clear) {

    var stars = document.createElement('canvas');
    stars.width = Game.width; 
    stars.height = Game.height;
    var starCtx = stars.getContext('2d');

    var offset = 0;

    if (clear) {
        starCtx.fillStyle = '#000';
        starCtx.fillRect(0, 0, stars.width, stars.height);
    }

    starCtx.fillStyle = '#fff';
    starCtx.globalAlpha = opacity;
    for (var i = 0; i < numStars; i++) {
        starCtx.fillRect(Math.floor(Math.random() * stars.width), Math.floor(Math.random() * stars.height), 2, 2);
    }

    this.draw = function (ctx) {
        var intOffset = Math.floor(offset);
        var remaining = stars.height - intOffset;

        if (intOffset > 0) {
            ctx.drawImage(stars, 0, remaining, stars.width, intOffset, 0, 0, stars.width, intOffset);
        }

        if (remaining > 0) {
            ctx.drawImage(stars, 0, 0, stars.width, remaining, 0, intOffset, stars.width, remaining);
        }
    };

    this.step = function (dt) {
        offset += dt * speed;
        offset = offset % stars.height;
    };
};

var PlayerShip = function () { 
    this.setup('ship', {
        vx: 0,
        reloadTime: 0.25,
        maxVel: 200
    });

    this.reload = this.reloadTime;
    this.x = Game.width / 2 - this.w / 2 + 20;
    this.y = Game.height - Game.playerOffset - this.h;

    this.step = function (dt) {
        if (Game.keys['left']) {
            this.vx = -this.maxVel;
        } else if (Game.keys['right']) {
            this.vx = this.maxVel;
        } else {
            this.vx = 0;
        }

        if (Game.keys['up']) {
            this.vy = -this.maxVel;
        } else if (Game.keys['down']) {
            this.vy = this.maxVel;
        } else {
            this.vy = 0;
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        if (this.x < 0) {
            this.x = 0;
        } else if (this.x > Game.width - this.w) { 
            this.x = Game.width - this.w;
        }

        if (this.y < 0) {
            this.y = 0;
        } else if (this.y > Game.height - this.h) {
            this.y = Game.height - this.h;
        }

        this.reload -= dt;
        if (Game.keys['fire'] && this.reload < 0) {
            Game.keys['fire'] = false;
            this.reload = this.reloadTime;

            this.board.add(new PlayerMissile(this.x, this.y + this.h / 2));
            this.board.add(new PlayerMissile(this.x + this.w, this.y + this.h / 2));
        }

        if (Game.keys['bomb'] && bomb_count > 0) {
            Game.keys['bomb'] = false;
            this.board.add(new PlayerBomb(this.x + this.w, this.y + this.h / 2));
            this.board.add(new PlayerBomb(this.x + this.w, this.y - this.h / 2));
            bomb_count--;
            Game.bomb_counter--;
        }

        if (invulnerability > 0) {
            this.frame = 1;

            var collision = this.board.collide(this, OBJECT_ENEMY);

            if (collision) {
                this.board.add(new Explosion(collision.x + collision.w / 2, collision.y + collision.h / 2));
            }

            invulnerability--;
        } else {
            this.frame = 0;
        }
    };
};

var PlayerShipTwo = function () { 
    this.setup('ship', {
        vx: 0,
        reloadTime: 0.25,
        maxVel: 200
    });

    this.reload = this.reloadTime;
    this.x = Game.width / 2 - this.w / 2 - 20;
    this.y = Game.height - Game.playerOffset - this.h;

    this.step = function (dt) {
        if (Game.keys['two_left']) {
            this.vx = -this.maxVel;
        } else if (Game.keys['two_right']) {
            this.vx = this.maxVel;
        } else {
            this.vx = 0;
        }

        this.x += this.vx * dt;

        if (this.x < 0) {
            this.x = 0;
        } else if (this.x > Game.width - this.w) { 
            this.x = Game.width - this.w;
        }

        this.reload -= dt;
        if (Game.keys['two_fire'] && this.reload < 0) {
            Game.keys['two_fire'] = false;
            this.reload = this.reloadTime;

            this.board.add(new PlayerMissile(this.x, this.y + this.h / 2));
            this.board.add(new PlayerMissile(this.x + this.w, this.y + this.h / 2));
        }

        if (invulnerability > 0) {
            this.frame = 1;

            var collision = this.board.collide(this, OBJECT_ENEMY);

            if (collision) {
                this.board.add(new Explosion(collision.x + collision.w / 2, collision.y + collision.h / 2));
            }
            
            invulnerability--;
        } else {
            this.frame = 0;
        }
    };
};

PlayerShip.prototype = new Sprite();
PlayerShip.prototype.type = OBJECT_PLAYER;

PlayerShip.prototype.hit = function (damage) {
    if (invulnerability > 0) {
        return;
    }

    if (this.board.remove(this)) {
        this.board.add(new Explosion(this.x + this.w / 2, this.y + this.h / 2));

        if (--Game.shipCount === 0) {
            loseGame();
        }
    }
};

PlayerShipTwo.prototype = new Sprite();
PlayerShipTwo.prototype.type = OBJECT_PLAYER;

PlayerShipTwo.prototype.hit = function (damage) {
    if (invulnerability > 0) {
        return;
    }

    if (this.board.remove(this)) {
        this.board.add(new Explosion(this.x + this.w / 2, this.y + this.h / 2));

        if (--Game.shipCount === 0) {
            loseGame();
        }
    }
};

var PlayerMissile = function (x, y) {
    this.setup('missile', {
        vy: -700,
        damage: 10
    });
    this.x = x - this.w / 2;
    this.y = y - this.h; 
};

PlayerMissile.prototype = new Sprite();
PlayerMissile.prototype.type = OBJECT_PLAYER_PROJECTILE;

PlayerMissile.prototype.step = function (dt)  {
    this.y += this.vy * dt;
    var collision = this.board.collide(this, OBJECT_ENEMY);
    if (collision) {
        collision.hit(this.damage);
        this.board.remove(this);
    } else if (this.y < -this.h) {
        this.board.remove(this);
    }
};

var PlayerBomb = function (x, y) {
    this.setup('bomb_wave', {
        vy: -700,
        damage: 100
    });
    this.x = x - this.w / 2;
    this.y = y - this.h; 
};

PlayerBomb.prototype = new Sprite();
PlayerBomb.prototype.type = OBJECT_PLAYER_PROJECTILE;

PlayerBomb.prototype.step = function (dt)  {
    this.y += this.vy * dt;
    var collision = this.board.collide(this, OBJECT_ENEMY | OBJECT_ENEMY_PROJECTILE | OBJECT_POWERUP);
    if (collision) {
        collision.hit(this.damage);
    } else if (this.y < -this.h) {
        this.board.remove(this);
    }
};

var Enemy = function (blueprint, override) {
    this.merge(this.baseParameters);
    this.setup(blueprint.sprite,blueprint);
    this.merge(override);
};

Enemy.prototype = new Sprite();
Enemy.prototype.type = OBJECT_ENEMY;

Enemy.prototype.baseParameters = {
    A: 0,
    B: 0,
    C: 0,
    D: 0, 
    E: 0,
    F: 0,
    G: 0,
    H: 0,
    t: 0,
    reloadTime: 0.75, 
    reload: 0
};

Enemy.prototype.step = function (dt) {
    this.t += dt;

    this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
    this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    var collision = this.board.collide(this, OBJECT_PLAYER);
    if (collision) {
        collision.hit(this.damage);
        this.board.remove(this);
    }

    if (this.reload <= 0 && Math.random() < (this.firePercentage || 0.01) ) {
        this.reload = this.reloadTime;
        if (this.missiles == 2) {
            this.board.add(new EnemyMissile(this.x + this.w - 2, this.y + this.h / 2));
            this.board.add(new EnemyMissile(this.x + 2, this.y + this.h / 2));
        } else {
            this.board.add(new EnemyMissile(this.x + this.w / 2, this.y + this.h));
        }

    }
    this.reload -= dt;

    if (this.x < -this.w || this.x > Game.width) {
        this.board.remove(this);
    } else if (this.y > Game.height) {
        loseGame();
    }
};

Enemy.prototype.hit = function (damage) {
    this.health -= damage;
    if (this.health <= 0) {
        if (this.board.remove(this)) {
            Game.points += this.points || 100;
            this.board.add(new Explosion(this.x + this.w / 2, this.y + this.h / 2));
        }
    }
};

var EnemyMissile = function (x, y) {
    this.setup('enemy_missile', {
        vy: 200,
        damage: 10
    });
    this.x = x - this.w / 2;
    this.y = y;
};

EnemyMissile.prototype = new Sprite();
EnemyMissile.prototype.type = OBJECT_ENEMY_PROJECTILE;

EnemyMissile.prototype.step = function (dt)  {
    this.y += this.vy * dt;
    var collision = this.board.collide(this, OBJECT_PLAYER)
    if (collision) {
        collision.hit(this.damage);
        this.board.remove(this);
    } else if (this.y > Game.height) {
        this.board.remove(this); 
    }
};

var StarPowerup = function () {
    this.setup('star_powerup', {
        vy: 75,
        maxVel: 200,
        y: 0
    });

    this.x = Math.floor(Math.random() * (Game.width - this.w)) + 0;

    this.step = function (dt) {
        this.y += this.vy * dt;

        var collision = this.board.collide(this, OBJECT_PLAYER);

        if (collision) {
            invulnerability = 5 * 30;
            this.board.remove(this);
        } else if (this.y > Game.height) {
            this.board.remove(this);
        }
    }
}

StarPowerup.prototype = new Sprite();
StarPowerup.prototype.type = OBJECT_POWERUP;

var PoisonPill = function () {
    this.setup('poison_pill', {
        vy: 150,
        maxVel: 200,
        y: 0,
        damage: 100
    });

    this.x = Math.floor(Math.random() * (Game.width - this.w)) + 0;

    this.step = function (dt) {
        this.y += this.vy * dt;

        var collision = this.board.collide(this, OBJECT_PLAYER | OBJECT_ENEMY);

        if (collision) {
            collision.hit(this.damage);
            this.board.remove(this);
        } else if (this.y > Game.height) {
            this.board.remove(this); 
        }
    }
}

PoisonPill.prototype = new Sprite();
PoisonPill.prototype.type = OBJECT_POWERUP;

var Bomb = function (){
    this.setup('bomb_', {
        vy: 200,
        maxVel: 250,
        y: 0
    });
    
        this.x = Math.floor(Math.random() * (Game.width - this.w)) + 0;

    this.step = function (dt) {
        this.y += this.vy * dt;

        var collision = this.board.collide(this, OBJECT_PLAYER);

        if (collision) {
            bomb_count ++;
            Game.bomb_counter ++;
            this.board.remove(this);
        } else if (this.y > Game.height) {
            this.board.remove(this);
        }
    }
}

Bomb.prototype = new Sprite();
Bomb.prototype.type = OBJECT_POWERUP;

var Explosion = function (centerX, centerY) {
    this.setup('explosion', {
        frame: 0
    });
    this.x = centerX - this.w / 2;
    this.y = centerY - this.h / 2;
};

Explosion.prototype = new Sprite();

Explosion.prototype.step = function (dt) {
    this.frame++;
    if (this.frame >= 12) {
        this.board.remove(this);
    }
};
