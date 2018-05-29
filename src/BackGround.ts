
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

    private itemList: any; //屏幕物品列表

    public constructor() 
    {
        super();

        this.itemList = [];

        this.init();
    }

    private init(): void
    {
        Laya.SoundManager.musicVolume = this.BG_MUSIC_VOLUME;
        Laya.SoundManager.playMusic("res/wav/BG.wav",0);

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

            this.addItem("bg1");
        }

        //当背景2向左移动出游戏的显示区域，则将背景2的y轴坐标,向下移动*2.
        if (this.bg2.y + this.y >= this.BG_HEIGHT) 
        {
            this.bg2.y -= this.BG_HEIGHT * 2;

            this.addItem("bg2");
        }
        
        this.itemList.forEach(element => {
            if (element.y + this.y >= this.BG_HEIGHT)
            {
                element.y -= this.BG_HEIGHT * 2;
            }
        });
    }

     /**
     * 允许在地板上添加物品
     */
    private addItem(des): void
    {
        console.log("创建物品...." + des);
        
        //创建一个随机数
        var randomNumber = Math.random() * 10;
        
        //如果随机数小于五,不添加,因为会造成道具太多的问题
        if(randomNumber < 1) return;

        //需要添加的数量
        var addNum = 0;

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
        var isHasSpecialItem = false;

        for (var i = 0; i < addNum; i++)
        {
            //每隔两个创建一个,物品分开一点
            if (i % ITEMNUM_ON_FLOOR == 0) { continue; }

            randomNumber = Math.random();

            //查询当前物品列表里面是否有，如果有的话，就从里面拿取
            if(this.itemList.length > 0 )
            {
                item = this.itemList.shift(); //shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
                item.visible = true;
            }
            else
            {
                var item = new Item(); 
            }
            
            if (randomNumber >= 1 - ITEM_INVINCIBLE_PROBABILITY)
            {
                isHasSpecialItem = true;
                item.init(Item.ITEM_TYPE_JIASU); //加速
            }
            else if (randomNumber >= 1-ITEM_DECELERAYION_PROBABILITY)
            {
                isHasSpecialItem = true;
                item.init(Item.ITEM_TYPE_JINBI); //金币
            }
            else if (randomNumber >= 1-ITEM_STAR_PROBABILITY)
            {
                isHasSpecialItem = true;
                item.init(Item.ITEM_TYPE_ZIDAN);  //子弹
            }

            if (!item) return;

            item.y -= this.BG_HEIGHT / 2;
            item.x = (sx + i * 32);
            item.zOrder = 1;
            
            item = item.randomItemPosition(item);   //已经设置好了y值
            
            this.addChild(item);
            arr.push(item);
        }

        this.itemList = [].concat(arr)
    }

    /**
     * 获取当前当前地板上的所有物品
     */
    private getAllItems(): void
    {
        return this.itemList;
    }
}