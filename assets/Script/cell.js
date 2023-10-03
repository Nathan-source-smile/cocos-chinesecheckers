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
        ClientCommService.sendClickPosition(this.u, this.v, this.w, this.user);
    },

    // called every frame
    update: function (dt) {

    },
});
