const utils = require('./utils')

const positionHeuristics = [
    100, -20, 10, 5, 5, 10, -20, 100,
    -20, -50, -2, -2, -2, -2, -50, -20,
    10, -2, -1, -1, -1, -1, -2, 10,
    5, -2, -1, -1, -1, -1, -2, 10,
    5, -2, -1, -1, -1, -1, -2, 10,
    10, -2, -1, -1, -1, -1, -2, 10,
    -20, -50, -2, -2, -2, -2, -50, -20,
    100, -20, 10, 5, 5, 10, -20, 100
]

const heuristic = function (state) {
    let value = 0
    for (let i = 0; i < state.board.length; i++) {
        if (state.board[i] === state.realNum) {
            value += positionHeuristics[i]
        } else if (state.board[i] === utils.other(state.realNum)) {
            value -= positionHeuristics[i]
        }
    }
    return value;
};

const terminal = function (state) {
    if (state.options.length === 0) {
        return true;
    }
    return false;
}

const alphaBetaMiniMax = function (state, depth, alpha, beta, maxPlayer) {
    if (depth === 0 || terminal(state)) {
        return heuristic(state);
    }

    if (maxPlayer) {
        let value = -999999999;
        for (option of state.options) {
            const newBoard = utils.getNewBoard(state.board, option, state.playerNum);
            const newBoundary = utils.getBoundary(newBoard);
            const childState = {
                board: newBoard,
                options: utils.validMoves(newBoard, newBoundary, utils.other(state.playerNum)),
                boundary: newBoundary,
                playerNum: utils.other(state.playerNum),
                realNum: state.realNum
            };

            value = Math.max(value, alphaBetaMiniMax(childState, depth - 1, alpha, beta, false));
            alpha = Math.max(alpha, value);
            if (alpha >= beta) {
                break;
            }
        }

        return value;

    } else {
        let value = 999999999;
        for (option of state.options) {
            const newBoard = utils.getNewBoard(state.board, option, state.playerNum);
            const newBoundary = utils.getBoundary(newBoard);
            const childState = {
                board: newBoard,
                options: utils.validMoves(newBoard, newBoundary, utils.other(state.playerNum)),
                boundary: newBoundary,
                playerNum: utils.other(state.playerNum),
                realNum: state.realNum
            };

            value = Math.min(value, alphaBetaMiniMax(childState, depth - 1, alpha, beta, true));
            beta = Math.min(beta, value);
            if (alpha >= beta) {
                break;
            }

        }

        return value;
    }

};

const choose = function (board, options, boundary, playerNum) {
    const weights = [];
    for (let opt of options) {
        const newBoard = utils.getNewBoard(board, opt, playerNum);
        const newBoundary = utils.getBoundary(newBoard);
        const initialState = {
            board: newBoard,
            options: utils.validMoves(newBoard, newBoundary, utils.other(playerNum)),
            boundary: newBoundary,
            playerNum: utils.other(playerNum),
            realNum: playerNum
        };

        utils.printBoard(newBoard);
        weights.push(alphaBetaMiniMax(initialState, 3, -999999999, 999999999, false));
    }

    const choice = options[weights.indexOf(Math.max(...weights))]
    return choice;
};

module.exports = {
    choose: choose
};