var Game = new function() {
    var boards = [];

    this.initialize = function (canvasElementId,sprite_data,callback) {
        this.canvas = document.getElementById(canvasElementId);

        this.playerOffset = 10;

        this.width = this.canvas.width;
        this.height= this.canvas.height;

        this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
        if (!this.ctx) {
            return alert("Please upgrade your browser to play");
        }

        this.setupInput();

        this.loop();

        SpriteSheet.load(sprite_data, callback);
    };

    var KEY_CODES = {
        38: 'up',
        40: 'down',
        37: 'left',
        39: 'right',
        32: 'fire',
        13: 'restart',
        65: 'two_left',
        68: 'two_right',
        83: 'two_fire',
        86: 'bomb'
    };

    this.keys = {};

    this.setupInput = function () {
        window.addEventListener('keydown', function (e) {
            if (KEY_CODES[e.keyCode]) {
                Game.keys[KEY_CODES[e.keyCode]] = true;
                e.preventDefault();
            }
        }, false);

        window.addEventListener('keyup', function (e) {
            if (KEY_CODES[e.keyCode]) {
                Game.keys[KEY_CODES[e.keyCode]] = false;
                e.preventDefault();
            }
        }, false);
    };

    this.loop = function () {
        var dt = 30 / 1000;
        setTimeout(Game.loop, 30);

        for (var i = 0, len = boards.length; i < len; i++) {
            if (boards[i]) {
                boards[i].step(dt);
                boards[i].draw(Game.ctx);
            }
        }
    };

    this.setBoard = function (num, board) {
        boards[num] = board;
    };

    return this;
};


var SpriteSheet = new function () {
    this.map = {}; 

    this.load = function (spriteData, callback) {
        this.map = spriteData;
        this.image = new Image();
        this.image.onload = callback;
        this.image.src = 'images/sprites.png';
    };

    this.draw = function (ctx, sprite, x, y, frame) {
        var s = this.map[sprite];
        if (!frame) {
            frame = 0;
        }

        ctx.drawImage(this.image, s.sx + frame * s.w, s.sy, s.w, s.h, Math.floor(x), Math.floor(y), s.w, s.h);
    };

    return this;
};

var TitleScreen = function TitleScreen(title, key, subtitle, callback, author) {
    var up = false;

    this.step = function (dt) {
        if (!Game.keys[key]) {
            up = true;
        }

        if (up && Game.keys[key] && callback) {
            callback();
        }
    };

    this.draw = function (ctx) {
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';

        ctx.font = 'bold 40px bangers';
        ctx.fillText(title, Game.width / 2, Game.height / 2);

        ctx.font = 'bold 20px bangers';
        ctx.fillText(subtitle, Game.width / 2, Game.height / 2 + 40);

        if (author) {
            ctx.font = 'bold 15px bangers';
            ctx.fillText(author, Game.width / 2, Game.height / 2 + 80);
        }
    };
};

var GameBoard = function() {
    var board = this;

    this.objects = [];
    this.cnt = {};

    this.add = function (obj) {
        obj.board = this;
        this.objects.push(obj);
        this.cnt[obj.type] = (this.cnt[obj.type] || 0) + 1;
        return obj;
    };

    this.remove = function (obj) {
        var idx = this.removed.indexOf(obj);
        if (idx == -1) {
            this.removed.push(obj);
            return true;
        } else {
            return false;
        }
    };

    this.resetRemoved = function () {
        this.removed = [];
    };

    this.finalizeRemoved = function () {
        for (var i = 0, len = this.removed.length; i < len; i++) {
            var idx = this.objects.indexOf(this.removed[i]);
            if (idx != -1) {
                this.cnt[this.removed[i].type]--;
                this.objects.splice(idx, 1);
            }
        }
    };

    this.iterate = function (funcName) {
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, len = this.objects.length; i < len; i++) {
            var obj = this.objects[i];
            obj[funcName].apply(obj, args);
        }
    };

    this.detect = function (func) {
        for (var i = 0, val = null, len = this.objects.length; i < len; i++) {
            if (func.call(this.objects[i])) {
                return this.objects[i];
            }
        }

        return false;
    };

    this.step = function (dt) {
        this.resetRemoved();
        this.iterate('step', dt);
        this.finalizeRemoved();
    };

    this.draw = function (ctx) {
        this.iterate('draw', ctx);
    };

    this.overlap = function (o1, o2) {
        return !((o1.y + o1.h - 1 < o2.y) || ( o1.y > o2.y + o2.h - 1) || (o1.x + o1.w - 1 < o2.x) || (o1.x > o2.x + o2.w - 1));
    };

    this.collide = function (obj, type) {
        return this.detect(function() {
            if (obj != this) {
                var col = (!type || this.type & type) && board.overlap(obj, this);
                return col ? this : false;
            }
        });
    };
};

