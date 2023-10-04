import { MESSAGE_TYPE, ROUNDS } from "../Common/Messages";
import { ClientCommService } from "../ClientCommService";
import { TIME_LIMIT, ALARM_LIMIT } from "../Common/Constants";


//--------Defining global variables----------
var playerCnt = 2;
var cubic = {
    NEIGHBOR_OFFSETS: [[0, 1, -1], [1, 0, -1], [1, -1, 0], [0, -1, 1], [-1, 0, 1], [-1, 1, 0]],
    DIR_TO_CUBIC: [[1, -0.5, -0.5], [0.5, -1, 0.5], [-0.5, -0.5, 1], [-1, 0.5, 0.5], [-0.5, 1, -0.5], [0.5, 0.5, -1]],
};
var cell = {
    u: 0,
    v: 0,
    w: 0,
}
var currentUnit = [];
var targetCell = [];
var playerList = [];
var targetList = [];
var availableCells = [];
var currentPlayer = 0;
var repliedUsers = [];
var endflags = [];
var gameEndFlag = false;
var step = 0;
var panel = [];
var missionEndFlag = 0;
var ranking = [];
var players = [];

panel = [
    [4, -8, 4], [3, -7, 4], [4, -7, 3], [2, -6, 4], [3, -6, 3], [4, -6, 2], [1, -5, 4], [2, -5, 3], [3, -5, 2], [4, -5, 1],
    [-8, 4, 4], [-7, 4, 3], [-7, 3, 4], [-6, 4, 2], [-6, 3, 3], [-6, 2, 4], [-5, 4, 1], [-5, 3, 2], [-5, 2, 3], [-5, 1, 4],
    [4, 4, -8], [4, 3, -7], [3, 4, -7], [4, 2, -6], [3, 3, -6], [2, 4, -6], [4, 1, -5], [3, 2, -5], [2, 3, -5], [1, 4, -5]
]
for (var i = -4; i <= 8; i++) {
    for (var j = -4; j <= 4 - i; j++) {
        panel.push(copyObject([i, j, -i - j]));
    }
}

//--------Defining global variables----------

//----------------------------------------
// array copy method
//----------------------------------------

function copyObject(object) {
    if (!object) {
        console.log("undefined object in copyObject:", object);
        return object;
    }
    return JSON.parse(JSON.stringify(object));
}

function isIn2DArray(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (JSON.stringify(arr[i]) === JSON.stringify(val)) {
            return true;
        }
    }
    return false;
}

function sumArrays(arr1, arr2) {
    var sum = [];

    for (var i = 0; i < arr1.length; i++) {
        sum.push(arr1[i] + arr2[i]);
    }

    return sum;
}

if (!trace) {
    var trace = function () {
        console.trace(JSON.stringify(arguments));
    }
}

function resetRepliedUsers() {
    repliedUsers = [];
}

function isUserRepliedAlready(user) {
    return repliedUsers.indexOf(user) >= 0;
}

function markUserReplied(user) {
    if (isUserRepliedAlready(user)) {
        return false;
    }
    repliedUsers.push(user);
    return true;
}

function isAllUsersReplied() {
    return repliedUsers.length === playerCnt;
}

function initHandlers() {
    ServerCommService.addRequestHandler(
        MESSAGE_TYPE.CS_RESTART_GAME,
        startGame
    );
    ServerCommService.addRequestHandler(
        MESSAGE_TYPE.CS_SELECT_UNIT,
        selectUnit
    );
    ServerCommService.addRequestHandler(
        MESSAGE_TYPE.CS_CLAIM_MOVE,
        moveUnit
    );
}

function init() {
    startGame();
}

