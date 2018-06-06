var Handler = laya.utils.Handler;
var Loader = laya.net.Loader;
// 程序入口
var GameMain = /** @class */ (function () {
    function GameMain() {
        Laya.init(750, 1334, Laya.WebGL);
        laya.utils.Stat.show(0, 0);
        //设置适配模式
        Laya.stage.scaleMode = "showall";
        Laya.stage.alignH = "left";
        Laya.stage.alignV = "top";
        Laya.loader.load([
            { url: "res/GunUI@atlas0.png", type: Loader.IMAGE },
            { url: "res/GunUI.fui", type: Loader.BUFFER }
        ], Handler.create(this, this.onLoaded));
    }
    GameMain.prototype.onLoaded = function () {
        Laya.stage.addChild(fairygui.GRoot.inst.displayObject);
        fairygui.UIPackage.addPackage("res/GunUI");
        fairygui.UIConfig.defaultFont = "宋体";
        this._mainPage = new MainPge(); //主界面
    };
    return GameMain;
}());
//初始化微信小游戏
Laya.MiniAdpter.init();
//开始主程序
var _gamePage = new GameMain();
//# sourceMappingURL=GameMain.js.map