var Sprite = function() {
};

Sprite.prototype.setup = function (sprite, props) {
    this.sprite = sprite;
    this.merge(props);
    this.frame = this.frame || 0;
    this.w = SpriteSheet.map[sprite].w;
    this.h = SpriteSheet.map[sprite].h;
};

Sprite.prototype.merge = function (props) {
    if (props) {
        for (var prop in props) {
            this[prop] = props[prop];
        }
    }
};

Sprite.prototype.draw = function (ctx) {
    SpriteSheet.draw(ctx, this.sprite, this.x, this.y, this.frame);
};

Sprite.prototype.hit = function (damage) {
    this.board.remove(this);
};


var Level = function (levels, callback) {
    Game.currLevel = 1;
    Game.levels = levels;

    this.initialize(callback);
};


Level.prototype.initialize = function (callback) {
    this.levelData = [];

    for (var i = 0; i < Game.levels[Game.currLevel].length; i++) {
        this.levelData.push(Object.create(Game.levels[Game.currLevel][i]));
    }
    this.t = 0;
    this.callback = callback;
}

Level.prototype.step = function (dt) {
    var idx = 0, remove = [], curShip = null;

    this.t += dt * 1000;

    //   Start, End,  Gap, Type,   Override
    // [ 0,     4000, 500, 'step', { x: 100 } ]
    while ((curShip = this.levelData[idx]) && (curShip[0] < this.t + 2000)) {
        if (this.t > curShip[1]) {
            remove.push(curShip);
        } else if (curShip[0] < this.t) {
            var enemy = enemies[curShip[3]],
            override = curShip[4];

            this.board.add(new Enemy(enemy, override));

            curShip[0] += curShip[2];
        }
        idx++;
    }

    for (var i = 0, len = remove.length; i < len; i++) {
        var remIdx = this.levelData.indexOf(remove[i]);
        if (remIdx != -1) {
            this.levelData.splice(remIdx, 1)
        };
    }

    if (this.levelData.length === 0 && this.board.cnt[OBJECT_ENEMY] === 0) {
        if (Game.levels[++Game.currLevel]) {
            this.initialize(this.callback);
        } else if (this.callback) {
            Game.currLevel--;
            this.callback();
        }
    }

    if (Math.random() < 0.007) {
        this.board.add(new StarPowerup());
    }

    if (Math.random() < 0.01) {
        this.board.add(new PoisonPill());
    }

    if (Math.random() < 0.0002) {
        this.board.add(new Bomb());
    }
};

Level.prototype.draw = function (ctx) {
};

var GamePoints = function () {
    Game.points = 0;

    var pointsLength = 8;

    this.draw = function (ctx) {
        ctx.save();
        ctx.font = 'bold 18px bangers';
        ctx.fillStyle = '#fff';

        var txt = '' + Game.points;
        var i = pointsLength - txt.length, zeros = '';
        while (i-- > 0) {
            zeros += '0';
        }

        ctx.fillText(zeros + txt, 50, 30);
        ctx.restore();
    };

    this.step = function (dt) {
    };
};

var LevelCounter = function () {
    this.draw = function (ctx) {
        ctx.save();

        ctx.font = 'bold 18px bangers';
        ctx.fillStyle = '#fff';
        ctx.fillText('Level: ' + Game.currLevel, Game.width - 40, 30);

        ctx.restore();
    };

    this.step = function (dt) {
    };
};

var BombCounter = function() {
 this.draw = function (ctx) {
    ctx.save();

    ctx.font = 'bold 18px bangers';
    ctx.fillStyle = '#fff';
    ctx.fillText('Bombs: ' + Game.bomb_counter, 50, 45);

    ctx.restore();
};

this.step = function (dt) {
}; 
};

