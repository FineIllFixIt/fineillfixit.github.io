// Game Params
let playing = false;
let gridDim = 75;
let blockSize = 20;
let simulating = false;

let turn = 0;
let currentSwitch = 0;
let currentRound = 0;
let currSimStep = 0;
let currentPlayer = 1;
let mouseDown = false;
let finished = false;
let simFinished = false;

// How many cells do players get to put down each time it is their turn
let turnsPerSwitch = 5;
// How many times do you cycle through players before doing a simulation round
let switchesPerRound = 1;
// How many simuilation rounds do you have before the game ends
let roundsPerGame = 5;
// How long do you run the simulation for each sim step
let simStepsPerRound = 50;
// How many people are playing
let playerCount = 2;
// Do opponents take other players resources
let aggressivePlayers = false;

let headerSize = 50;
let cellMargin = 2;
let borderWidth = 5;
let colors = [];

let gameBoard;

let canvas = document.getElementById("gameboard");
let ctx = canvas.getContext("2d");
let startButton = document.getElementById("start_button");

function resizeCanvas() {
    // 1. Get the device pixel ratio (e.g., 2 for Retina, 1 for standard)
    const dpr = window.devicePixelRatio || 1;
    
    // 2. Define the desired visual layout size in CSS pixels
    const displayWidth = 750; 
    const displayHeight = 750;

    // 3. Set the layout size via CSS styles
    canvas.style.width = displayWidth + "px";
    canvas.style.height = displayHeight + "px";

    // 4. Scale the actual internal drawing bitmap by the pixel ratio
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;

    // 5. Scale the context so your drawing coordinates don't break
    ctx.scale(dpr, dpr);
}
resizeCanvas();
resetVariables();
drawGrid(gameBoard);

function resetVariables() {
    let valid = true;

    turn = 0;
    currentSwitch = 0;
    currentRound = 0;
    currSimStep = 0;
    currentPlayer = 1;
    mouseDown = false;
    finished = false;
    simFinished = false;

    // How many cells do players get to put down each time it is their turn
    turnsPerSwitch = document.getElementById("turnsPerSwitch").valueAsNumber;
    // How many times do you cycle through players before doing a simulation round
    switchesPerRound = document.getElementById("switchPerRound").valueAsNumber;
    // How many simuilation rounds do you have before the game ends
    roundsPerGame = document.getElementById("roundsPerGame").valueAsNumber;
    // How long do you run the simulation for each sim step
    simStepsPerRound = document.getElementById("simStepsPerRound").valueAsNumber;
    // How many people are playing
    playerCount = document.getElementById("playerNum").valueAsNumber;
    // Do opponents take other players resources
    aggressivePlayers = document.getElementById("agressive").checked;
    gridDim = document.getElementById("gridDim").valueAsNumber;

    if (!turnsPerSwitch || turnsPerSwitch < 5 || turnsPerSwitch > 100) {
        valid = false;
    }
    if (!switchesPerRound || switchesPerRound < 1 || switchesPerRound > 10) {
        valid = false;
    }
    if (!roundsPerGame || roundsPerGame < 1 || roundsPerGame > 50) {
        valid = false;
    }
    if (!simStepsPerRound || simStepsPerRound < 5 || simStepsPerRound > 500) {
        valid = false;
    }
    if (!playerCount || playerCount < 2 || playerCount > 10) {
        valid = false;
    }
    if (!gridDim || gridDim < 20 || gridDim > 200) {
        valid = false;
    }

    colors = getUniqueRgbColors(playerCount);

    gameBoard = Array.from({ length: gridDim }, () => Array(gridDim).fill(0));

    if (!valid) {
        document.getElementsByClassName("form-error")[0].classList.remove("hidden");
    } else {
        document.getElementsByClassName("form-error")[0].classList.add("hidden");
    }

    return valid;
}

