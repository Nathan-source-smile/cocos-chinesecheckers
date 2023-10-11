import { ROUNDS } from "./Common/Messages";
import GlobalVariables from "./GlobalVariables";
import { ClientCommService } from "./ClientCommService";

export default cc.Class({
    extends: cc.Component,

    properties: {
        u: 0,
        v: 0,
        w: 0,
        user: -1,
        _clicked: false,
    },

    // use this for initialization
    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    },

    setUser(i) {
        this.user = i;
    },

    onMouseMove(event) {
        if (!this._clicked && this.user === GlobalVariables.step * GlobalVariables.playerCnt + GlobalVariables.currentUser) {
            const checker = this.getComponentInChildren("Checkers");
            // console.log(checker._currentNode);
            const hover = checker._currentNode.getChildByName('hover');
            const clicked = checker._currentNode.getChildByName('clicked');
            const regular = checker._currentNode.getChildByName('regular');
            hover.active = true;
            clicked.active = false;
            regular.active = false;
        }
    },

    onMouseLeave(event) {
        if (!this._clicked && this.user === GlobalVariables.step * GlobalVariables.playerCnt + GlobalVariables.currentUser) {
            const checker = this.getComponentInChildren("Checkers");
            // console.log(checker._currentNode);
            const hover = checker._currentNode.getChildByName('hover');
            const clicked = checker._currentNode.getChildByName('clicked');
            const regular = checker._currentNode.getChildByName('regular');
            hover.active = false;
            clicked.active = false;
            regular.active = true;
        }
    },

    onTouchStart(event) {
        // Get the position of the click event
        // let touchPos = event.getLocation();
        // touchPos = this.node.convertToNodeSpaceAR(touchPos);
        // console.log(this.user);
        if (this.user === GlobalVariables.step * GlobalVariables.playerCnt + GlobalVariables.currentUser && (GlobalVariables.round === ROUNDS.START_STEP || GlobalVariables.round === ROUNDS.SELECT_UNIT)) {
            ClientCommService.sendSelectUnit(this.u, this.v, this.w, this.user);
            GlobalVariables.round = ROUNDS.SELECT_UNIT;
            GlobalVariables.currentUnit = [this.u, this.v, this.w];

            const checker = this.getComponentInChildren("Checkers");
            // console.log(checker._currentNode);
            const hover = checker._currentNode.getChildByName('hover');
            const clicked = checker._currentNode.getChildByName('clicked');
            const regular = checker._currentNode.getChildByName('regular');
            hover.active = false;
            clicked.active = true;
            regular.active = false;
            this._clicked = true;
        } else if (GlobalVariables.round === ROUNDS.SELECT_UNIT && this.user === -1) {
            if (isIn2DArray(GlobalVariables.availableCells, [this.u, this.v, this.w])) {
                GlobalVariables.targetCell = [this.u, this.v, this.w];
                ClientCommService.sendClaimMove(GlobalVariables.currentUnit, GlobalVariables.targetCell, GlobalVariables.currentUser);
                GlobalVariables.round = ROUNDS.MOVE_UNIT;
            }
        }
    },

    // called every frame
    update: function (dt) {
        if (JSON.stringify(GlobalVariables.currentUnit) !== JSON.stringify([this.u, this.v, this.w])) {
            if (this._clicked === true) {
                this._clicked = false;
                const checker = this.getComponentInChildren("Checkers");
                console.log("checker._currentNode");
                try {
                    const hover = checker._currentNode.getChildByName('hover');
                    const clicked = checker._currentNode.getChildByName('clicked');
                    const regular = checker._currentNode.getChildByName('regular');
                    hover.active = false;
                    clicked.active = false;
                    regular.active = true;
                } catch (e) {

                }
            }
        }
    },
});

function isIn2DArray(arr, val) {
    for (let i = 0; i < arr.length; i++) {
        if (JSON.stringify(arr[i]) === JSON.stringify(val)) {
            return true;
        }
    }
    return false;
}