function startGame() {
    // clear parameters
    playerList = [];
    targetList = [];
    endflags = [];
    ranking = [];
    gameEndFlag = false;
    players = [];

    //starting positions of players
    var player1 = [[8, -4, -4], [7, -4, -3], [7, -3, -4], [6, -4, -2], [6, -3, -3], [6, -2, -4], [5, -4, -1], [5, -3, -2], [5, -2, -3], [5, -1, -4]];
    var player2 = [[4, -8, 4], [3, -7, 4], [4, -7, 3], [2, -6, 4], [3, -6, 3], [4, -6, 2], [1, -5, 4], [2, -5, 3], [3, -5, 2], [4, -5, 1]];
    var player3 = [[-4, -4, 8], [-4, -3, 7], [-3, -4, 7], [-4, -2, 6], [-3, -3, 6], [-2, -4, 6], [-4, -1, 5], [-3, -2, 5], [-2, -3, 5], [-1, -4, 5]];
    var player4 = [[-8, 4, 4], [-7, 4, 3], [-7, 3, 4], [-6, 4, 2], [-6, 3, 3], [-6, 2, 4], [-5, 4, 1], [-5, 3, 2], [-5, 2, 3], [-5, 1, 4]];
    var player5 = [[-4, 8, -4], [-3, 7, -4], [-4, 7, -3], [-2, 6, -4], [-3, 6, -3], [-4, 6, -2], [-1, 5, -4], [-2, 5, -3], [-3, 5, -2], [-4, 5, -1]];
    var player6 = [[4, 4, -8], [4, 3, -7], [3, 4, -7], [4, 2, -6], [3, 3, -6], [2, 4, -6], [4, 1, -5], [3, 2, -5], [2, 3, -5], [1, 4, -5]];
    //target positions of players
    var target1 = [[-8, 4, 4], [-7, 4, 3], [-7, 3, 4], [-6, 4, 2], [-6, 3, 3], [-6, 2, 4], [-5, 4, 1], [-5, 3, 2], [-5, 2, 3], [-5, 1, 4]];
    var target2 = [[-4, 8, -4], [-3, 7, -4], [-4, 7, -3], [-2, 6, -4], [-3, 6, -3], [-4, 6, -2], [-1, 5, -4], [-2, 5, -3], [-3, 5, -2], [-4, 5, -1]];
    var target3 = [[4, 4, -8], [4, 3, -7], [3, 4, -7], [4, 2, -6], [3, 3, -6], [2, 4, -6], [4, 1, -5], [3, 2, -5], [2, 3, -5], [1, 4, -5]];
    var target4 = [[8, -4, -4], [7, -4, -3], [7, -3, -4], [6, -4, -2], [6, -3, -3], [6, -2, -4], [5, -4, -1], [5, -3, -2], [5, -2, -3], [5, -1, -4]];
    var target5 = [[4, -8, 4], [3, -7, 4], [4, -7, 3], [2, -6, 4], [3, -6, 3], [4, -6, 2], [1, -5, 4], [2, -5, 3], [3, -5, 2], [4, -5, 1]];
    var target6 = [[-4, -4, 8], [-4, -3, 7], [-3, -4, 7], [-4, -2, 6], [-3, -3, 6], [-2, -4, 6], [-4, -1, 5], [-3, -2, 5], [-2, -3, 5], [-1, -4, 5]];
    if (playerCnt === 2) {
        playerList = playerList.concat(copyObject(player1));
        playerList = playerList.concat(copyObject(player4));
        targetList = targetList.concat(copyObject(target1));
        targetList = targetList.concat(copyObject(target4));
    }
    Array(playerCnt).fill().forEach(function (e, i) {
        endflags.push(false);
        players.push(i);
    })
    currentPlayer = 0;
    ServerCommService.send(
        MESSAGE_TYPE.SC_START_GAME,
        {
            playerList: playerList,
            user: currentPlayer,
        },
        currentPlayer,
    );
    askUser(currentPlayer);
}

function isEmpty(unit) {
    for (var i = 0; i < playerCnt; i++) {
        if (isIn2DArray(playerList[i], unit)) {
            return false;
        }
    }
    return true;
}

function getAvailableCells(unit) {
    if (s === 0) {
        Array(6).fill().forEach(function (e, i) {
            var newCell = sumArrays(unit, cubic.NEIGHBOR_OFFSETS[i]);
            if (isIn2DArray(panel, newCell)) {
                if (isEmpty(newCell) && !isIn2DArray(availableCells, newCell)) {
                    availableCells = availableCells.concat(copyObject(newCell));
                } else if (isIn2DArray(availableCells, newCell)) {

                } else {
                    getAvailableCells(sumArrays(newCell, cubic.NEIGHBOR_OFFSETS[i]));
                }
            }
        });
        s++;
    }
    else {
        if (isEmpty(unit)) {
            if (!isIn2DArray(availableCells, unit)) {
                availableCells = availableCells.concat(copyObject(newCell));
                Array(6).fill().forEach(function (e, i) {
                    var newCell = sumArrays(unit, cubic.NEIGHBOR_OFFSETS[i]);
                    if (isIn2DArray(panel, newCell)) {
                        if (!isEmpty(newCell)) {
                            getAvailableCells(sumArrays(newCell, cubic.NEIGHBOR_OFFSETS[i]));
                        }
                    }
                });
            }
        }
    }
}

