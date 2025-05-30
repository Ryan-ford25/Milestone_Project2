tion//Game Variables
let game = {
    score: 0,
    currentGame: [],
    playerMoves: [],
    turnNumber: 0,
    lives: 3,
    lastButton: "",
    allowInput: false,
    endGame: false,
    choices: ["button1", "button2", "button3", "button4", "button5", "button6", "button7", "button8", "button9"],
}

function openRules(){ //When the rule button is clicked the class 'hidden' will be added to the welcome screen and removed from rules screen so that the rules can be displayed.
    $("#rules_screen").removeClass("hidden");
    $("#welcome_screen").addClass("hidden");
    $("#start2").on("click", function(){
        $("#rules_screen").addClass("hidden");
        $("#game_screen").removeClass("hidden");
        startGame();
    })
}

function startGame(){
    $("#welcome_screen").addClass("hidden");//Adds the hidden class to the welcome screen to hide it.
    $("#game_screen").removeClass("hidden");//Removes the hidden class from game screen to show the playing area.
    game.lives = 3;//Sets the game variables at the start of every game.
    game.score = 0;
    game.playermoves = [];
    game.currentGame= [];
    for (let gridSquare of document.getElementsByClassName("grid_square")) {
        if (gridSquare.getAttribute("data-listener") !== "true"){//Checks if it has a data listener of false
            gridSquare.addEventListener("click", (e) => {//Adds a click event listener to the square
                if(game.currentGame.length > 0 && !allowInput) {//Checks if the length is more than 0 and if input is set to true
                    let move = e.target.getAttribute("id");//Gets the id of the clicked square then stores it in the variable move
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

function lightUp(sqr){ //Adds the class 'lit' to relevent square then removes the class after a 300 milliseconds delay
    document.getElementById(sqr).classList.add("lit");
    seTimeout(() => {
        document.getElementById(sqr).classList.remove("lit");
    }, 300);
}