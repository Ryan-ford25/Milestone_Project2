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

function startGame(){
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

function openRules(){
    
}