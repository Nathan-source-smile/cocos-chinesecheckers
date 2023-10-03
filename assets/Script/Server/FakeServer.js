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
        clickMouse
    );
}

function init() {
    startMission();
}

function startMission() {
    var player1 = [[8, -4, -4], [7, -4, -3], [7, -3, -4], [6, -4, -2], [6, -3, -3], [6, -2, -4], [5, -4, -1], [5, -3, -2], [5, -2, -3], [5, -1, -4]];
    var player2 = [[8, -4, -4], [7, -4, -3], [7, -3, -4], [6, -4, -2], [6, -3, -3], [6, -2, -4], [5, -4, -1], [5, -3, -2], [5, -2, -3], [5, -1, -4]];
    var player3 = [[8, -4, -4], [7, -4, -3], [7, -3, -4], [6, -4, -2], [6, -3, -3], [6, -2, -4], [5, -4, -1], [5, -3, -2], [5, -2, -3], [5, -1, -4]];
    var player4 = [[-8, 4, 4], [-7, 4, 3], [-7, 3, 4], [-6, 4, 2], [-6, 3, 3], [-6, 2, 4], [-5, 4, 1], [-5, 3, 2], [-5, 2, 3], [-5, 1, 4]];
    var player5 = [[8, -4, -4], [7, -4, -3], [7, -3, -4], [6, -4, -2], [6, -3, -3], [6, -2, -4], [5, -4, -1], [5, -3, -2], [5, -2, -3], [5, -1, -4]];
    var player6 = [[8, -4, -4], [7, -4, -3], [7, -3, -4], [6, -4, -2], [6, -3, -3], [6, -2, -4], [5, -4, -1], [5, -3, -2], [5, -2, -3], [5, -1, -4]];
    if (playerCnt == 2) {
        playerList = playerList.concat(copyObject(player1));
        playerList = playerList.concat(copyObject(player4));
    }
    Array(2).forEach(function (e) {
        endflags.push(false);
    })
    currentPlayer = 0;
    askUser(currentPlayer);
}

function getAvailableCells() {
    return availableCells;
}

function askUser(user) {
    console.log("ask user to claim put stone : " + user);
    var random = Math.floor(Math.random() * availableCells.length);
    TimeoutManager.setNextTimeout(function () {
        clickMouse({ u: availableCells[random][0], v: availableCells[random][1], w: availableCells[random][2], user: user }, 1);
    });
}

function clickMouse(params, room) {
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