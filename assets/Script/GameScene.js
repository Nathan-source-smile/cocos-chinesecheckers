import { loadImgAtlas } from './AssetLoader';
import { FakeServer } from './Common/CommServices';
import GameAvatar from '././Common/GameAvatar';
import TopBar from './TopBar';

export let GameScene;
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        GameScene = this;
        loadImgAtlas()
            .then(() => {
                FakeServer.initHandlers();
                // setTimeout(() => {
                FakeServer.init();
                this.start1();
                // }, 3000);
            })
            .catch((error) => {
                console.log("Error loading card atlas:", error);
            });
    },

    start1() {
        
    },

    // called every frame
    update: function (dt) {

    },
});
