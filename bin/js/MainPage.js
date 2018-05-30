// 程序入口
var MainPge = /** @class */ (function () {
    function MainPge() {
        this._view = fairygui.UIPackage.createObject("GunUI", "MainMenu").asCom;
        this._view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
        fairygui.GRoot.inst.addChild(this._view);
        this._playBtn = this._view.getChild("PlayButton"); //开始按钮
        this._playBtn.onClick(this, this.onPlay);
        this._bestScore = this._view.getChild("BestScoreNum"); //最高分数
        this._circleBg = this._view.getChild("n32");
        this._gunName = this._view.getChild("GunName");
        this._gunName.text = "大枪";
    }
    MainPge.prototype.onPlay = function (evt) {
        this._gunIndex = 0;
        this._view.visible = false; //隐藏当前界面
        this._playPage = new PlayPage();
        this._playPage.zOrder = -10;
        Laya.stage.addChild(this._playPage);
    };
    return MainPge;
}());
//# sourceMappingURL=MainPage.js.map