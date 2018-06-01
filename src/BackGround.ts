
class BackGround extends Laya.Sprite
{
    public bg1: any;
    public bg2: any;
    //private cat: any;
    //private tree: any;

    private _playPage: PlayPage;

    private BG_MUSIC_VOLUME = 0.5;
    //private BG_WIDTH = 800;
    private BG_HEIGHT = Laya.stage.height;

    //游戏相关状态
    private IS_PAUSE = false;
    private IS_OVER = false;

    //背景移动速度
    private BG_SPEED = 3;
    //背景的帧处理间隔
    private BG_FRAME_DELAY = 1;

    public itemBack1: any; //屏幕物品列表
    public itemBack2: any; //屏幕物品列表

    public constructor() 
    {
        super();

        this.itemBack1 = [];
        this.itemBack2 = [];

        this.init();
    }

    private init(): void
    {
        //Laya.SoundManager.musicVolume = this.BG_MUSIC_VOLUME;
        //Laya.SoundManager.playMusic("res/wav/BG.wav",0);

        //创建背景1
        this.bg1 = new Sprite().loadImage("res/BackGround1.png");
        this.addChild(this.bg1);

        //创建背景2
        this.bg2 = new Sprite().loadImage("res/BackGround2.png");
        this.bg2.pos(0, -this.BG_HEIGHT);
        this.addChild(this.bg2);

        this.addItem("bg1");
        this.addItem("bg2");
        
        Laya.timer.frameLoop(this.BG_FRAME_DELAY, this, this.onLoop)
    }

    private onLoop(): void
    {
        if (this.IS_PAUSE || this.IS_OVER) { return; }

        //移动
        this.y += this.BG_SPEED;

        //当背景1向下移动出游戏的显示区域，则将背景1的y轴坐标,向下移动*2.
        if (this.bg1.y + this.y >= this.BG_HEIGHT) 
        {
            this.bg1.y -= this.BG_HEIGHT * 2 ;
            this.bg1.removeChild();
            
            for (var i = 0; i < this.itemBack1.length; ++i)
            {
                var element = this.itemBack1[i];
                element.visible = false;
                this.removeChild(element);
            }
            
            this.addItem("bg1");
        }

        //当背景2向左移动出游戏的显示区域，则将背景2的y轴坐标,向下移动*2.
        if (this.bg2.y + this.y >= this.BG_HEIGHT) 
        {
            this.bg2.y -= this.BG_HEIGHT * 2;
            this.bg2.removeChild();
            
            for (var i = 0; i < this.itemBack2.length; ++i)
            {
                var element = this.itemBack2[i];
                element.visible = false;
                this.removeChild(element);
            }
            
            this.addItem("bg2");
        }
    }

    private addItem(des): void
    {
        var arr = [];

        var y = this.bg1.y;
        if (des == "bg2") y = this.bg2.y;

        var list = ItemNormal.list.content; //读取策划配置物品，随机显示
        var index = Math.floor(list.length * Math.random());
        
        var array = list[index];
        array.forEach(element => {
            
            var item = null;

            //if (des == "bg1") item = this.itemBack1.shift();
            //if (des == "bg2") item = this.itemBack2.shift();
            
            if (!item) 
            {
                //console.log(des + ":创建物品，索引:" + index);
                item = new Item(); 
            }
            else
            {
                //console.log(des + ":复用之前的物品数据:" + item.x + " " + item.y + " 类型:" + item._type + " 是否可见:" + item.visible);
            }

            item.init(element.type);
            item.zOrder = 1;
            item.visible = true;

            item.x = element.x;
            item.y = y + element.y;

            //console.log(des + ":本次添加物品:" + item.x + " " + item.y + " 类型:" + item._type + " 是否可见:" + item.visible);

            this.addChild(item);
            arr.push(item); 
        });

        if (des == "bg1") { this.itemBack1 =  [].concat(arr); }
        else { this.itemBack2 = [].concat(arr); }
    }

} //class BackGround