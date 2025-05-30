//Game Variables
let game = {
    score: 0,
    currentGame: [],
    playerMoves: [],
    turnNumber: 0,
    lives: 3,
    lastNumber: "",
    allowInput: false,
    endGame: false,
    choices: ["button1", "button2", "button3", "button4", "button5", "button6", "button7", "button8", "button9"],
}

function openRules(){
    $("#rules_screen").removeClass("hidden");
    $("#welcome_screen").addClass("hidden");
    $("#start2").on("click", function(){
        $("#rules_screen").addClass("hidden");
        $("#game_screen").removeClass("hidden");
        startGame();
    })
}

function startGame(){
    $("#welcome_screen").addClass("hidden");
    $("#game_screen").removeClass("hidden");
    game.lives = 3;
    game.score = 0;
    game.playermoves = [];
    game.currentGame= [];
    for (let gridSquare of document.getElementsByClassName("grid_square")) {
        if (gridSquare.getAttribute("data-listener") !== "true"){
            gridSquare.addEventListener("click", (e) => {
                if(game.currentGame.length > 0 && !allowInput) {
                    let move = e.target.getAttribute("id");
                    game.lastButton = move;
                    lightUp(move);
                    game.playerMoves.push(move);
                    playerTurn();
                }
            });
            gridSquare.setAttribute("data-listener", "true");
        }
    }
    showLives();
    showScore();
    addTurn();
}

//addTurn function empties the player moves variable and then displays the next sequence
function addTurn(){
    game.playerMoves = [];
    let random = game.choices[(Math.floor(Math.random()*9))];
    game.currentGame.push(random);
    showTurns();
}

function showScore(){ //Displays the players score
    document.getElementById("score").innerText = `Score: ${game.score}`
}

function showLives(){ //Displays the players lives
    document.getElementById("lives").innerText = `Lives: ${game.lives}`
}

function lightUp(sqr){ //Adds the class 'lit' to relavent square then removes the class after a 300 milliseconds delay
    document.getElementById(sqr).classList.add("lit");
    seTimeout(() => {
        document.getElementById(sqr).classList.remove("lit");
    }, 300);
}