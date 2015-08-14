// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };


var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);

var score = 0;
var labelScore;
var player;
var gapStart = game.rnd.integerInRange(1, 5);
var pipes = [];
var pipeInterval;
var pipeeventLoop;
var width = 790;
var height = 400;
var gameSpeed = 200;
var gameGravity = 420;
var jumpPower = -200;
var gapSize = 150;
var gapMargin = 50;
var blockHeight = 50;
var pipesToSpeedUp = 10;
var worm = [];
var beetle = [];
var star = [];

jQuery("#greeting-form").on("submit", function(event_details) {
    var greeting = "Hello ";
    var name = jQuery("#fullName").val();
    var greeting_message = greeting + name;
    jQuery("#greeting-form").hide();
    jQuery("#greeting").append("<p>" + greeting_message + "</p>");
});

function preload() {
    game.load.image("background",   "../assets/bg1.png");
    game.load.image("playerImg", "../assets/flappy-cropped.png");
    game.load.image("playerImg1", "../assets/flappy-cropped-reverse.png");
    game.load.image("playerImg2", "../assets/flappy_frog.png");
    game.load.audio("score", "../assets/point.ogg");
    game.load.image("playerImg3", "../assets/star.png");
    game.load.image("pipe","../assets/pipe_purple.png");
    game.load.image("worm","../assets/cartoon-worm.png");
    game.load.image("beetle","../assets/beetle.png");
    game.load.image("star","..assets/star.png");
}

function start() {
    game.input
        .onDown
        .add(clickHandler);
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    player.body.velocity.y = -100;
    player.body.gravity.y = 400;
    gameGravity = 400;
    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);
    pipeInterval = 1.5;
    pipeeventLoop=game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND,
        generate);
    game.add.text(50,16, "Happy Flappy",
        {font: "30px Charlemagne Std", fill: "#000aaa"});
    player.anchor.setTo(0.5, 0.5);
    game.input.keyboard.addKey(Phaser.Keyboard.P)
        .onDown.add(pause);
    splashDisplay.destroy();
}
function create() {
    var background = game.add.image(0, 0, "background");
    background.width = 790;
    background.height = 400;
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
        .onDown.add(start);
    labelScore = game.add.text(20, 20, "0");
    player = game.add.sprite(100, 200, "playerImg");
    game.physics.arcade.enable(player);
    splashDisplay = game.add.text(100,150, "Press ENTER to start, SPACEBAR to jump");
}

    function update() {
        for (var index = 0; index < pipes.length; index++) {
            game.physics.arcade
                .overlap(player,
                pipes[index],
                gameOver);
        }
        if (player.y > 400) {
            gameOver();
        }
        if (player.y < 0) {
            gameOver();
        }
        checkpipes();
        player.rotation += 1;
        player.rotation = Math.atan(player.body.velocity.y / 200);
        for (var i = worm.length - 1; i >= 0; i--) {
            game.physics.arcade.overlap(player, worm[i], function () {

                changeGravity(-120);
                worm[i].destroy();
                worm.splice(i, 1);

            });
        }

        for (var i = beetle.length - 1; i >= 0; i--) {
            game.physics.arcade.overlap(player, beetle[i], function () {

                changeGravity(+120);
                beetle[i].destroy();
                beetle.splice(i, 1);

            });
        }
    }


    function gameOver() {
        $("#score").val(score.toString());
        $("#greeting").show();
        game.clearPendingEvents();
        gameGravity = 420;
        star = [];
    }
function clickHandler(event) {
    //alert( "PAUSE");
    location.reload();
}

    function spaceHandler() {
        game.sound.play("score");

    }

    function changeScore() {
        score = score + 1;
        labelScore.setText(score.toString());
    }


    function generatePipe() {
        var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);

        for (var y = gapStart; y > 0; y -= blockHeight) {
            addPipeBlock(width, y - blockHeight);
        }
        for (var y = gapStart + gapSize; y < height; y += blockHeight) {
            addPipeBlock(width, y);
        }

        pipesToSpeedUp--;
        if (pipesToSpeedUp < 1) {
            speedup();
            pipesToSpeedUp = 10;
        }
    }

    function pause() {
        alert("PAUSE");
    }

    function checkpipes() {
        if (pipes.length != 0) {
            if (pipes[0].x < 100) {
                changeScore();
                var count = 0;
                while (count < pipes.length && pipes[count].x < 100) {
                    count++;
                }
                pipes.splice(0, count);
            }
        }
    }

    function addPipeBlock(x, y) {
        var pipeBlock = game.add.sprite(x, y, "pipe");
        pipes.push(pipeBlock);
        game.physics.arcade.enable(pipeBlock);
        pipeBlock.body.velocity.x = -200;
    }


    function playerJump() {
        player.body.velocity.y = jumpPower
    }

    function speedup() {
        pipeInterval *= 0.85;
        game.time.events.remove(pipeeventLoop);
        pipeeventLoop = game.time.events
            .loop(pipeInterval * Phaser.Timer.SECOND,
            generatePipe);
    }


    $.get("/score", function (scores) {
        scores.sort(function (scoreA, scoreB) {
            var difference = scoreB.score - scoreA.score;
            return difference;
        });
        for (var i = 0; i < 21; i++) {
            $("#scoreBoard").append(
                "<li>" +
                scores[i].name + ": " + scores[i].score +
                "</li>");
        }
    });

    if (isEmpty(fullName)) {
        response.send("Please make sure you enter your name.");
    }
    function isEmpty(str) {
        return (!str || 0 === str.length);
    }

    function changeGravity(g) {
        gameGravity += g;
        player.body.gravity.y = gameGravity;
    }

    function generateWorm() {
        var bonus = game.add.sprite(width, height, "worm");
        worm.push(bonus);
        game.physics.arcade.enable(bonus);
        bonus.body.velocity.x = -200;
        bonus.body.velocity.y = -game.rnd.integerInRange(60, 100);
    }

    function generateBeetle() {
        var bonus = game.add.sprite(width, height, "beetle");
        beetle.push(bonus);
        game.physics.arcade.enable(bonus);
        bonus.body.velocity.x = -200;
        bonus.body.velocity.y = -game.rnd.integerInRange(60, 100);
    }

    function generate() {
        var diceRoll = game.rnd.integerInRange(1, 10);
        if (diceRoll == 2) {
            generateWorm();
        } else if (diceRoll == 1) {
            generateBeetle();
        } else {
            generatePipe();
        }
    }

    function addStar(x, y){
        var bonus = game.add.sprite(width[pipeblock],height[pipe])
    }