function turnChecker(unit, neighbor) {
    if (isEmpty(unit)) {
        return 0;
    } else {
        turnChecker(sumArrays(unit, neighbor))
    }
}

function askUser(user) {
    console.log("ask user to claim put stone : " + user);
    ServerCommService.send(
        MESSAGE_TYPE.SC_ASK_USER,
        {
            user: currentPlayer,
        },
        1,
    );
    TimeoutManager.setNextTimeout(function () {
        var r = Math.floor(Math.random() * 10);
        getAvailableCells(playerList[user][r]);
        var random = Math.floor(Math.random() * availableCells.length);
        moveUnit({ u: availableCells[random][0], v: availableCells[random][1], w: availableCells[random][2], user: user }, 1);
    });
}

function selectUnit(params, room) {
    currentUnit = [params.u, params.v, params.w];
    availableCells = [];
    var s = 0;
    getAvailableCells(currentUnit);
    ServerCommService.send(
        MESSAGE_TYPE.SC_AVAIL_CELLS,
        {
            availableCells: availableCells,
            user: currentPlayer,
        },
        1
    );
}

function replaceSubarray(arr, subarr, replacement) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].toString() === subarr.toString()) {
            arr[i] = replacement;
            break;
        }
    }
    return arr;
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i].toString() !== arr2[i].toString()) {
            return false;
        }
    }
    return true;
}

function moveUnit(params, room) {
    TimeoutManager.clearNextTimeout();
    currentUnit = copyObject(params.currentUnit);
    targetCell = copyObject(params.targetCell);
    // if (!markUserReplied(user)) {
    //     return;
    // }
    playerList[currentPlayer] = replaceSubarray(playerList[currentPlayer], currentPlayer, targetCell);
    if (arraysEqual(playerList[currentPlayer], targetList[currentPlayer])) {
        endflags[currentPlayer] = true;
        ranking.push(currentPlayer);
    }
    gameOver();
    ServerCommService.send(
        MESSAGE_TYPE.SC_MOVE_UNIT,
        {
            result: true,
            finish: endflags[currentPlayer],
            user: currentPlayer,
        },
        turn
    );
    if (gameEndFlag) {
        ServerCommService.send(
            MESSAGE_TYPE.SC_END_GAME,
            {},
            1
        );
    } else {
        currentPlayer = setNextUser(currentPlayer);
        askUser(currentPlayer);
        players = [];
        Array(playerCnt).fill().forEach(function (e, i) {
            if (!endflags[i]) {
                players.push(i);
            }
        });
    }
}

function setNextUser(user) {
    var index = players.indexOf(user);
    var next = (index + 1) % players.length;
    return players[next];
}

// finish the game or mission
function gameOver() {
    if (ranking.length === playerCnt) {
        gameEndFlag = true;
    }
}

export const ServerCommService = {
    callbackMap: {},
    init() {
        this.callbackMap = {};
    },
    addRequestHandler(messageType, callback) {
        this.callbackMap[messageType] = callback;
    },
    send(messageType, data, users) {

        // TODO: Make fake code here to send message to client side
        // Added timeout bc there are times that UI are not updated properly if we send next message immediately
        // If we move to backend, we can remove this timeout
        setTimeout(function () {
            ClientCommService.onExtensionResponse({
                cmd: messageType,
                params: data,
                users: users,
            });
        }, 100);
    },
    onReceiveMessage(messageType, data, room) {
        const callback = this.callbackMap[messageType];
        trace("S - onReceiveMessage", messageType, data, room);
        if (callback) {
            callback(data, room);
        }
    },
};
ServerCommService.init();

const TimeoutManager = {
    timeoutHandler: null,
    nextAction: null,

    setNextTimeout(callback, timeLimit) {
        this.timeoutHandler = setTimeout(
            function () {
                return callback();
            },
            timeLimit ? timeLimit * 1000 : (TIME_LIMIT) * 1000
        );
    },

    clearNextTimeout() {
        if (this.timeoutHandler) {
            clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
        }
    },
};

export const FakeServer = {
    initHandlers() {
        initHandlers();
    },
    init() {
        init();
    },

    startGame() {
        startGame();
    },
    //ask user to put stone
    askUser(currentPlayer) {
        askUser(currentPlayer);
    },
    // finish the game or mission
    gameOver() {
        gameOver();
    },
};