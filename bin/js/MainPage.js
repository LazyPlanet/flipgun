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
// 程序入口
var MainPge = /** @class */ (function (_super) {
    __extends(MainPge, _super);
    function MainPge() {
        var _this = _super.call(this) || this;
        _this._selectedIndex = 0; //默认选择第一把枪
        _this._view = fairygui.UIPackage.createObject("GunUI", "MainMenu").asCom;
        _this._view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
        fairygui.GRoot.inst.addChild(_this._view);
        _this._playBtn = _this._view.getChild("PlayButton"); //开始按钮
        _this._playBtn.onClick(_this, _this.onPlay);
        _this._bestScore = _this._view.getChild("BestScoreNum"); //最高分数
        _this._gunName = _this._view.getChild("GunName"); //枪名字
        _this._gunList = _this._view.getChild("GunList").asList;
        _this._gunList.removeChildrenToPool();
        _this._ammoNum = _this._view.getChild("AmmoNum").asLabel;
        _this._weight = _this._view.getChild("WeightList").asList;
        _this._rate = _this._view.getChild("FireRateList").asList;
        _this.init();
        return _this;
    }
    MainPge.prototype.init = function () {
        var item = this._gunList.addItemFromPool().asButton;
        item.getChild("GunLoader").asCom.getChild("GunPicLoader").asLoader.icon = ""; //最前面增加一个空白页
        var guns = ItemNormal.list.guns; //读取策划配置的枪数据
        for (var i = 0; i < guns.length; ++i) {
            var element = guns[i];
            var item = this._gunList.addItemFromPool().asButton;
            var ii = item.getChild("GunLoader").asCom.getChild("GunPicLoader").asLoader;
            ii.icon = "res/" + element.icon;
            ii.name = element.name;
        }
        var item = this._gunList.addItemFromPool().asButton;
        item.getChild("GunLoader").asCom.getChild("GunPicLoader").asLoader.icon = ""; //最后面增加一个空白页
        this._gunList.on(fairygui.Events.SCROLL_END, this, this.onSelectGun);
        this.onUpdateGun();
    };
    MainPge.prototype.onSelectGun = function (obj) {
        if (this._gunList.numChildren <= 0)
            return;
        var firstElement = this._gunList._children[0];
        var firstScreenPos = firstElement.localToGlobal(firstElement.x, firstElement.y);
        this._selectedIndex = Math.abs(firstScreenPos.x / firstElement.width);
        this.onUpdateGun();
    };
    MainPge.prototype.onUpdateGun = function () {
        if (this._selectedIndex < 0 || this._selectedIndex >= ItemNormal.list.guns.length)
            return;
        var selectedGun = ItemNormal.list.guns[this._selectedIndex];
        if (!selectedGun)
            return;
        this._ammoNum.text = selectedGun.ammo.toString();
        this._gunName.text = selectedGun.name;
        //设置质量
        for (var i = 0; i < this._weight.asList.numChildren; ++i) {
            var element = this._weight.asList._children[i];
            if (i < selectedGun.weight) {
                element.getController("Weight").selectedIndex = 0;
            } //白底
            else {
                element.getController("Weight").selectedIndex = 1;
            } //黑底
        }
        //设置开枪频率
        for (var i = 0; i < this._rate.asList.numChildren; ++i) {
            var element = this._rate.asList._children[i];
            if (i < selectedGun.rate) {
                element.getController("Speed").selectedIndex = 0;
            } //白底
            else {
                element.getController("Speed").selectedIndex = 1;
            } //黑底
        }
        console.log("选择枪支数据:" + selectedGun.ammo + " " + selectedGun.weight + " " + selectedGun.rate);
    };
    MainPge.prototype.onPlay = function (evt) {
        this.showPage(false); //隐藏当前界面
        this._playPage = new PlayPage(this._selectedIndex);
        this._playPage.zOrder = -10;
        Laya.stage.addChild(this._playPage);
    };
    MainPge.prototype.showPage = function (show) {
        this._view.visible = show;
    };
    return MainPge;
}(Laya.Sprite));
//# sourceMappingURL=MainPage.js.map