// Helper functions
function drawGrid(gameBoard) {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    blockSize = ((ctx.canvas.width - (2 * borderWidth)) / (gridDim));
    let xPos = borderWidth;
    let yPos = borderWidth;
    for (x = 0; x < gameBoard.length; x++) {
        for(y = 0; y < gameBoard.length; y++) {
            ctx.fillStyle = colors[gameBoard[x][y]];
            ctx.fillRect(xPos, yPos, blockSize, blockSize);
            ctx.strokeRect(xPos, yPos, blockSize, blockSize);
            yPos += blockSize;
        }
        yPos = borderWidth;
        xPos += blockSize;
    }
}

function stepBoard(gameBoard){
    let newBoard = Array.from({ length: gridDim }, () => Array(gridDim).fill(0));
    let playerScores = new Array(playerCount);
    for(x = 0; x < gridDim; x++) {
        for(y = 0; y < gridDim; y++) {
            let cell = gameBoard[x][y];
            if (cell == 0) {
                let capturingPlayer = 0;
                for(i = 1; i < playerCount+1; i++) {
                    let cellResources = 0;
                    if (aggressivePlayers) {
                        cellResources = getCellResourcesAggresive(x, y, i);
                    } else {
                        cellResources = getCellResources(x, y, i);
                    }
                    if (cellResources == 3) {
                        if (capturingPlayer) {
                            capturingPlayer = 0;
                            break
                        } else {
                            capturingPlayer = i;
                        }
                    }
                }
                newBoard[x][y] = capturingPlayer;
                if (capturingPlayer != 0) {
                    playerScores[capturingPlayer - 1] += 1;
                }
            } else {
                let cellResources = 0;
                if (aggressivePlayers) {
                    cellResources = getCellResourcesAggresive(x, y, cell);
                } else {
                    cellResources = getCellResources(x, y, cell);
                }
                if (cellResources > 3) {
                    newBoard[x][y] = 0;
                }
                if (cellResources == 3 || cellResources == 2) {
                    newBoard[x][y] = cell
                    playerScores[cell - 1] += 1;
                }
                if (cellResources < 2) {
                    newBoard[x][y] = 0;
                }
            }
        }
    }
    return [newBoard, playerScores];
}

function getCellResources(x, y, player){
    let resources = 0; 
    if (x != 0 && y != 0 && gameBoard[x-1][y-1] == player) {
        resources = 1;
    } 
    if (y != 0 && gameBoard[x][y-1] == player) {
        resources += 1
    }
    if (x != gridDim-1 && y != 0 && gameBoard[x+1][y-1] == player) {
        resources += 1;
    }
    if (x != 0 && gameBoard[x-1][y] == player){
        resources += 1;
    }
    if (x != gridDim-1 && gameBoard[x+1][y] == player) {
        resources += 1;
    }
    if (x != 0 && y != gridDim-1 && gameBoard[x-1][y+1] == player) {
        resources += 1;
    }
    if (y != gridDim-1 && gameBoard[x][y+1] == player) {
        resources += 1
    }
    if (x != gridDim-1 && y != gridDim-1 && gameBoard[x+1][y+1] == player) {
        resources += 1;
    }
    return resources
}

