import { ROUNDS } from "./Common/Messages";
import GlobalVariables from "./GlobalVariables";

cc.Class({
    extends: cc.Component,

    properties: {
        u: 0,
        v: 0,
        w: 0,
        user: -1,
    },

    // use this for initialization
    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    },

    onTouchStart(event) {
        // Get the position of the click event
        let touchPos = event.getLocation();
        touchPos = this.node.convertToNodeSpaceAR(touchPos);
        if (GlobalVariables.round === ROUNDS.START_STEP || GlobalVariables.round === ROUNDS.SELECT_UNIT) {
            if (this.user === GlobalVariables.currentUser) {
                ClientCommService.sendSelectUnit(this.u, this.v, this.w, this.user);
                GlobalVariables.round = ROUNDS.SELECT_UNIT;
                GlobalVariables.currentUnit = [this.u, this.v, this.w];
            }
        } else if (GlobalVariables.round === ROUNDS.SELECT_UNIT) {
            if (isIn2DArray(GlobalVariables.availableCells, [this.u, this.v, this.w])) {
                GlobalVariables.targetCell = [this.u, this.v, this.w];
                ClientCommService.sendClaimMove(GlobalVariables.currentUnit, GlobalVariables.targetCell, GlobalVariables.currentUser);
                GlobalVariables.round = ROUNDS.MOVE_UNIT;
            }
        }
    },

    // called every frame
    update: function (dt) {

    },
});

function isIn2DArray(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (JSON.stringify(arr[i]) === JSON.stringify(val)) {
            return true;
        }
    }
    return false;
}