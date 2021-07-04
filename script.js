var game = {
    tickNumber: 0,
    score: 0,
    timer: null,
    tickLength: 500,
    board: null,
    board: [
        "###############",
        "#             #",
        "#             #",
        "#      ##     #",
        "#      ##     #",
        "#             #",
        "#             #",
        "#             #",
        "#             #",
        "#             #",
        "###############",
    ],
    board_d0: [
        "###############",
        "#             #",
        "#             #",
        "#      ##     #",
        "#      ##     #",
        "#             #",
        "#             #",
        "#             #",
        "#             #",
        "#             #",
        "###############",
    ],
    board_d1: [
        "###################",
        "#                 #",
        "#                 #",
        "#      ##         #",
        "#      ##       ###",
        "#               #",
        "#               #",
        "#               #",
        "#   ##          #",
        "#               #",
        "#               #",
        "#               #",
        "#################",
    ],
    board_d2: [
        "###################",
        "#           #     #",
        "#                 #",
        "#                 #",
        "#                 #",
        "#      ###        #",
        "#      ###      ###",
        "#      ###      #",
        "#               #",
        "#               #",
        "#   ###         #",
        "#               #",
        "#################",
    ],
    fruit: [{
            x: 1,
            y: 1
        },
        {
            x: 8,
            y: 8
        },
    ],
    tick: function () {
        window.clearTimeout(game.timer)
        game.tickNumber++;
        if (game.tickNumber % 10 == 0) {
            game.addRandomFruit()
        }
        var result = snake.move()
        if (result == "gameover") {
            alert("Игра окончена! Очки: " + game.score)
            gameControl.newGame()
            return
        }
        graphics.drawGame();
        game.timer = window.setTimeout("game.tick()", game.tickLength)
    },
    addRandomFruit: function () {
        var randomY = Math.floor(Math.random() * game.board.length) + 0
        var randomX = Math.floor(Math.random() * game.board[randomY].length) + 0
        var randomLocation = {
            x: randomX,
            y: randomY
        }
        if (game.isEmpty(randomLocation) && !game.isFruit(randomLocation)) {
            game.fruit.push(randomLocation)
        }

    },
    isEmpty: function (location) {
        return game.board[location.y][location.x] == ' '
    },
    isWall: function (location) {
        return game.board[location.y][location.x] == '#'
    },
    isFruit: function (location) {
        for (var fruitNumber = 0; fruitNumber < game.fruit.length; fruitNumber++) {
            var fruit = game.fruit[fruitNumber]
            if (location.x == fruit.x && location.y == fruit.y) {
                game.fruit.splice(fruitNumber, 1)
                return true;
            }
        }
        return false;
    },
    isSnake: function (location) {
        for (var snakePart = 0; snakePart < snake.parts.length; snakePart++) {
            var part = snake.parts[snakePart]
            if (location.x == part.x && location.y == part.y) {              
                return true;
            }
        }
        return false
    }
}
var snake = {
    parts: [{
            x: 4,
            y: 5
        }, // голова
        {
            x: 3,
            y: 5
        },
        {
            x: 2,
            y: 5
        },
    ],
    facing: "E",
    nextLocation: function () {
        var snakHead = snake.parts[0];
        var targetX = snakHead.x;
        var targetY = snakHead.y;
        targetY = snake.facing == "N" ? targetY - 1 : targetY
        targetY = snake.facing == "S" ? targetY + 1 : targetY
        targetX = snake.facing == "W" ? targetX - 1 : targetX
        targetX = snake.facing == "E" ? targetX + 1 : targetX
        return {
            x: targetX,
            y: targetY
        }
    },
    move: function () {
        var location = snake.nextLocation()
        if (game.isWall(location) || game.isSnake(location)) {
            return "gameover"
        }
        if (game.isEmpty(location) ) {
            snake.parts.unshift(location)
            snake.parts.pop()
        }
        if (game.isFruit(location)) {
            snake.parts.unshift(location)
            game.score++
            graphics.scoreField.innerText = game.score
            if (game.score == 10) {
                game.board = game.board_d1
                game.tickLength = 400
            }
            if(game.score == 20) {
                game.board = game.board_d2
                game.tickLength = 305
            } 
        }
    }
}

var graphics = {
    canvas: document.getElementById('canvas'),
    btn: document.getElementById('btn'),
    scoreField: document.getElementById('score'),
    squareSize: 30,
    drawBoard: function (ctx) {
        var currentYoffset = 0
        ctx.clearRect(0, 0, graphics.canvas.width, graphics.canvas.height)
        game.board.forEach(function checkLine(line) {
            line = line.split('')
            var currentXoffset = 0;
            line.forEach(function checkCharacter(character) {
                if (character == "#") {
                    ctx.fillStyle = "black"
                    ctx.fillRect(currentXoffset, currentYoffset, graphics.squareSize, graphics.squareSize)
                }
                currentXoffset += graphics.squareSize;
            })
            currentYoffset += graphics.squareSize;
        });
    },
    draw: function (ctx, source, color) {
        source.forEach(function drawPart(part) {
            ctx.fillStyle = color
            var partXlocation = part.x * graphics.squareSize;
            var partYlocation = part.y * graphics.squareSize;
            ctx.fillRect(partXlocation, partYlocation, graphics.squareSize, graphics.squareSize)
        })
    },
    drawGame: function () {
        graphics.canvas.width = game.board[0].length * graphics.squareSize
        graphics.canvas.height = game.board.length * graphics.squareSize
        var ctx = graphics.canvas.getContext('2d')
        graphics.drawBoard(ctx, 0)
        graphics.draw(ctx, game.fruit, "red")
        graphics.draw(ctx, snake.parts, "green")
    }
}

var gameControl = {
    processInput: function (keyPressed) {
        var key = keyPressed.key.toLowerCase()
        var targetDirection = snake.facing
        if (key == "w" || key == "ц") targetDirection = "N"
        if (key == "a" || key == "ф") targetDirection = "W"
        if (key == "s" || key == "ы") targetDirection = "S"
        if (key == "d" || key == "в") targetDirection = "E"
        snake.facing = targetDirection
        game.tick()
    },
    startGame: function () {
        window.addEventListener("keypress", gameControl.processInput, false)
        snake.parts = [{
            x: 4,
            y: 5
        }, // голова
        {
            x: 3,
            y: 5
        },
        {
            x: 2,
            y: 5
        },
    ]
        snake.facing = 'E'
        game.tickNumber = 0
        game.score = 0
        graphics.scoreField.innerText = game.score
        game.tickLength = 500
        game.board = game.board_d0
        game.tick()
    },
    newGame: function() {
        gameControl.startGame()
    }
}
