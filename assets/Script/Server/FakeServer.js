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
var playerList = [];
var availableCells = [];
var currentPlayer = 0;
var repliedUsers = [];
var endflags = [];
var gameEndFlag = false;
var step = 0;
var panel = [];
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
    return repliedUsers.length === PLAYER_CNT;
}

function initHandlers() {
    ServerCommService.addRequestHandler(
        MESSAGE_TYPE.CS_RESTART_MISSION,
        startMission
    );
    ServerCommService.addRequestHandler(
        MESSAGE_TYPE.CS_RESTART_GAME,
        init
    );
    ServerCommService.addRequestHandler(
        MESSAGE_TYPE.CS_PUT_STONE,
        selectUnit
    );
}

function init() {
    startMission();
}

function startMission() {
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
    var player1 = [[8, -4, -4], [7, -4, -3], [7, -3, -4], [6, -4, -2], [6, -3, -3], [6, -2, -4], [5, -4, -1], [5, -3, -2], [5, -2, -3], [5, -1, -4]];
    var player2 = [[4, -8, 4], [3, -7, 4], [4, -7, 3], [2, -6, 4], [3, -6, 3], [4, -6, 2], [1, -5, 4], [2, -5, 3], [3, -5, 2], [4, -5, 1]];
    var player3 = [[-4, -4, 8], [-4, -3, 7], [-3, -4, 7], [-4, -2, 6], [-3, -3, 6], [-2, -4, 6], [-4, -1, 5], [-3, -2, 5], [-2, -3, 5], [-1, -4, 5]];
    var player4 = [[-8, 4, 4], [-7, 4, 3], [-7, 3, 4], [-6, 4, 2], [-6, 3, 3], [-6, 2, 4], [-5, 4, 1], [-5, 3, 2], [-5, 2, 3], [-5, 1, 4]];
    var player5 = [[-4, 8, -4], [-3, 7, -4], [-4, 7, -3], [-2, 6, -4], [-3, 6, -3], [-4, 6, -2], [-1, 5, -4], [-2, 5, -3], [-3, 5, -2], [-4, 5, -1]];
    var player6 = [[4, 4, -8], [4, 3, -7], [3, 4, -7], [4, 2, -6], [3, 3, -6], [2, 4, -6], [4, 1, -5], [3, 2, -5], [2, 3, -5], [1, 4, -5]];
    if (playerCnt === 2) {
        playerList = playerList.concat(copyObject(player1));
        playerList = playerList.concat(copyObject(player4));
    }
    Array(2).forEach(function (e) {
        endflags.push(false);
    })
    currentPlayer = 0;
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
    availableCells = [];
    Array(6).forEach(function (e, i) {
        var newCell = sumArrays(unit, cubic.NEIGHBOR_OFFSETS[i]);
        if (isIn2DArray(panel, newCell)) {
            if (isEmpty(newCell)) {
                availableCells = availableCells.concat(copyObject(newCell));
            } else {
                getAvailableCells(newCell);
            }
        }
    });
}

function askUser(user) {
    console.log("ask user to claim put stone : " + user);
    var r = Math.floor(Math.random() * 10);
    getAvailableCells(playerList[user][r]);
    var random = Math.floor(Math.random() * availableCells.length);
    TimeoutManager.setNextTimeout(function () {
        moveUnit({ u: availableCells[random][0], v: availableCells[random][1], w: availableCells[random][2], user: user }, 1);
    });
}

function moveUnit(params, room) {
    TimeoutManager.clearNextTimeout();
    u = params.u;
    v = params.v;
    w = params.w;
    if (!markUserReplied(user)) {
        return;
    }
    if (missionEndFlag == 0) {
        this.putStone();
        ServerCommService.send(
            MESSAGE_TYPE.SC_MOVE_UNIT,
            {
                board,
                availAreas,
                turn,
                x: mouseBlockX,
                y: mouseBlockY,
                missionEndFlag,
            },
            turn
        );
    }
    if (missionEndFlag === 1)
        return;
    else this.askUser();
}

function selectUnit() {

}
// finish the game or mission
function gameOver() {
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

    startMission() {
        startMission();
    },
    //ask user to put stone
    askUser() {
        askUser();
    },
    // finish the game or mission
    gameOver() {
        gameOver();
    },
};