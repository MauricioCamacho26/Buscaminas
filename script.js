let board = [];
let rows, columns, mines;
let firstClick = true;
let revealedCells = 0;


function setDifficulty(r, c, m) {
    document.getElementById("rows").value = r;
    document.getElementById("columns").value = c;
    document.getElementById("mines").value = m;
    startGame();
}


function startGame() {
    rows = parseInt(document.getElementById("rows").value);
    columns = parseInt(document.getElementById("columns").value);
    mines = parseInt(document.getElementById("mines").value);

    if (rows < 5 || columns < 5 || mines < 1 || mines >= rows * columns) {
        alert("Configuración no válida. Verifique los valores.");
        return;
    }

    board = [];
    firstClick = true;
    revealedCells = 0;

    let boardElement = document.getElementById("board");
    boardElement.innerHTML = "";
    boardElement.style.gridTemplateColumns = `repeat(${columns}, 60px)`;

    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < columns; j++) {
            row.push({ isMine: false, revealed: false, flagged: false, count: 0 });

            let cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.dataset.row = i;
            cellElement.dataset.column = j;
            cellElement.addEventListener("click", () => handleClick(i, j));
            cellElement.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                handleFlag(i, j);
            });

            boardElement.appendChild(cellElement);
        }
        board.push(row);
    }

    document.getElementById("mineCounter").textContent = `Minas: ${mines}`;
}


function handleClick(row, col) {
    if (firstClick) {
        placeMines(row, col);
        firstClick = false;
    }

    revealCell(row, col);
    checkWin();
}


function placeMines(excludeRow, excludeCol) {
    let placedMines = 0;
    while (placedMines < mines) {
        let randomRow = Math.floor(Math.random() * rows);
        let randomCol = Math.floor(Math.random() * columns);

        if ((randomRow !== excludeRow || randomCol !== excludeCol) && !board[randomRow][randomCol].isMine) {
            board[randomRow][randomCol].isMine = true;
            placedMines++;
            updateAdjacentCells(randomRow, randomCol);
        }
    }
}


function updateAdjacentCells(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newRow = row + i;
            let newCol = col + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < columns && !board[newRow][newCol].isMine) {
                board[newRow][newCol].count++;
            }
        }
    }
}


function revealCell(row, col) {
    let cell = board[row][col];
    if (cell.revealed || cell.flagged) return;

    cell.revealed = true;
    revealedCells++;

    let cellElement = document.querySelector(`[data-row='${row}'][data-column='${col}']`);
    cellElement.classList.add("revealed");
    cellElement.textContent = cell.isMine ? "💣" : cell.count > 0 ? cell.count : "";

    if (cell.isMine) {
        cellElement.classList.add("mine");
        revealAllMines();
        alert("¡Has perdido!");
        return;
    }

    if (cell.count === 0) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let newRow = row + i;
                let newCol = col + j;
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < columns) {
                    revealCell(newRow, newCol);
                }
            }
        }
    }
}


function revealAllMines() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (board[i][j].isMine) {
                let cellElement = document.querySelector(`[data-row='${i}'][data-column='${j}']`);
                cellElement.classList.add("mine");
                cellElement.textContent = "💣";
            }
        }
    }
}


function checkWin() {
    if (revealedCells === rows * columns - mines) {
        alert("¡Felicidades, has ganado!");
    }
}

function handleFlag(row, col) {
    let cell = board[row][col];
    if (cell.revealed) return;

    cell.flagged = !cell.flagged;
    let cellElement = document.querySelector(`[data-row='${row}'][data-column='${col}']`);
    cellElement.textContent = cell.flagged ? "🚩" : "";
}
