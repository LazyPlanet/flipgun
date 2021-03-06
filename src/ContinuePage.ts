class ContinuePage extends Laya.Sprite
{
    private _view: fairygui.GComponent;
    private _backBtn: fairygui.GObject;
    private _demoContainer: fairygui.GComponent;
    private _cc: fairygui.Controller;

    private _demoObjects: any;

    private _score: fairygui.GObject; //分数
    private _ammoList: fairygui.GObject; //子弹数
    private _coins: fairygui.GObject; //金币
    private _scoreNum: number;

    private _gun: any; //fairygui.GObject; //枪
    private _gun_left: any; //fairygui.GObject; //枪
    private _gun_right: any; //fairygui.GObject; //枪

    private _selectedGun: any; //玩家选择枪的配置数据

    private _clickCount = 0; //玩家点击次数
    private _gameOver = false; //游戏是否结束
    private _paused = false; //游戏是否暂停

	public Matter: any = Browser.window.Matter;
	public LayaRender: any = Browser.window.LayaRender;

    private _heartCount: number;
    private _coinNum: number;
    private _bulletNum: number;
    private _ammoNum: any;

    private bg1: any;
    private bg2: any;
    private cat: any;
    private tree: any;

    private itemList = [];  //当前生成的物品集合

    private BG_MUSIC_VOLUME = 0.5;
    private BG_WIDTH = 800;
    private BG_HEIGHT = 480;

    //背景的帧处理间隔
    private BG_FRAME_DELAY = 1;

    private _bg = null;
    private _playBtn: fairygui.GObject;
    private _skipBtn: fairygui.GObject;

    public constructor(score: number) 
    {
        super();
        
        this._view = fairygui.UIPackage.createObject("GunUI", "Continue").asCom;
        this._view.setSize(fairygui.GRoot.inst.width,fairygui.GRoot.inst.height);
        fairygui.GRoot.inst.addChild(this._view);

        this._scoreNum = score;

        this._score = this._view.getChild("Score"); 
        this._ammoList = this._view.getChild("AmmoList"); 
        this._ammoNum = this._view.getChild("AmmoNum"); 

        this.init(); //初始化
    }

    private init(): void
    {
        this._playBtn = this._view.getChild("ContinueButton"); //开始按钮
        this._playBtn.onClick(this, this.onPlay);

        this._skipBtn = this._view.getChild("SkipButton"); //跳过按钮
        this._skipBtn.onClick(this, this.onSkip);

         this._score.text = this._scoreNum.toString();
    }

    private onPlay(evt: Event): void 
    {
        this._view.visible = false; //隐藏当前界面

        var playPage = new PlayPage(_gamePage._mainPage._selectedIndex);
        playPage.zOrder = -10;
        Laya.stage.addChild(playPage);
    }
    
    private onSkip(evt: Event): void 
    {
        this._view.visible = false; //隐藏当前界面
        _gamePage._mainPage.showPage(true);
    }

} //class
