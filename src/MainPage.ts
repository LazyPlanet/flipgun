// 程序入口
class MainPge
{
    public _playPage: PlayPage;

    private _view: fairygui.GComponent;
    
    private _demoContainer: fairygui.GComponent;
    private _cc: fairygui.Controller;

    private _demoObjects: any;

    private _gunIndex: number;

    private _playBtn: fairygui.GObject;
    private _bestScore: fairygui.GObject;
    private _circleBg: fairygui.GObject;
    private _gunName: fairygui.GObject;
    private _gunList: fairygui.GList;
    private _ammoNum: fairygui.GLabel;
    private _weight: fairygui.GObject;
    private _rate: fairygui.GObject;

    private _selectedIndex = 0; //默认选择第一把枪

    constructor()
    {
        this._view = fairygui.UIPackage.createObject("GunUI", "MainMenu").asCom;
        this._view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
        fairygui.GRoot.inst.addChild(this._view);

        this._playBtn = this._view.getChild("PlayButton"); //开始按钮
        this._playBtn.onClick(this, this.onPlay);

        this._bestScore = this._view.getChild("BestScoreNum"); //最高分数

        this._circleBg = this._view.getChild("n32"); 

        this._gunName = this._view.getChild("GunName");
        this._gunName.text = "大枪";

        this._gunList = this._view.getChild("GunList").asList;
        this._gunList.removeChildrenToPool();
        
        this._ammoNum = this._view.getChild("AmmoNum").asLabel;
        this._weight = this._view.getChild("WeightList").asList;
        this._rate = this._view.getChild("FireRateList").asList;

        this.init();
    }

    private init(): void
    {
        var item: fairygui.GButton = this._gunList.addItemFromPool().asButton;
        item.getChild("GunLoader").asCom.getChild("GunPicLoader").asLoader.icon = ""; //最前面增加一个空白页
        
        var guns = ItemNormal.list.guns; //读取策划配置的枪数据

        for (var i = 0; i < guns.length; ++i)
        {
            var element = guns[i];

            var item: fairygui.GButton = this._gunList.addItemFromPool().asButton;
            var ii = item.getChild("GunLoader").asCom.getChild("GunPicLoader").asLoader;
            ii.icon = "res/" + element.icon;
            ii.name = element.name;
        }

        var item: fairygui.GButton = this._gunList.addItemFromPool().asButton;
        item.getChild("GunLoader").asCom.getChild("GunPicLoader").asLoader.icon = ""; //最后面增加一个空白页

        this._gunList.on(fairygui.Events.SCROLL_END, this, this.onSelectGun);
        this.onUpdateGun();
    }

    private onSelectGun(obj): void
    {
        if (this._gunList.numChildren <= 0) return;

        var firstElement = this._gunList._children[0];
        var firstScreenPos = firstElement.localToGlobal(firstElement.x, firstElement.y);

        this._selectedIndex = Math.abs(firstScreenPos.x / firstElement.width);
        this.onUpdateGun();
    }

    private onUpdateGun(): void
    {
        if (this._selectedIndex < 0 || this._selectedIndex >= ItemNormal.list.guns.length) return;

        var selectedGun = ItemNormal.list.guns[this._selectedIndex];
        if (!selectedGun) return;

        this._ammoNum.text = selectedGun.ammo.toString();

        //设置质量
        for (var i = 0; i < this._weight.asList.numChildren; ++i)
        {
            var element = this._weight.asList._children[i];

            if (i < selectedGun.weight) { element.getController("Weight").selectedIndex = 0; } //白底
            else { element.getController("Weight").selectedIndex = 1; } //黑底
        }

        //设置开枪频率
        for (var i = 0; i < this._rate.asList.numChildren; ++i)
        {
            var element = this._rate.asList._children[i];

            if (i < selectedGun.rate) { element.getController("Speed").selectedIndex = 0; } //白底
            else { element.getController("Speed").selectedIndex = 1; } //黑底
        }

        console.log("选择枪支数据:" + selectedGun.ammo + " " + selectedGun.weight + " " + selectedGun.rate);
    }

    private onPlay(evt: Event): void 
    {
        this._gunIndex = 0;
        this._view.visible = false; //隐藏当前界面

        this._playPage = new PlayPage(this._gunIndex);
        this._playPage.zOrder = -10;
        Laya.stage.addChild(this._playPage);
    }
}



