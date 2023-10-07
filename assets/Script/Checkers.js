import Unit from "./Unit";

export default cc.Class({
    extends: cc.Component,

    properties: {
        blue: Unit,
        red: Unit,
        purple: Unit,
        orange: Unit,
        yellow: Unit,
        green: Unit,
    },

    // use this for initialization
    onLoad: function () {
    },

    unvisibleColor() {
        this.red.node.active = false;
        this.blue.node.active = false;
        this.purple.node.active = false;
        this.green.node.active = false;
        this.orange.node.active = false;
        this.yellow.node.active = false;
    },

    setColor(col) {
        this.unvisibleColor();
        if (col === 'red') {
            this.red.node.active = true;
        } else if (col === 'blue') {
            this.blue.node.active = true;
        } else if (col === 'purple') {
            this.purple.node.active = true;
        } else if (col === 'yellow') {
            this.yellow.node.active = true;
        } else if (col === 'green') {
            this.green.node.active = true;
        } else if (col === 'orange') {
            this.orange.node.active = true;
        }
    },

    setColor_1(col) {
        this.unvisibleColor();
        if (col === 'red') {
            this.red.node.active = true;
            let i = 0;
            let unit = this.red;
            let callback = function () {
                if (i === 4) {
                    // Cancel this timer at the sixth call-back
                    this.unschedule(callback);
                }
                unit.changeChildren(i);
                i++;
            }
            this.red.schedule(callback, 0.2, 3, 0);
        } else if (col === 'blue') {
            this.blue.node.active = true;
            let i = 0;
            let unit = this.blue;
            let callback = function () {
                if (i === 4) {
                    // Cancel this timer at the sixth call-back
                    this.unschedule(callback);
                }
                unit.changeChildren(i);
                i++;
            }
            this.blue.schedule(callback, 0.15, 3, 0);
        } else if (col === 'purple') {
            this.purple.node.active = true;
            let i = 0;
            let unit = this.purple;
            let callback = function () {
                if (i === 4) {
                    // Cancel this timer at the sixth call-back
                    this.unschedule(callback);
                }
                unit.changeChildren(i);
                i++;
            }
            this.purple.schedule(callback, 0.15, 3, 0);
        } else if (col === 'yellow') {
            this.yellow.node.active = true;
            let i = 0;
            let unit = this.yellow;
            let callback = function () {
                if (i === 4) {
                    // Cancel this timer at the sixth call-back
                    this.unschedule(callback);
                }
                unit.changeChildren(i);
                i++;
            }
            this.yellow.schedule(callback, 0.15, 3, 0);
        } else if (col === 'green') {
            this.green.node.active = true;
            let i = 0;
            let unit = this.green;
            let callback = function () {
                if (i === 4) {
                    // Cancel this timer at the sixth call-back
                    this.unschedule(callback);
                }
                unit.changeChildren(i);
                i++;
            }
            this.green.schedule(callback, 0.15, 3, 0);
        } else if (col === 'orange') {
            this.orange.node.active = true;
            let i = 0;
            let unit = this.orange;
            let callback = function () {
                if (i === 4) {
                    // Cancel this timer at the sixth call-back
                    this.unschedule(callback);
                }
                unit.changeChildren(i);
                i++;
            }
            this.orange.schedule(callback, 0.15, 3, 0);
        }
    },

    // called every frame
    update: function (dt) {

    },
});