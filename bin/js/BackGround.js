var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BackGround = /** @class */ (function (_super) {
    __extends(BackGround, _super);
    function BackGround() {
        var _this = _super.call(this) || this;
        _this.BG_MUSIC_VOLUME = 0.5;
        _this.BG_WIDTH = 800;
        _this.BG_HEIGHT = 480;
        //游戏相关状态
        _this.IS_PAUSE = false;
        _this.IS_OVER = false;
        //背景移动速度
        _this.BG_SPEED = 3;
        //背景的帧处理间隔
        _this.BG_FRAME_DELAY = 1;
        _this.init();
        return _this;
    }
    BackGround.prototype.init = function () {
        Laya.SoundManager.musicVolume = this.BG_MUSIC_VOLUME;
        Laya.SoundManager.playMusic("res/wav/BG.wav", 0);
        //创建背景1
        this.bg1 = new Sprite().loadImage("res/BackGround.png");
        this.addChild(this.bg1);
        //创建背景2
        this.bg2 = new Sprite().loadImage("res/BackGround.png");
        this.addChild(this.bg2);
        this.bg2.pos(0, this.BG_HEIGHT);
        //前景图片树木
        this.tree = new Sprite().loadImage("res/tree0.png");
        this.addChild(this.tree);
        this.tree.pos(64, this.BG_HEIGHT);
        //绘制猫
        this.cat = new Sprite().loadImage("res/m_background.png");
        this.addChild(this.cat);
        //创建一个帧循环处理函数，用于背景位置的更新，实现背景滚动效果。
        Laya.timer.frameLoop(this.BG_FRAME_DELAY, this, this.onLoop);
    };
    BackGround.prototype.onLoop = function () {
        if (this.IS_PAUSE || this.IS_OVER) {
            return;
        }
        //移动
        this.y -= this.BG_SPEED;
        //当背景1向左移动出游戏的显示区域，则将背景1的x轴坐标,向右移动*2.
        if (this.bg1.y + this.y <= -this.BG_HEIGHT) {
            this.bg1.y += this.BG_HEIGHT * 2;
        }
        //当背景2向左移动出游戏的显示区域，则将背景2的x轴坐标,向右移动*2.
        if (this.bg2.y + this.y <= -this.BG_HEIGHT) {
            this.bg2.y += this.BG_HEIGHT * 2;
        }
        //树木移动
        if (this.tree.y + this.y <= -this.BG_HEIGHT) {
            this.tree.y += this.BG_HEIGHT * 2;
        }
        //cat移动
        if (this.cat.y + this.y <= -this.BG_HEIGHT) {
            this.cat.y += this.BG_HEIGHT * 2;
        }
    };
    return BackGround;
}(Sprite));
//# sourceMappingURL=BackGround.js.map