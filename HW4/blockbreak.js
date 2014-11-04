$(function() {
    var Q = window.Q = Quintus({audioSupported: ['ogg']})
    .include('Input, Sprites, Scenes, UI, Touch, 2D, Audio')
    .setup("breakout")
    .touch()
    .enableSound();

    Q.input.mouseControls({cursor: "on"});
    Q.input.keyboardControls();
    Q.input.touchControls({
        controls:  [ ['left','<' ],[],[],[],['right','>' ] ]
    });


//Classes

Q.Sprite.extend("Paddle",{
    init: function() {
        this._super({
            sheet: 'paddle',
            speed: 200,
            x: 0
        });

        this.p.x = Q.width/2;
        this.p.y = Q.height - this.p.h;
        if(Q.input.keypad.size) {
            this.p.y -= Q.input.keypad.size + this.p.h;
        }
    },
    step: function(dt) {

        if(Q.inputs['pause']){
            Q.stage().trigger("pause");
        }

        if(Q.state.get("mouse")){
            this.p.x = Q.inputs['mouseX'];
        }else{
                    //keyboard movement
                    if(Q.inputs['left']) {
                        this.p.x -= dt * this.p.speed;
                    }else if(Q.inputs['right']) {
                        this.p.x += dt * this.p.speed;
                    }
                }

            //prevent the paddle from going offscreen
            if(this.p.x < this.p.w / 2) {
                this.p.x = this.p.w / 2;
            } else if(this.p.x > Q.width - this.p.w / 2) {
                this.p.x = Q.width - this.p.w / 2;
            }
        }
    });

Q.Sprite.extend("Paddle2",{
    init: function() {
        this._super({
            sheet: 'paddle2',
            speed: 200,
            x: 0
        });

        this.p.x = Q.width/2;
        this.p.y = Q.height - this.p.h;
        if(Q.input.keypad.size) {
            this.p.y -= Q.input.keypad.size + this.p.h;
        }
    },
    step: function(dt) {

        
                    //keyboard movement
                    if(Q.inputs['a']) {
                        this.p.x -= dt * this.p.speed;
                    }else if(Q.inputs['d']) {
                        this.p.x += dt * this.p.speed;
                    }
                    

            //prevent the paddle from going offscreen
            if(this.p.x < this.p.w / 2) {
                this.p.x = this.p.w / 2;
            } else if(this.p.x > Q.width - this.p.w / 2) {
                this.p.x = Q.width - this.p.w / 2;
            }
        }
    });

Q.Sprite.extend("Ball",{
    init: function(p) {
        this._super(p,{
            sheet: 'ball',
            speed: 200,
            dx: 1,
            dy: -1,
            gravity: 0
        });
        this.p.y = Math.random() * 20 + Q.height / 2;
        this.p.x = Math.random() * (Q.width - this.p.w) + this.p.w / 2;

        this.add("2d");

        this.on("hit",this,"collision");
        this.on("bump.bottom",this,"flipY");
        this.on("bump.top",this,"flipY");
        this.on("bump.left",this,"flipX");
        this.on("bump.right",this,"flipX");
        this.on("destroyed",this,"remove");
    },

    flipY: function(col){
        this.p.dy *= -1;
    },

    flipX: function(col){
        this.p.dx *= -1;
    },

    collision: function(col) {
        if(col.obj instanceof Q.Paddle) {
            playAudio('hit-paddle.ogg');
        }else if(col.obj instanceof Q.Block){
            playAudio('hit-block.ogg');
            col.obj.destroy();
            Q.stage().trigger('removeBlock');
        }else if(col.obj instanceof Q.Ball){
        }
    },

    remove: function(){
        this.off("hit");
        this.off("bump.bottom");
        this.off("bump.top");
        this.off("bump.left");
        this.off("bump.right");
        this.off("destroyed");
    },

    step: function(dt) {
        this.stage.collide(this);

            //move the ball
            var p = this.p;
            p.x += p.dx * p.speed * dt;
            p.y += p.dy * p.speed * dt;

            //keep ball on screen
            if(p.x < 0) {
                p.x = 0;
                p.dx = 1;
                playAudio('hit-wall.ogg');
            } else if(p.x > Q.width - p.w) {
                p.dx = -1;
                p.x = Q.width - p.w;
                playAudio('hit-wall.ogg');
            }

            //keep ball on screen
            if(p.y < 0) {
                p.y = 0;
                p.dy = 1;
                playAudio('hit-wall.ogg');
            } else if(p.y > Q.height) {
                //reached bottom of the screen
                Q.stage().trigger('removeBall');
                this.destroy();

            }
        }
    });


Q.Sprite.extend("Block",{
    init: function(p) {
        this._super(p,{ sheet: 'block'});
    }
});


Q.UI.Text.extend("Score",{
    init: function(p){
        this._super({
            label: "score: " + Q.state.get("score"),
            x: 50,
            y: 20,
            size: 18,
            family: "Tahoma",
            color: "white"
        });

        Q.state.on("change.score",this,"score");
    },

    score: function(score){
        this.p.label = "score: " + score;
    }
});


Q.UI.Text.extend("Lives",{
    init: function(p){
        this._super({
            label: "lives: " + Q.state.get("lives"),
            x: 270,
            y: 20,
            size: 18,
            family: "Tahoma",
            color: "white"
        });

        Q.state.on("change.lives",this,"lives");
    },

    lives: function(lives){
        this.p.label = "lives: " + lives;
    }
});

Q.UI.Button.extend("Checkbox",{
    init:function(p,state,callback){
        var obj = {  
            scale: 0.2,
            checked: false,
            sheet: "unchecked"
        };
        for(var key in p){
            obj[key] = p[key];
        }
        this._super(obj,callback);

        this.p.state = state;

        if(Q.state.get(state) != undefined){
            this.setCheck(Q.state.get(this.p.state));
        }else{
            this.setCheck(this.p.checked);
        }
    },

    setCheck: function(checked){
        this.p.sheet = checked ? "checked" : "unchecked";
        Q.state.set(this.p.state,checked);
    },

    toggleCheck: function(){
        this.p.checked = !this.p.checked;
        this.setCheck(this.p.checked);
        if(Q.stage(1).scene.name === "title"){
            if(this.p.checked){
                Q.audio.play('title.ogg');
            }else{
                Q.audio.stop('title.ogg');
            }
        }

    }
});

function playAudio(file,options){
    if(Q.state.get('sound')){
        Q.audio.play(file,options);
    }
}

    //Scenes

    Q.scene('title', function(stage) {

        playAudio('title.ogg', {loop:true});

        var overlay = stage.insert(new Q.UI.Container({
            fill: "rgba(200,200,200,0.9)",
            w: Q.width,
            h: Q.height,
            x: Q.width / 2,
            y: Q.height / 2
        }));

        var container = stage.insert(new Q.UI.Container({
            stroke: "rgb(155,155,155)",
            shadowColor: "rgba(0,0,0,0.7)",
            y: -50
        }), overlay);

        var titleShadow = stage.insert(new Q.UI.Text({
            label: "breakout",
            family: "Tahoma",
            size: 44,
            font: "400 44px Tahoma",
            color: "black",
            x: 0,
            y: -40
        }), container);

        var title = stage.insert(new Q.UI.Text({
            label: "breakout",
            family: "Tahoma",
            size: 44,
            font: "400 44px Tahoma",
            color: "grey",
            x: 2,
            y: -38
        }), container);

        var startButton = stage.insert(new Q.UI.Button({
            label: "start",
            font: "800 24px Tahoma",
            fontColor: "grey",
            fill: "rgba(150,150,150,0.5)",
            stroke: "darkgray",
            border: 2,
            y: 50,
            x: 0
        }, function(){
            Q.audio.stop("title.ogg");
            playAudio('ui-forward.ogg');
            Q.stageScene(null,1);
            Q.stageScene('game');
        }), container);

        var useMouse = stage.insert(new Q.Checkbox({
            x: -100,
            y: 120
        },"mouse",function(){
            this.toggleCheck();
        }),container);

        var useMouseLabel = stage.insert(new Q.UI.Text({
            x: 3,
            y: 120,
            label: ": mouse controls",
            family: "Tahoma",
            size: 18,
            color: "grey"
        }),container);

        var useSound = stage.insert(new Q.Checkbox({
            x: -100,
            y: 150,
            sheet: "checked",
            checked: true
        },"sound",function(){
            this.toggleCheck();
        }),container);

        var useSoundLabel = stage.insert(new Q.UI.Text({
            x: -40,
            y: 150,
            label: ": sound",
            family: "Tahoma",
            size: 18,
            color: "grey"
        }),container);

        var twoPlayer = stage.insert(new Q.Checkbox({
            x: -100,
            y: 180
        },"twoPlayer",function(){
            this.toggleCheck();
        }),container);

        var twoPlayerLabel = stage.insert(new Q.UI.Text({
            x: -30,
            y: 180,
            label: ": 2 Player",
            family: "Tahoma",
            size: 18,
            color: "grey"
        }),container);

        var controlsContainer = stage.insert(new Q.UI.Container({
            stroke: "rgb(155,155,155)",
            shadowColor: "rgba(0,0,0,0.5)",
            y: 220
        }), container);

        var controlsText = stage.insert(new Q.UI.Button({
            label: "move with",
            font: "800 20px Tahoma",
            fontColor: "grey",
            y: 0,
            x: -70
        }), controlsContainer);

        var controlsLeft = stage.insert(new Q.UI.Button({
            sheet: "left-arrow",
            scale: 0.35,
            x: 20
        }),controlsContainer);

        var controlsRight = stage.insert(new Q.UI.Button({
            sheet: "right-arrow",
            scale: 0.35,
            x: 80
        }),controlsContainer);

        container.fit(20,20);
    });

Q.scene('win', function(stage) {

    var overlay = stage.insert(new Q.UI.Container({
        fill: "rgba(200,200,200,0.8)",
        w: Q.width,
        h: Q.height,
        x: Q.width / 2,
        y: Q.height / 2
    }));

    var container = stage.insert(new Q.UI.Container({
        stroke: "rgb(155,155,155)",
        shadowColor: "rgba(0,0,0,0.5)",
        y: -50
    }), overlay);

    var titleShadow = stage.insert(new Q.UI.Text({
        label: "YOU WIN!",
        family: "Tahoma",
        size: 44,
        font: "400 44px Tahoma",
        color: "black",
        x: 0,
        y: -20
    }), container);

    var title = stage.insert(new Q.UI.Text({
        label: "YOU WIN!",
        family: "Tahoma",
        size: 44,
        font: "400 44px Tahoma",
        color: "grey",
        x: 2,
        y: -18
    }), container);

    var startButton = stage.insert(new Q.UI.Button({
        label: "play again",
        font: "800 24px Tahoma",
        fontColor: "grey",
        fill: "rgba(150,150,150,0.5)",
        stroke: "darkgray",
        border: 2,
        y: 90,
        x: 0
    }, function(){
        playAudio('ui-forward.ogg');
        Q.stageScene(null,1);
        Q.stageScene('game');
    }), container);

    var menuButton = stage.insert(new Q.UI.Button({
        label: "main menu",
        font: "800 20px Tahoma",
        fontColor: "grey",
        fill: "rgba(150,150,150,0.5)",
        stroke: "darkgray",
        border: 2,
        y: 170,
        x: 0
    }, function(){
        playAudio('ui-backward.ogg');
        Q.stageScene(null,2);
        Q.stageScene('title',1);
    }), container);

    container.fit(20,20);
});

Q.scene('lose', function(stage) {

    var overlay = stage.insert(new Q.UI.Container({
        fill: "rgba(200,200,200,0.8)",
        w: Q.width,
        h: Q.height,
        x: Q.width / 2,
        y: Q.height / 2
    }));

    var container = stage.insert(new Q.UI.Container({
        stroke: "rgb(155,155,155)",
        shadowColor: "rgba(0,0,0,0.5)",
        y: -50
    }), overlay);

    var titleShadow = stage.insert(new Q.UI.Text({
        label: "YOU LOSE!",
        family: "Tahoma",
        size: 44,
        font: "400 44px Tahoma",
        color: "black",
        x: 0,
        y: -20
    }), container);

    var title = stage.insert(new Q.UI.Text({
        label: "YOU LOSE!",
        family: "Tahoma",
        size: 44,
        font: "400 44px Tahoma",
        color: "grey",
        x: 2,
        y: -18
    }), container);

    var startButton = stage.insert(new Q.UI.Button({
        label: "play again",
        font: "800 24px Tahoma",
        fontColor: "grey",
        fill: "rgba(150,150,150,0.5)",
        stroke: "darkgray",
        border: 2,
        y: 90,
        x: 0
    }, function(){
        playAudio('ui-forward.ogg');
        Q.stageScene(null,1);
        Q.stageScene('game');
    }), container);

    var menuButton = stage.insert(new Q.UI.Button({
        label: "main menu",
        font: "800 20px Tahoma",
        fontColor: "grey",
        fill: "rgba(150,150,150,0.5)",
        stroke: "darkgray",
        border: 2,
        y: 170,
        x: 0
    }, function(){
        playAudio('ui-backward.ogg');
        Q.stageScene(null,2);
        Q.stageScene('title',1);
    }), container);

    container.fit(20,20);
});

Q.scene('pause', function(stage) {

    var overlay = stage.insert(new Q.UI.Container({
        fill: "rgba(200,200,200,0.8)",
        w: Q.width,
        h: Q.height,
        x: Q.width / 2,
        y: Q.height / 2
    }));

    var container = stage.insert(new Q.UI.Container({
        stroke: "rgb(155,155,155)",
        shadowColor: "rgba(0,0,0,0.5)",
        y: -50
    }), overlay);

    var titleShadow = stage.insert(new Q.UI.Text({
        label: "game paused",
        family: "Tahoma",
        size: 44,
        font: "400 44px Tahoma",
        color: "black",
        x: 0,
        y: -20
    }), container);

    var title = stage.insert(new Q.UI.Text({
        label: "game paused",
        family: "Tahoma",
        size: 44,
        font: "400 44px Tahoma",
        color: "grey",
        x: 2,
        y: -18
    }), container);

    var continueButton = stage.insert(new Q.UI.Button({
        label: "continue",
        font: "800 24px Tahoma",
        fontColor: "grey",
        fill: "rgba(150,150,150,0.5)",
        stroke: "darkgray",
        border: 2,
        y: 90,
        x: 0
    }, function(){
        Q.state.set("pause",false);
        playAudio("unpause.ogg");
        playAudio('game.ogg', {loop:true});
        Q.stageScene(null,1);
        Q.unpauseGame();
    }), container);

    var menuButton = stage.insert(new Q.UI.Button({
        label: "main menu",
        font: "800 20px Tahoma",
        fontColor: "grey",
        fill: "rgba(150,150,150,0.5)",
        stroke: "darkgray",
        border: 2,
        y: 170,
        x: 0
    }, function(){
        playAudio('ui-backward.ogg');
        Q.stageScene(null,2);
        console.log(Q.state.get('mouse'));
        Q.stageScene('title',1);
        console.log(Q.state.get('mouse'));
        console.log(Q.state.get('mouse'));
    }), container);

    container.fit(20,20);
});

Q.scene('hud',function(stage){
    stage.insert(new Q.Score());
    stage.insert(new Q.Lives());
});


function resetState(resetProp,perProp){
    for(var i=0;i<perProp.length;i++){
        var state = perProp[i];
        resetProp[state] = Q.state.get(state) != undefined ? Q.state.get(state) : resetProp[state] != undefined ? resetProp[state] : false;
    }
    Q.state.reset(resetProp);
}

var defaultState = {pause:false,lives:3,score:0,sound:true,mouse:false,twoPlayer:false};
var persistantState = ['mouse','sound','twoPlayer'];

Q.scene('game',function(stage) {

    resetState(defaultState,persistantState);

        //Additional key bindings. 2 player?
        Q.input.bindKey(80,"pause");
        Q.input.bindKey(27,"pause");
        Q.input.bindKey(65,"a");
        Q.input.bindKey(68,"d");


        stage.insert(new Q.Ball());
        stage.insert(new Q.Paddle());

        if(Q.state.get("twoPlayer")){
            stage.insert(new Q.Paddle2());
        }

        playAudio('game.ogg', {loop:true});
        Q.stageScene('hud',2);
        

        var ballCount = Q("Ball").items.length;
        var blockCount=0;

        //insert blocks
        for(var x=0;x<6;x++) {
            for(var y=0;y<5;y++) {
                stage.insert(new Q.Block({ x: x*50+35, y: y*30+50 }));
                blockCount++;
            }
        }
        stage.on('removeBlock',function() {
            blockCount--;
            Q.state.inc("score",1);
            if(blockCount == 0) {
                if(Q("Paddle").items[0]){
                    Q.audio.stop('game.ogg');
                    playAudio('win.ogg');
                    Q.stageScene('win',1);
                    Q.pauseGame();
                }
            }
        });

        stage.on('removeBall',function() {
            ballCount--;
            Q.state.dec("lives",1);
            if(Q.state.get("lives") <= 0){
                if(Q("Paddle").items[0]){
                    Q.audio.stop('game.ogg');
                    playAudio('lose.ogg');
                    Q.stageScene('lose',1);
                    Q.pauseGame();
                }
            }else{
                playAudio('lose-life.ogg');
                stage.insert(new Q.Ball());
            }
        });

        stage.on('pause',function(){
            if(Q.stage(1).scene == null && !Q.state.get("pause")){
                Q.audio.stop('game.ogg');
                Q.state.set("pause",true);
                playAudio("pause.ogg");
                Q.stageScene('pause',1);
                Q.pauseGame();
            }
        });


    });

    //Load Scene

    Q.load(['blockbreak.png','blockbreak.json','buttons.png','buttons.json','pause.ogg','unpause.ogg','win.ogg','lose.ogg','ui-backward.ogg','ui-forward.ogg','hit-paddle.ogg','hit-wall.ogg','hit-block.ogg','title.ogg','game.ogg','lose-life.ogg'], function() {
        Q.compileSheets('blockbreak.png','blockbreak.json');
        Q.compileSheets('buttons.png','buttons.json');

        resetState(defaultState,persistantState);

        console.log(Q.state.get("sound"));

        Q.stageScene('title',1);
    }, {

    });
});
