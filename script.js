/**
 * board
 * fruit
 * tick: function ()
 * addRandomFruit: function ()
 * isEmpty: function (location)
 * isWall: function (location)
 * isFruit: function (location)
 * isSnake: function (location)
 */
var game = {
    tickNumber: 0,
    score: 0,
    timer: null,
    tickLength: 500,
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
        "####################",
        "#           #      #",
        "#           #      #",
        "#                  #",
        "#                  #",
        "#      ###         #",
        "#      ###       ###",
        "#      ###       #",
        "#                #",
        "#                #",
        "#   ###          #",
        "#                #",
        "##################",
    ],
    fruit: [{
            x: 1,
            y: 1,
            isSuperFruit: false,
            color: 'red'
        },
        {
            x: 8,
            y: 8,
            isSuperFruit: false,
            color: 'red'
        },
    ],
    fruitsCount: 0,
    tick: function () {
        window.clearTimeout(game.timer)
        game.tickNumber++;
        if (game.tickNumber % 10 == 0) {
            game.addRandomFruit()
        }
        var result = snake.move()
        if (result == "gameover") {
            alert("???????? ????????????????! ????????: " + game.score)
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
            y: randomY,
            isSuperFruit: false,
            color: 'red'
        }
        let randomSuperLocation = {
            x: randomX,
            y: randomY,
            isSuperFruit: true,
            color: 'yellow'
        }
        if (game.isEmpty(randomLocation) && !game.isFruit(randomLocation)) {
            if (game.fruitsCount % 4 == 0) {
                game.fruit.push(randomSuperLocation)
            } else {
                game.fruit.push(randomLocation)
            }
            game.fruitsCount++
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
                if (fruit.isSuperFruit) {
                    // Some magic with snake
                    console.log('Gotcha')
                }
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

/**
 * parts
 * facing
 * nextLocation: function ()
 * move: function ()
 */
var snake = {
    parts: [{
            x: 4,
            y: 5
        }, // ????????????
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
        var snakeHead = snake.parts[0];
        var targetX = snakeHead.x;
        var targetY = snakeHead.y;
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
            if (game.score == 15) {
                game.board = game.board_d1
                game.tickLength = 350
                graphics.levelField.innerText = 2
            }
            if (game.score == 27) {
                game.board = game.board_d2
                game.tickLength = 280
                graphics.levelField.innerText = 3
            }
        }
    }
}

/**
 * canvas
 * scoreField
 * squareSize
 * drawBoard: function (ctx)
 * draw: function (ctx, source, color)
 * drawGame: function ()
 */
var graphics = {
    canvas: document.getElementById('canvas'),
    scoreField: document.getElementById('score'),
    levelField: document.getElementById('level'),
    buttonsField: document.getElementById('buttons'),
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
        if (source == game.fruit) {
            source.forEach(function drawPart(part) {
                var partXlocation = part.x * graphics.squareSize;
                var partYlocation = part.y * graphics.squareSize;
                ctx.fillStyle = part.color
                ctx.fillRect(partXlocation, partYlocation, graphics.squareSize, graphics.squareSize)
            })
        } else if (source == snake.parts) {
            source.forEach(function drawPart(part) {
                var partXlocation = part.x * graphics.squareSize;
                var partYlocation = part.y * graphics.squareSize;
                if (source.indexOf(part) == 0) {
                    ctx.fillStyle = 'black'
                    ctx.fillRect(partXlocation, partYlocation, graphics.squareSize, graphics.squareSize)
                } else {
                    ctx.fillStyle = color
                    ctx.fillRect(partXlocation, partYlocation, graphics.squareSize, graphics.squareSize)
                }
            })
        } else {
            source.forEach(function drawPart(part) {
                ctx.fillStyle = color
                var partXlocation = part.x * graphics.squareSize;
                var partYlocation = part.y * graphics.squareSize;
                ctx.fillRect(partXlocation, partYlocation, graphics.squareSize, graphics.squareSize)
            })
        }
    },
    drawGame: function () {
        graphics.canvas.width = game.board[0].length * graphics.squareSize
        graphics.canvas.height = game.board.length * graphics.squareSize
        var ctx = graphics.canvas.getContext('2d')
        graphics.drawBoard(ctx, 0)
        graphics.draw(ctx, game.fruit, '')
        graphics.draw(ctx, snake.parts, "green")
    }
}

/** 
 *  processInput: function (keyPressed)
 *  startGame: function ()
 *  newGame: function()
 */
var gameControl = {
    processInput: function (keyPressed) {
        var key = keyPressed.key.toLowerCase()
        var targetDirection = snake.facing
        if (key == "w" || key == "??" || keyPressed.innerText == '??????????') targetDirection = "N"
        if (key == "a" || key == "??" || keyPressed.innerText == '????????????') targetDirection = "W"
        if (key == "s" || key == "??" || keyPressed.innerText == '????????') targetDirection = "S"
        if (key == "d" || key == "??" || keyPressed.innerText == '??????????') targetDirection = "E"
        snake.facing = targetDirection
        game.tick()
    },
    processBtnInput: function (keyPressed) {
        var targetDirection = snake.facing
        if (keyPressed.innerText == '??????????') targetDirection = "N"
        if (keyPressed.innerText == '??????????') targetDirection = "W"
        if (keyPressed.innerText == '????????') targetDirection = "S"
        if (keyPressed.innerText == '????????????') targetDirection = "E"
        snake.facing = targetDirection
        game.tick()
    },
    startGame: function () {
        window.addEventListener("keypress", gameControl.processInput, false)
        graphics.drawGame()
    },
    newGame: function() {
        window.location.reload()
    }
}
