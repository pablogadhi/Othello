const choose = require('./heart').choose
const validMoves = require('./utils').validMoves
const updateBoundary = require('./utils').updateBoundary

const nextMove = function (board, boundary, playerNum, criteria = 'ai') {
    const valid = validMoves(board, boundary, playerNum);
    let choice = 0
    if (criteria == 'random') {
        choice = valid[Math.floor(Math.random() * valid.length)]
    } else {
        choice = choose(board, valid, boundary, playerNum);
    }
    const newBoundary = updateBoundary(choice, board, boundary);
    return {
        choice: choice,
        boundary: newBoundary
    }
};

module.exports = {
    nextMove: nextMove,
};
