// Creates the table grid and appends a grid square image to each td element
function createTable() {
    for (let row = 0; row < 6; row++) {
        let board = document.getElementById("board");
        let newRow = document.createElement("tr");
        board.appendChild(newRow);
        for (let col = 0; col < 7; col++) {
            let newCol = document.createElement("td");
            newRow.appendChild(newCol);

            let newImg = document.createElement("img");
            newImg.src = "grid.png"
            newCol.appendChild(newImg);
        }
    }
};
createTable();

/*
 * Checks for a win in every direction, given the location of last played token.
 * @return true if a win, false otherwise.
*/
function testWinCondition(row, col) {
    let t = boardState[row][col]; //last played token
    let bs = boardState;

    //DOWN
    if (row<=2 && t==bs[row+1][col] && t==bs[row+2][col] && t==bs[row+3][col])
        return (true);
    
    //DIAGONAL FORWARD - POSITION 1
    else if (row>=3 && col<=3 && t==bs[row-1][col+1] && t==bs[row-2][col+2] && t==bs[row-3][col+3])
        return (true);
    //DIAGONAL FORWARD - POSITION 2
    else if (row>=2 && row<=4 && col>=1 && col<=4 && t==bs[row+1][col-1] && t==bs[row-1][col+1] && t==bs[row-2][col+2])
        return (true);
    //DIAGONAL FORWARD - POSITION 3
    else if (row>=1 && row<=3 && col>=2 && col<=5 && t==bs[row+2][col-2] && t==bs[row+1][col-1] && t==bs[row-1][col+1])
        return (true);
    //DIAGONAL FORWARD - POSITION 4
    else if (row<=2 && col>=3 && t==bs[row+3][col-3] && t==bs[row+2][col-2] && t==bs[row+1][col-1])
        return (true);

    //DIAGONAL BACKWARD - POSITION 1
    else if (row<=2 && col<=3 && t==bs[row+1][col+1] && t==bs[row+2][col+2] && t==bs[row+3][col+3])
        return (true);
    //DIAGONAL BACKWARD - POSITION 2
    else if (row>=1 && row<=3 && col>=1 && col<=4 && t==bs[row-1][col-1] && t==bs[row+1][col+1] && t==bs[row+2][col+2])
        return (true);
    //DIAGONAL BACKWARD - POSITION 3
    else if (row>=2 && row<=4 && col>=2 && col<=5 && t==bs[row-2][col-2] && t==bs[row-1][col-1] && t==bs[row+1][col+1])
        return (true);
    //DIAGONAL BACKWARD - POSITION 4
    else if (row>=3 && col>=3 && t==bs[row-3][col-3] && t==bs[row-2][col-2] && t==bs[row-1][col-1])
        return (true);
    
    //HORIZONTAL - POSITION 1
    else if (col<=3 && t==bs[row][col+1] && t==bs[row][col+2] && t==bs[row][col+3])
        return (true);
    //HORIZONTAL - POSITION 2
    else if (col>=1 && col<=4 && t==bs[row][col-1] && t==bs[row][col+1] && t==bs[row][col+2])
        return (true);
    //HORIZONTAL - POSITION 3
    else if (col>=2 && col<=5 && t==bs[row][col-2] && t==bs[row][col-1] && t==bs[row][col+1])
        return (true);
    //HORIZONTAL - POSITION 4
    else if (col>=3 && t==bs[row][col-3] && t==bs[row][col-2] && t==bs[row][col-1])
        return (true);
    else 
        return (false);
};

//Displays message of who won, given who's turn it would be.
function printWinner() {
    let winner = document.getElementById("winner");
    if (turn == "yellow") {
        winner.innerText = "Red Wins!"
        winner.style.color = "red";
    } else if (turn == "red") {
        winner.innerText = "Yellow Wins!"
        winner.style.color = "yellow";
    }
}

//Highlights the playable cell within the same column of mouseEvent
function highlightCell(mouseEvent) {
    if (mouseEvent.target.tagName != "TD")
        return;
    let row = 6;
    let col = mouseEvent.target.cellIndex;
    let highlight = document.getElementById("highlight");

    while (--row >= 0) {
        if (!boardState[row][col])
            break;
    }
    if (row == -1) {
        highlight.style.visibility = "hidden";
        return;
    }
    let openCell = document.getElementById("board").rows[row].cells[col];
    let cellBounds = openCell.getBoundingClientRect();
    highlight.style.left = cellBounds.left + "px";
    highlight.style.top = cellBounds.top + "px";
    highlight.style.visibility = "visible";
}

/*
 * Adds proper colored token to the playable cell within the same column of mouseEvent
 * Tests for win condition after placing a token.
 * If game won: remove event listeners to prevent further play; print winner
*/
function addToken(mouseEvent) {
    if (mouseEvent.target.tagName != "TD")
        return;
    let row = 6;
    let col = mouseEvent.target.cellIndex;

    while (--row >= 0) {
        if (!boardState[row][col])
            break;
    }
    if (row == -1)
        return;
    let openCell = document.getElementById("board").rows[row].cells[col];
    if (turn == "yellow") {
        openCell.childNodes[0].src = "yellow.png";
        boardState[row][col] = 1;
        turn = "red";
    } else if (turn == "red") {
        openCell.childNodes[0].src = "red.png";
        boardState[row][col] = 2;
        turn = "yellow";
    }
    if (testWinCondition(row, col))
    {
        document.getElementById("board").removeEventListener("mouseover", highlightCell);
        document.removeEventListener("click", addToken);
        printWinner();
        return;
    }
    highlightCell(mouseEvent);
}

let turn = "yellow"; //current player's turn
/*
 * boardState represents the HTML table.
 * Each value represents type of game piece at that location on the board.
 * 0 = empty slot; 1 = yellow piece; 2 = red piece
*/ 
let boardState = [[0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0]];

/*
 * EVENT LISTENERS:
 *      - Highlight playable cell on mouseover.
 *      - Add token to playable cell on click.
 *      - Unhighlight playable cell upon leaving game board.
*/
document.getElementById("board").addEventListener("mouseover", highlightCell);
document.addEventListener("click", addToken);
document.getElementById("board").addEventListener("mouseleave", function() {
    document.getElementById("highlight").style.visibility = "hidden";
});