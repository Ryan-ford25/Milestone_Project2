/* global $ */
window.openRules = openRules;
window.openLeaderboard = openLeaderboard;
window.startGame = startGame;

//Game Variables
let game = {
    score: 0,
    currentGame: [],
    playerMoves: [],
    turnNumber: 0,
    lives: 3,
    highScore: 0,
    lastButton: "",
    turnInProgress: false,
    endGame: false,
    choices: ["button1", "button2", "button3", "button4", "button5", "button6", "button7", "button8", "button9"],
    turnInterval: null,
};

//When the rule button is clicked the class 'hidden' will be added to the welcome screen and removed from rules screen so that the rules can be displayed.
function openRules(){
    $("#rules_screen").removeClass("hidden");
    $("#welcome_screen").addClass("hidden");
    $("#start2").on("click", function(){
        $("#rules_screen").addClass("hidden");
        $("#game_screen").removeClass("hidden");
        newGame();
    });
    $("#leaderboard2").on("click", function(){
        $("#rules_screen").addClass("hidden");
        $("#leaderboard_screen").removeClass("hidden");
        showLeaderBoard();
    });
}

//openLeaderBoardFunction displays the leaderboard screen by removing the class 'hiddem'
function openLeaderboard(){
    $("#leaderboard_screen").removeClass("hidden");
    $("#welcome_screen").addClass("hidden");
    showLeaderBoard();
    $("#start3").on("click", function(){
        $("#leaderboard_screen").addClass("hidden");
        $("#game_screen").removeClass("hidden");
        newGame();
    });
    $("#rules2").on("click", function(){
        $("#rules_screen").removeClass("hidden");
        $("#leaderboard_screen").addClass("hidden");
    });
}

//startGame function adds the hidden class to the welcome screen and removes it from the game screen in order to display the grid
function startGame(){
    $("#welcome_screen").addClass("hidden");
    $("#game_screen").removeClass("hidden");
    $("#leaderboard_screen").addClass("hidden");
    newGame();
}

//Starts a new game resetting all game variables to their default values
function newGame(){
    const savedScore = localStorage.getItem("hScore");
    if (savedScore !== null){
        game.highScore = parseInt(savedScore);
    }
    game.lives = 3;
    game.score = 0;
    game.playerMoves = [];
    game.currentGame= [];
    for (let gridSquare of document.getElementsByClassName("grid_square")) {
        if (gridSquare.getAttribute("data-listener") !== "true"){             //Checks if it has a data listener of false
            gridSquare.addEventListener("click", (e) => {                     //Adds a click event listener to the square
                if(game.currentGame.length > 0 && !game.turnInProgress) {     //Checks if the length is more than 0 and if input is set to true
                    let move = e.target.getAttribute("id");                   //Gets the id of the clicked square then stores it in the variable move
                    game.lastButton = move;                                   //Stores the move within the last button variable 
                    lightUp(move);                                            //runs the lightUp function with the value move
                    game.playerMoves.push(move);                              //Adds the 'move' to the player moves variable
                    playerTurn();                                             //Runs the players move function
                }
            });
            gridSquare.setAttribute("data-listener", "true");                 //Sets the squares data listener to true
        }
    }
    showLives();
    showScore();                                                              //Runs the corresponding function.
    addTurn();
    highScore();
}

//addTurn function empties the player moves variable and then extends and displays the sequence
function addTurn(){
    game.playerMoves = [];
    game.currentGame.push(game.choices[(Math.floor(Math.random()*9))]);
    showTurns();
}

//ShowScore function takes the value of variable score and displays it with the message 'Score: '
function showScore(){
    document.getElementById("score").innerText = `Score: ${game.score}`;
}

//ShowLives function takes the value of the variable lives and displays it with the message 'Lives: '
function showLives(){ //Displays the players lives
    document.getElementById("lives").innerText = `Lives: ${game.lives}`;
}

//Adds the class 'lit' from the css file to the chosen square in order to "light" the square up (changes opacity)
function lightUp(sqr){ 
    document.getElementById(sqr).classList.add("lit");
    setTimeout(() => {
        document.getElementById(sqr).classList.remove("lit");
    }, 400);
}

//ShowTurns function displays the sequence to the player
function showTurns(){
    game.turnInProgress = true;                                   //Sets the turnInProgress variable to true, which will prevent player input
    game.turnNumber = 0;                                         //Sets the turnNumber variable to 0
    if (game.turnInterval !== null){                            //If statement resets any current turnIntervals in order to prevent overlapping(doing this fixed an error with the sequence being played too fast after selecting start from the end screen)
        clearInterval(game.turnInterval);                               
    }
    game.turnInterval = setInterval(() => {                     //Sets a new interval to display the sequence with
        lightUp(game.currentGame[game.turnNumber]);
        game.turnNumber++;                                       //increases the value of the variable turnNumber by 1 to add a square to the current sequence
        if (game.turnNumber >= game.currentGame.length){        //if statement checks if the turnNumber variable is greater than or equal to the current games length and then stops the interval
            clearInterval(game.turnInterval);                   
            game.turnInterval = null;                           //sets the value of variable turnInterval to null
            game.turnInProgress = false;                        //sets value of turnInProgress to false to allow user input
        }
    }, 800);
}

