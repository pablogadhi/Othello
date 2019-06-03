const socket = require('socket.io-client')(process.argv[2]);
const brain = require('./brain');
const utils = require('./utils');

const username = process.argv[4];
const tournamentID = process.argv[3];
const mode = process.argv[5]

let boundary = [];
let currentBoard = new Array(64).fill(0);

socket.on('connect', function () {
    console.log('Connected!');

    socket.emit('signin', {
        user_name: username,
        tournament_id: tournamentID,
        user_role: 'player'
    });
});

socket.on('ok_signin', function () {
    console.log("Successfully signed in!");
});

socket.on('ready', function (data) {
    let gameID = data.game_id;
    let playerTurnID = data.player_turn_id;
    let board = data.board;

    currentBoard = new Array(64).fill(0);
    const differences = utils.checkBoardDifference(currentBoard, board);
    for (let diff of differences) {
        boundary = utils.updateBoundary(diff, board, boundary);
    }
    currentBoard = board;

    const result = brain.nextMove(board, boundary, playerTurnID, mode);
    const move = result.choice;
    boundary = result.boundary;

    socket.emit('play', {
        tournament_id: tournamentID,
        player_turn_id: playerTurnID,
        game_id: gameID,
        movement: move
    });
});

socket.on('finish', function (data) {
    let gameID = data.game_id;
    let playerTurnID = data.player_turn_id;
    let winnerTurnID = data.winner_turn_id;
    let board = data.board;

    boundary = [];
    currentBoard = new Array(64).fill(0);

    socket.emit('player_ready', {
        tournament_id: tournamentID,
        player_turn_id: playerTurnID,
        game_id: gameID
    });
});
