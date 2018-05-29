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
    }

    private onPlay(evt: Event): void 
    {
        this._gunIndex = 0;
        this._view.visible = false; //隐藏当前界面

        this._playPage = new PlayPage();
        this._playPage.zOrder = -10;
        Laya.stage.addChild(this._playPage);
    }
}



