import { MESSAGE_TYPE } from "./Common/Messages";
import { ServerCommService } from "./Common/CommServices";
import { GameScene } from "./GameScene";

export const ClientCommService = {
    onExtensionResponse(event) {
        const messageType = event.cmd;
        const params = event.params;

        // console.log("C - onExtensionResponse", event.cmd, event.params);

        switch (messageType) {
            case MESSAGE_TYPE.SC_START_GAME:
                GameScene.start1();
                break;
            case MESSAGE_TYPE.SC_END_GAME:
                GameScene.showEndModal(params.blackScore, params.whiteScore, params.missionScore);
                break;
            case MESSAGE_TYPE.SC_AVAIL_CELLS:
                GameScene.setAvailCells(params.avaialbeCells, params.user);
                break;
            case MESSAGE_TYPE.SC_MOVE_UNIT:
                GameScene.setMoveResult(params.result);
                break;
        }
    },

    send(messageType, data, room) {
        ServerCommService.onReceiveMessage(messageType, data, room);
    },

    sendSelectUnit(u, v, w, user) {
        this.send(MESSAGE_TYPE.CS_SELECT_UNIT, { u, v, w, user }, 1);
    },

    sendClaimMove(currentUnit, targetCell, user) {
        this.send(MESSAGE_TYPE.CS_CLAIM_MOVE, { currentUnit, targetCell, user }, 1);
    },

    sendRestartMission() {
        this.send(MESSAGE_TYPE.CS_RESTART_MISSION, {}, 1);
    },

    sendClaimHistory(step) {
        this.send(MESSAGE_TYPE.CS_PLAY_HISTORY, { step }, 1);
    },

    sendRestartGame() {
        this.send(MESSAGE_TYPE.CS_RESTART_GAME, {}, 1);
    }
};
