import { loadImgAtlas } from './AssetLoader';
import { FakeServer } from './Common/CommServices';
import GameAvatar from '././Common/GameAvatar';
import TopBar from './TopBar';
import Modal from './Modal';
import SetChecker from './SetChecker';

export let GameScene;
cc.Class({
    extends: cc.Component,

    properties: {
        backSprite: cc.Sprite,
        
        winNotify: Modal,
        loseNotify: Modal,
        // drawNotify: Modal,
        placeNotify1: Modal,
        placeNotify2: Modal,
        playerAvatar1: GameAvatar,
        playerAvatar2: GameAvatar,
        playerAvatar3: GameAvatar,
        playerAvatar4: GameAvatar,
        playerAvatar5: GameAvatar,
        playerAvatar6: GameAvatar,
        topBar: TopBar,


        // user can be -1(white) or 1(black)
        _currentUser: 0,
        _playerAvatars: [],
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