function getCellResourcesAggresive(x, y, player) {
    let resources = 0 
    if (x != 0 && y != 0 && gameBoard[x-1][y-1] != 0 && gameBoard[x-1][y-1] == player) {
        resources += 1
    } else if (x != 0 && y != 0 && gameBoard[x-1][y-1] != 0 && gameBoard[x-1][y-1] != player) {
        resources -= 1;
    } 
    if (y != 0 && gameBoard[x][y-1] != 0 && gameBoard[x][y-1] == player) {
        resources += 1;
    } else if (y != 0 && gameBoard[x][y-1] != 0 && gameBoard[x][y-1] != player) {
        resources -= 1;
    }
    if (x != gridDim-1 && y != 0 && gameBoard[x+1][y-1] != 0 && gameBoard[x+1][y-1] == player) {
        resources += 1;
    } else if (x != gridDim-1 && y != 0 && gameBoard[x+1][y-1] != 0 && gameBoard[x+1][y-1] != player) {
        resources -= 1;
    }
    if (x != 0 && gameBoard[x-1][y] != 0 && gameBoard[x-1][y] == player) {
        resources += 1;
    } else if (x != 0 && gameBoard[x-1][y] != 0 && gameBoard[x-1][y] != player) {
        resources -= 1;
    }
    if (x != gridDim-1 && gameBoard[x+1][y] != 0 && gameBoard[x+1][y] == player) {
        resources += 1;
    } else if (x != gridDim-1 && gameBoard[x+1][y] != 0 && gameBoard[x+1][y] != player) {
        resources -= 1;
    }
    if (x != 0 && y != gridDim-1 && gameBoard[x-1][y+1] != 0 && gameBoard[x-1][y+1] == player) {
        resources += 1;
    } else if (x != 0 && y != gridDim-1 && gameBoard[x-1][y+1] != 0 && gameBoard[x-1][y+1] != player) {
        resources -= 1;
    }
    if (y != gridDim-1 && gameBoard[x][y+1] != 0 && gameBoard[x][y+1] == player) {
        resources += 1;
    } else if (y != gridDim-1 && gameBoard[x][y+1] != 0 && gameBoard[x][y+1] != player) {
        resources -= 1;
    }
    if (x != gridDim-1 && y != gridDim-1 && gameBoard[x+1][y+1] != 0 && gameBoard[x+1][y+1] == player) {
        resources += 1;
    } else if (x != gridDim-1 && y != gridDim-1 && gameBoard[x+1][y+1] != 0 && gameBoard[x+1][y+1] != player) {
        resources -= 1;
    }
    return resources
}

function getPlayerScores(){
    playerScores = new Array(playerCount).fill(0);
    for (x = 0; x < gridDim; x++) {
        for (y = 0; y < gridDim; y++) {
            cell = gameBoard[x][y]
            if (cell != 0) {
                playerScores[cell - 1] += 1;
            }
        }
    }
    return playerScores
}

function getUniqueRgbColors(n) {
  const colors = ["rgb(255,255,255)"];
  for (let i = 0; i < n; i++) {
    const hue = (i * (360 / n)) % 360;
    // Using 70% saturation and 50% lightness for vibrant, clear colors
    colors.push(`rgb(${hslToRgb(hue, 0.7, 0.5)})`);
  }
  return colors;
}

function hslToRgb(h, s, l) {
  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h < 360) { r = c; g = 0; b = x; }
  return `${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)}`;
}

