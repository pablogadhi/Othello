const propagateCheck = function (start, deltaX, deltaY, board, playerNum) {
    const position = start + deltaX + (8 * deltaY);
    if (position >= 0 && position < 64) {
        if ((deltaX > 0 && position % 8 < start % 8) || (deltaX < 0 && position % 8 > start % 8) || board[position] == 0) {
            return false
        }

        if (board[position] === playerNum) {
            return true;
        } else {
            return propagateCheck(position, deltaX, deltaY, board, playerNum);
        }
    }
    return false;
};

const isValid = function (position, board, playerNum) {
    //Check north
    let firstNeighbour = position - 8;
    if (firstNeighbour >= 0 && board[firstNeighbour] !== playerNum && board[firstNeighbour] !== 0) {
        if (propagateCheck(firstNeighbour, 0, -1, board, playerNum)) return true
    }

    //Check northwest
    firstNeighbour = position - 9;
    if (firstNeighbour >= 0 && firstNeighbour % 8 < position % 8 && board[firstNeighbour] !== playerNum && board[firstNeighbour] !== 0) {
        if (propagateCheck(firstNeighbour, -1, -1, board, playerNum)) return true
    }

    //Check northeast
    firstNeighbour = position - 7;
    if (firstNeighbour >= 0 && firstNeighbour % 8 > position % 8 && board[firstNeighbour] !== playerNum && board[firstNeighbour] !== 0) {
        if (propagateCheck(firstNeighbour, 1, -1, board, playerNum)) return true
    }

    //Check west
    firstNeighbour = position - 1;
    if (firstNeighbour >= 0 && firstNeighbour % 8 < position % 8 && board[firstNeighbour] !== playerNum && board[firstNeighbour] !== 0) {
        if (propagateCheck(firstNeighbour, -1, 0, board, playerNum)) return true
    }

    //Check east
    firstNeighbour = position + 1;
    if (firstNeighbour < 64 && firstNeighbour % 8 > position % 8 && board[firstNeighbour] !== playerNum && board[firstNeighbour] !== 0) {
        if (propagateCheck(firstNeighbour, 1, 0, board, playerNum)) return true
    }

    //Check south
    firstNeighbour = position + 8;
    if (firstNeighbour < 64 && board[firstNeighbour] !== playerNum && board[firstNeighbour] !== 0) {
        if (propagateCheck(firstNeighbour, 0, 1, board, playerNum)) return true
    }

    //Check southwest
    firstNeighbour = position + 7;
    if (firstNeighbour < 64 && firstNeighbour % 8 < position % 8 && board[firstNeighbour] !== playerNum && board[firstNeighbour] !== 0) {
        if (propagateCheck(firstNeighbour, -1, 1, board, playerNum)) return true
    }

    //Check northeast
    firstNeighbour = position + 9;
    if (firstNeighbour < 64 && firstNeighbour % 8 > position % 8 && board[firstNeighbour] !== playerNum && board[firstNeighbour] !== 0) {
        if (propagateCheck(firstNeighbour, 1, 1, board, playerNum)) return true
    }

    return false
};

const validMoves = function (board, boundary, playerNum) {
    const moves = [];
    for (let i = 0; i < boundary.length; i++) {
        if (isValid(boundary[i], board, playerNum)) {
            moves.push(boundary[i]);
        }
    }

    return moves;
};

const updateBoundary = function (center, board, boundary) {
    const newBoundary = [...boundary];
    let start = center - 9;
    for (let i = start; i < start + 3; i++) {
        if (i >= 0 && !newBoundary.includes(i) && board[i] === 0) {
            newBoundary.push(i);
        }
    }

    for (let i = center - 1; i < center + 2; i++) {
        if (!newBoundary.includes(i) && board[i] === 0) {
            newBoundary.push(i);
        }
    }

    start = center + 7;
    for (let i = start; i < start + 3; i++) {
        if (i < 64 && !newBoundary.includes(i) && board[i] === 0) {
            newBoundary.push(i);
        }
    }

    return newBoundary.filter((value) => value !== center)
};

const getBoundary = function (board) {
    let boundary = []

    const posWithValues = []
    for (let i = 0; i < board.length; i++) {
        if (board[i] !== 0) {
            posWithValues.push(i);
        }
    }

    for (let i = 0; i < posWithValues.length; i++) {
        boundary = updateBoundary(posWithValues[i], board, boundary);
    }

    return boundary;
}

const checkBoardDifference = function (oldBoard, newBoard) {
    const diff = [];
    for (let i = 0; i < oldBoard.length; i++) {
        const value = oldBoard[i];
        if (value === 0 && value !== newBoard[i]) {
            diff.push(i)
        }
    }

    return diff;
};

const getNewBoard = function (board, option, value) {
    const newBoard = [...board];
    newBoard[option] = value;
    return newBoard;
};

const other = function (playerNum) {
    if (playerNum === 1) {
        return 2;
    }

    return 1;
};

const max = function (state1, state2) {
    if (state1.value > state2.value) {
        return state1;
    }

    return state2;
}

const min = function (state1, state2) {
    if (state1.value < state2.value) {
        return state1;
    }

    return state2;
}

const printBoard = function (board) {
    let str = '';
    for (let pos in board) {
        str = str + `| ${board[pos]} `;
        if (pos % 8 === 7) {
            str = str + '|\n'
        }
    }
    console.log(str)
}

module.exports = {
    validMoves: validMoves,
    updateBoundary: updateBoundary,
    getBoundary: getBoundary,
    checkBoardDifference: checkBoardDifference,
    getNewBoard: getNewBoard,
    other: other,
    max: max,
    min: min,
    printBoard: printBoard
}