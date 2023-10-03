cc.Class({
    extends: cc.Component,

    properties: {
        u: 0,
        v: 0,
        w: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    },

    onTouchStart(event) {
        // Get the position of the click event
        let touchPos = event.getLocation();
        touchPos = this.node.convertToNodeSpaceAR(touchPos);
        let x = Math.floor(touchPos.x / BLOCKSIZE);
        let y = Math.floor(Math.abs(touchPos.y / BLOCKSIZE));
        if (this._res && !this._historyMode && this.isListInArray(this._availAreas, [x, y])) {
            // this._res = false;
            this._x = x
            this._y = y
            ClientCommService.sendClickPosition(this._x, this._y, this._turn);
        }
    },

    // called every frame
    update: function (dt) {

    },
});