function displayPlayerScores () {
    let scoreSection = document.getElementById("playerScores");
    let scoresHeader = document.getElementById("playerScoresHeader");
    scoresHeader.textContent = "Player Scores"
    scoreSection.innerHTML = "";
    playerScores = getPlayerScores();
    for (i = 0; i < playerScores.length; i++) {
        player = playerScores[i];
        let newScore = document.createElement("h5");
        newScore.style.color = colors[i + 1];
        newScore.style.margin = "0"
        newScore.textContent = "Player #" + String(i + 1) + ": " + player;
        scoreSection.append(newScore);
    }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

canvas.addEventListener("mousedown", (event) => {
    mouseDown = true;
});

document.addEventListener("mouseup", (event) => {
    mouseDown = false;
});

canvas.addEventListener("mousemove", async (event) => {
    let canvasRect = canvas.getBoundingClientRect();
    let pos = [event.clientX - canvasRect.x, event.clientY - canvasRect.y];
    displayPlayerScores();
    if (mouseDown && !simulating) {
        if (currentPlayer == 0) {

        } else if (mouseDown && currentPlayer != 0) {
            xInd = Math.floor((pos[0] - borderWidth) / blockSize)
            yInd = Math.floor((pos[1] - borderWidth) / blockSize)
            if (xInd < gridDim && yInd < gridDim) {
                if (gameBoard[xInd][yInd] == 0) { 
                    gameBoard[xInd][yInd] = currentPlayer
                    turn += 1
                } else if (gameBoard[xInd][yInd] == currentPlayer) {
                    gameBoard[xInd][yInd] = 0
                    turn -= 1
                    if (turn < 0) {
                        turn = 0
                    }
                }
            }
        }

        if (turn == turnsPerSwitch) {
            turn = 0;
            currentPlayer = ((currentPlayer + 1) % (playerCount + 1));
            mouseDown = false;
            if (currentPlayer == 0) {
                currentSwitch += 1;
                if (currentSwitch != switchesPerRound) {
                    currentPlayer = 1;
                } else {
                    currentSwitch = 0;
                    currentRound += 1;
                }
            }
        }
        
        if (currentRound == roundsPerGame) {
            finished = true;
        }

        let gameStatus = document.getElementById("gameStatus");
        playerScores = []
        if (currentPlayer == 0) {
            simulating = true;
            gameStatus.innerHTML =  "Simulating, Please Wait.";
            gameStatus.style.color = "#000";
            while (currSimStep < simStepsPerRound) {
                displayPlayerScores();
                [gameBoard, playerScores] = stepBoard(gameBoard);
                drawGrid(gameBoard);
                currSimStep += 1;
                await sleep(50);
            }
            currSimStep = 0;
            currentPlayer = 1;
            mouseDown = false;
            simulating = false;
        } else {
            playerScores = getPlayerScores()
        }
        if (finished) {
            simFinished = true;
        }
        
        if (currentPlayer != 0) {
            gameStatus.innerHTML =  "Player " + String(currentPlayer) + "'s Turn";
            gameStatus.style.color = colors[currentPlayer];
        }

        drawGrid(gameBoard);

        maxPlayer = 0;
        maxScore = 0;
        for (i = 0; i < playerScores.length; i++) {
            displayPlayerScores();
            if (maxScore < playerScores[player]) {
                maxPlayer = player;
                maxScore = playerScores[player];
            }
        }
        if (simFinished) {
            //win_text = mainHeader.render("Player //" + str(maxPlayer + 1) + " Wins!", True, (0,0,0))
            //score_text = mainHeader.render("Score: " + str(maxScore), True, (0,0,0))
            //rect = pygame.Rect((min((gridDim*blockSize/2) - (win_text.get_width() / 2), (gridDim*blockSize/2) - (score_text.get_width() / 2)) - 25), 175, max(win_text.get_width(), score_text.get_width()) + 50, 125)
            //pygame.draw.rect(screen, (200, 200, 200), rect)
            //screen.blit(win_text, ((gridDim*blockSize/2) - (win_text.get_width() / 2), 200))
            //screen.blit(score_text, ((gridDim*blockSize/2) - (score_text.get_width() / 2), 250))
            playing = false;
            let overlay = document.getElementById("gameboardOverlay");
            overlay.innerHTML = "";
            let win = document.createElement("h1");
            win.textContent = "Player " + String(maxPlayer + 1) + " Wins!";
            overlay.append(win);
            overlay.append(document.createElement("br"));
            let score = document.createElement("h1");
            score.textContent = "Score: " + String(maxScore);
            overlay.append(score);
            overlay.append(document.createElement("br"));
            let message = document.createElement("h1");
            message.textContent = "Press start to play again.";
            overlay.append(message);
            overlay.style.display = "block";
            startButton.innerHTML = "";
            startButton.textContent = "Start";
            startButton.style.backgroundColor = "#0099ff";
            enableInputs();
        }
    }
});

function disableInputs() {
    document.querySelectorAll('input').forEach(input => {
        input.disabled = true;
    });
}

function enableInputs() {
    document.querySelectorAll('input').forEach(input => {
        input.disabled = false;
    });
}

startButton.addEventListener('click', () => {
    let valid = resetVariables();
    if (valid && !playing) {
        disableInputs();
        let gameStatus = document.getElementById("gameStatus");
        gameStatus.innerHTML =  "Player 1's Turn";
        gameStatus.style.color = colors[currentPlayer];
        displayPlayerScores();
        drawGrid(gameBoard);
        playing = true;
        document.getElementById("gameboardOverlay").style.display = "none";
        startButton.innerHTML = "";
        startButton.textContent = "Stop Game";
        startButton.style.backgroundColor = "#ff3333";
    } else if (playing) {
        enableInputs();
        playing = false;
        document.getElementById("gameboardOverlay").style.display = "block";
        startButton.innerHTML = "";
        startButton.textContent = "Start";
        startButton.style.backgroundColor = "#0099ff";
    }
});