//playerTurn function takes the users input and checks if it matches the sequence the computer generated
function playerTurn(){
    let n = game.playerMoves.length -1;                             //stores the index of the players last move to n
    if (game.currentGame[n] === game.playerMoves[n]){               //Checks if the players chosen squares matches the ones that were generated by the computer 
        if (game.currentGame.length === game.playerMoves.length){   //Checks if the length of the current game and the players input match
            game.score++;                                           //If they match the score is increased by 1
            highScore();                                            //Runs highScore function
            showLives();                                            //Runs the showLives function
            showScore();                                            //Runs showScore function
            addTurn();                                              //Runs addTurn function
        }
    } else{                                                         //If the moves and length does not match then the following steps are carried out instead
        game.lives = game.lives -1;                                 //Decreases the value of the variable lives by 1
        showLives();                                                 //Runs the showLives function(displaying the newly updated value)
        if (game.lives == 0){                                       //Checks if the value of lives is equal to 0
            endGame();                                              //If it is then the endGame function is ran
        } else {
            game.playerMoves=[];                                    //If it is not equal to 0, the playerMoves variable is reset
            setTimeout(() => {                                      //Uses the timeout function in order to add an 800 millisecond delay
                showTurns();                                        //Runs the showTurns function which will repeat the last sequence 
            }, 800);
        }
    }
}

//endScore function displays the players score within the message 'You made it to level: '
function endScore(){
    document.getElementById("end_score").innerText = `You made it to Level: ${game.score}`;
}

//newHighScoreFunction is used to display the 'New high score!' message when a new high score is achieved
function newHighScore(){
    document.getElementById("high_score_message").classList.remove("hidden");                       //Removes the class 'hidden' from the element that has the id of 'high_score_message'
    document.getElementById("high_score_message").innerText = `New High Score! Congratulations`;    //Displays the message 'New High Score! Congratulations'
    setTimeout(() => {                                                                              //Sets a timeout of 2 seconds
        document.getElementById("high_score_message").classList.add("hidden");                      //Adds the class 'hidden' to element with id 'high_score_message'
    }, 2000);
}


//HighScore function updates the 'High score: ' display
function highScore(){                                                      
    if(game.score > game.highScore){                                                    //Checks if the current game score is higher than what is stored in current game.highScore variable
        game.highScore = game.score;                                                   //If it is then the game.highScore variable will be updated
        localStorage.setItem("hScore", game.highScore);                                //Stores the score locally in the browser inside the variable 'hScore'
        newHighScore();                                                                 //Runs the newHighScore function
    }
    document.getElementById("high_score").innerText = `High Score: ${game.highScore}`; //Displays the current High score
}

//leaderBoard function adds the users name and score to the leaderboard screen
function leaderBoard(){
    const playerName = prompt("Enter your name for the Leaderboard: ");               //Sets a constant variable playerName as an input taken from the user with the prompt "Enter your name for the leaderboard: "
    localStorage.setItem("name", playerName);                                        //Stores the players name in local storage
    const finalScore = game.score;                                                    //Takes the value from the game.score variable and stores it in finalScore
    const leaderScores = JSON.parse(localStorage.getItem("leaderScores")) || [];     //Stores the value from the leaderScores variable locally if it doesn't exist it'll return null, the JSON.parse converts the string to an array, it'll default to an empty array if 'null' is passed.
    const playerScore = {playerName, finalScore};                                   //Sets the playerScore variable with two properties 'playerName' and 'finalScore'
    leaderScores.push(playerScore);                                                 //Will push the playerScore value to leaderScores array
    leaderScores.sort((a, b) => b.finalScore - a.finalScore);                       //Sorts the items by order of biggest to largest based on the value of the finalScore variable
    leaderScores.splice(10);                                                        //The leaderboard will only display the top ten scores
    localStorage.setItem("leaderScores", JSON.stringify(leaderScores));             //Converts the array back to a string
    showLeaderBoard();                                                              //Runs the showLeaderBoard function
}

function showLeaderBoard(){
    const leaderTable = document.querySelector("#ranking tbody");                       
    leaderTable.innerHTML = "";                                                         
    const leaderScores = JSON.parse(localStorage.getItem("leaderScores")) || [];       
    leaderScores.forEach((entry, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${index + 1}</td>
        <td>${entry.playerName}</td>
        <td>${entry.finalScore}</td>
        `;
        leaderTable.appendChild(row);
    });
}

//endGame function displays a message after the lives have reached 0 and then waits for an input from the user 
function endGame() {
    $("#game_screen").addClass("hidden");             //Adds the css class 'hidden' to the game screen in order to hide it 
    $("#end_screen").removeClass("hidden");            //Removes the class 'hidden' to display the end screen message
    endScore();
    leaderBoard();                                     //Runs the endScore function to display the level reached
    $("#end_screen").on("click", function(){          //users a click listener to wait for input from the user
        $("#end_screen").addClass("hidden");           //When the user clicks on end screen the 'hidden' class will be added to the end screen to hide it
        $("#welcome_screen").removeClass("hidden");    //Removes the class 'hidden' from welcome screen to display it again allowing the user to restart
    });
}