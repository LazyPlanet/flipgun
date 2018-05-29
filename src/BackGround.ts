
class BackGround extends Laya.Sprite
{
    private bg1: any;
    private bg2: any;
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

    private itemBack1: any; //屏幕物品列表
    private itemBack2: any; //屏幕物品列表

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

        this.addItem("nnnn");
        
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
                this.removeChild(element);
            }

            this.addItem("bg2");
        }

        /*
        for (var i = 0; i < this.itemList.length; ++i)
        {
            var element = this.itemList[i];

            if (element.y + this.y >= this.BG_HEIGHT)
            {
                console.log("移动子物体:" + element.y + " 当前背景位置:" + this.y);
                //this.removeChild(element); //删除
                element.y -= this.BG_HEIGHT * 2;
            }
        }
        */
    }

    private addItem(des): void
    {
        //创建一个随机数
        var randomNumber = Math.random() * 10;
        
        //如果随机数小于五,不添加,因为会造成道具太多的问题
        //if(randomNumber < 1) return;

        //需要添加的数量
        var addNum = 3;

        //计算道具的最大数量,现在强制道具的宽度都是32
        var maxItemNum = Math.floor(FLOOR_WIDTH / 32);

        //定制数量的规则
        if(maxItemNum >= 5)
        {
            addNum = 5 + Math.floor((maxItemNum - 5) * Math.random());;
        }
        else
        {
            addNum = maxItemNum;
        }
        
        //计算居中的点
        var sx = Laya.stage.width / addNum;
        var arr = [];

        for (var i = 0; i < addNum; i++)
        {
            //每隔两个创建一个,物品分开一点
            if (i % 2 == 0) { continue; }

            randomNumber = Math.random();

            var item = new Item(); 

            if (randomNumber >= 1 - 0.2)
            {
                item.init(Item.ITEM_TYPE_JIASU); //加速
            }
            else if (randomNumber >= 1 - 0.5)
            {
                item.init(Item.ITEM_TYPE_ZIDAN); //子弹
            }
            else if (randomNumber >= 1 - 0.8)
            {
                item.init(Item.ITEM_TYPE_JINBI); //金币
            }

            var y = this.bg1.y;
            if (des == "bg2") y = this.bg2.y;

            item.x = (sx + i * 32);
            item.zOrder = 1;

            item.y = y + Laya.stage.height / 2 * Math.random();

            console.log("为背景:" + des + "添加物品信息，x:" + item.x + " y:" + item.y + " this.y " + this.y);
            console.log("addNum " + addNum + " randomNumber" + randomNumber);

            this.addChild(item);
            arr.push(item);
        }

        if (des == "bg1") this.itemBack1 =  [].concat(arr);
        else this.itemBack2 = [].concat(arr);
    }
}