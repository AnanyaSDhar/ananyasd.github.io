
var numSelected = null;
var tileSelected = null;

var errors = 0;

var board = [
    "--74916-5",
    "2---6-3-9",
    "-----7-1-",
    "-586----4",
    "--3----9-",
    "--62--187",
    "9-4-7---2",
    "67-83----",
    "81--45---"
//     "-87491625",
//     "241568379",
//     "569327418",
//     "758619234",
//     "123784596",
//     "496253187",
//     "934176852",
//     "675832941",
//     "81294576-"
]

var solution = [
    "387491625",
    "241568379",
    "569327418",
    "758619234",
    "123784596",
    "496253187",
    "934176852",
    "675832941",
    "812945763"
]

window.onload = function() {
    getRandomPuzzle();
    // Add event listener to the "Start" button
    document.getElementById("start-button").addEventListener("click", startGame);
}

function startGame() {
    
    // Hide the start screen
    document.getElementById("start-screen").style.display = "none";

    // Show the "Start again" button
    //document.getElementById("start-again").style.display = "block";

    // Start the game
    setGame();
}


function setGame() {
    startTimer();
    // Digits 1-9
    for (let i = 1; i <= 9; i++) {
        //<div id="1" class="number">1</div>
        let number = document.createElement("div");
        number.id = i
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
        document.getElementById("start-again").addEventListener("click", clearBoard);

    }

    // Board 9x9
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (board[r][c] != "-") {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
}

function selectNumber(){
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile() {
    if (numSelected) {
        if (this.innerText != "") {
            return;
        }

        // "0-0" "0-1" .. "3-1"
        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (solution[r][c] == numSelected.id) {
            this.innerText = numSelected.id;
            this.classList.add("tile-correct");
        }
        else {
            errors += 1;
            document.getElementById("errors").innerText = errors;
        }

        // Check if board matches solution
        let boardArray = [];
        for (let r = 0; r < 9; r++) {
            boardArray[r] = [];
            for (let c = 0; c < 9; c++) {
                let tile = document.getElementById(r.toString() + "-" + c.toString()).innerText;
                if (tile == "") {
                    boardArray[r].push("-");
                }
                else {
                    boardArray[r].push(tile);
                }
            }
        }

        let boardMatchesSolution = true;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (boardArray[r][c] != solution[r][c]) {
                    boardMatchesSolution = false;
                    break;
                }
            }
        }

        if (boardMatchesSolution) {
            clearInterval(timerInterval);
            var penalty = errors * 100; // Calculate penalty based on number of errors
            var score = Math.floor(1000000000 / elapsedTime) - penalty; // Subtract penalty from score
            var congratulations = document.getElementById("congratulations");
            var play_again = document.getElementById("play-again-logo");
            play_again.style.display = "block";
            //document.getElementById("celebration").style.display = "block";
            congratulations.innerHTML = "Congratulations! Your score is: <strong>" + score.toString() + "</strong>";
            congratulations.style.display = "block"; // Show the congratulations element
            // congratulations.okButton.display = "block";
            // congratulations.playAgainButton.display = "block";

            document.getElementById("play-again-logo").addEventListener("click", function() {
                location.reload();
               });
              
            var overlay = document.getElementById("overlay");
            overlay.style.display = "block"; // Show the overlay element

            // Show the celebratory elements
            //document.getElementById("celebration").style.display = "block";
    

            // Add onclick handler for OK button
            var okButton = document.getElementById("ok-button");
            okButton.onclick = function() {
                hideCongratulations();
            }

            // Add onclick handler for "Play Again" button
            var playAgainButton = document.getElementById("play-again-button");
            playAgainButton.onclick = function() {
                hideCongratulations();
                location.reload();
                getRandomPuzzle();
            }

            function hideCongratulations() {
                var congratulations = document.getElementById("congratulations");
                congratulations.style.display = "none"; // Hide the congratulations element
                var overlay = document.getElementById("overlay");
                overlay.style.display = "none"; // Hide the overlay element
            }
        }
    }
}

// Function to clear the user inputs in the board
function clearBoard() {
    for (let r = 0; r < 9; r++) {
        for (let c=0;c<9;c++){
          let tile=document.getElementById(r.toString()+"-"+c.toString());
          if(!tile.classList.contains("tile-start")){
              tile.innerText="";
              startTime = Date.now();
              errors = 0;
              document.getElementById("errors").innerText = 0;
          }
      }
   }
}


var startTime, elapsedTime, timerInterval;

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    var minutes = Math.floor(elapsedTime / 60000);
    var seconds = Math.floor((elapsedTime % 60000) / 1000);
    var timeString = ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
    document.getElementById("timer").innerText = timeString;
}

function getRandomPuzzle() {
    fetch("http://localhost:5000/puzzle")
    .then(response => response.text())
    .then(data => {board = data.split("\n").map(row => row.split(""));
    setGame();
    });
}
