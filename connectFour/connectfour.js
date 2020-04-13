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

let turn = "yellow";
let boardState = [[0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0]];

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
}

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
        console.log("winnawinna");
        document.getElementById("board").removeEventListener("mouseover", highlightCell);
        document.removeEventListener("click", addToken);
        printWinner();
        return;
    }
    highlightCell(mouseEvent);
}

document.getElementById("board").addEventListener("mouseover", highlightCell);

document.addEventListener("click", addToken);

document.getElementById("board").addEventListener("mouseleave", function() {
    document.getElementById("highlight").style.visibility = "hidden";
});