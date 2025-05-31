//Game Variables
let game = {
    score: 0,
    currentGame: [],
    playerMoves: [],
    turnNumber: 0,
    lives: 3,
    lastButton: "",
    turnInProgress: false,
    endGame: false,
    choices: ["button1", "button2", "button3", "button4", "button5", "button6", "button7", "button8", "button9"],
    turnInterval: null,
}

function openRules(){ //When the rule button is clicked the class 'hidden' will be added to the welcome screen and removed from rules screen so that the rules can be displayed.
    $("#rules_screen").removeClass("hidden");
    $("#welcome_screen").addClass("hidden");
    $("#start2").on("click", function(){
        $("#rules_screen").addClass("hidden");
        $("#game_screen").removeClass("hidden");
        newGame();
    })
}

function startGame(){
    $("#welcome_screen").addClass("hidden");
    $("#game_screen").removeClass("hidden");
    newGame();
}


function newGame(){
    game.lives = 3;//Sets the game variables at the start of every game.
    game.score = 0;
    game.playermoves = [];
    game.currentGame= [];
    for (let gridSquare of document.getElementsByClassName("grid_square")) {
        if (gridSquare.getAttribute("data-listener") !== "true"){//Checks if it has a data listener of false
            gridSquare.addEventListener("click", (e) => {//Adds a click event listener to the square
                if(game.currentGame.length > 0 && !game.turnInProgress) { //Checks if the length is more than 0 and if input is set to true
                    let move = e.target.getAttribute("id"); //Gets the id of the clicked square then stores it in the variable move
                    game.lastButton = move; //Stores the move within the last button variable 
                    lightUp(move); //Lights up the square that has been clicked
                    game.playerMoves.push(move); //Adds the 'move' to the player moves variable
                    playerTurn(); //Runs the players move function
                }
            });
            gridSquare.setAttribute("data-listener", "true"); //Sets the squares data listener to true
        }
    }
    showLives();
    showScore();//Runs the corresponding function.
    addTurn();
}

//addTurn function empties the player moves variable and then extends and displays the sequence
function addTurn(){
    game.playerMoves = [];
    game.currentGame.push(game.choices[(Math.floor(Math.random()*9))]);
    showTurns();
}

function showScore(){ //Displays the players score
    document.getElementById("score").innerText = `Score: ${game.score}`
}

function showLives(){ //Displays the players lives
    document.getElementById("lives").innerText = `Lives: ${game.lives}`
}

function lightUp(sqr){ //Adds the class 'lit' to relevent square then removes the class after a 300 milliseconds delay
    document.getElementById(sqr).classList.add("lit");
    setTimeout(() => {
        document.getElementById(sqr).classList.remove("lit");
    }, 400);
}

function showTurns(){
    game.turnInProgress = true;
    game.turnNumber = 0;
    if (game.turnInterval !== null){
        clearInterval(game.turnInterval);
    }
    game.turnInterval = setInterval(() => {
        lightUp(game.currentGame[game.turnNumber]);
        game.turnNumber++;
        if (game.turnNumber >= game.currentGame.length){
            clearInterval(game.turnInterval);
            game.turnInterval = null;
            game.turnInProgress = false;
        }
    }, 800);
}

function playerTurn(){
    let n = game.playerMoves.length -1;
    if (game.currentGame[n] === game.playerMoves[n]){
        if (game.currentGame.length === game.playerMoves.length){
            game.score++;
            showLives();
            showScore();
            addTurn();
        }
    } else{
        game.lives = game.lives -1;
        showLives()
        if (game.lives == 0){
            endGame();
        } else {
            game.playerMoves=[];
            setTimeout(() => {
                showTurns();
            }, 800);
        }
    }
}

function endGame() {
    $("#game_screen").addClass("hidden");
    $("#end_screen").removeClass("hidden");
    $("#end_screen").on("click", function(){
        $("#end_screen").addClass("hidden");
        $("#welcome_screen").removeClass("hidden");
    })
}
