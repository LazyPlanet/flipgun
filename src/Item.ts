class Item extends Laya.Sprite
{
    private type: string;
    private icon: any;
    private starTexture: any;
    private decelerationTexure: any;
    private invincibleTexture: any;

    //加速
    static ITEM_TYPE_JIASU = "ITEM_TYPE_JIASU";
    //金币
    static ITEM_TYPE_JINBI = "ITEM_TYPE_JINBI";
    //无敌
    static ITEM_TYPE_ZIDAN = "ITEM_TYPE_INVINCIBLE";

    public constructor() 
    {
        super();
    }

    //播放星星的碰撞效果
    private TweenStar(item): void
    {
        Tween.to(item, {y : -5, scaleX : 0.1, alpha : 0}, 200, null, Handler.create(this, this.undefinedFunc, [item]));
    }

    private undefinedFunc(): void
    {

    }

    //随机物品的上下位置
    public randomItemPosition(item): Item
    {
        var randomNumber = Laya.stage.height / 2 * Math.random();

        if(randomNumber <= 50)
        {
            item.y = -30;
        }
        else
        {
            item.y = randomNumber;
            //水平倾斜角度，默认值为0。以角度为单位
            //item.skewX = 180;
            //垂直倾斜角度，默认值为0。以角度为单位。
            //item.skewY = 180;
            //镜像翻转
            //item.scaleX = -1;
        }
        
        return item;
    }

    public init(type): void
    {
        this.type = type;
        this.icon = new Sprite();

        switch (type) 
        {
            case Item.ITEM_TYPE_JIASU:
                this.icon.loadImage("res/jiasu.png");
                this.icon.scaleX = 1/6;
                this.icon.scaleY = 1/5;
            break;

            case Item.ITEM_TYPE_JINBI:
                this.icon.loadImage("res/jinbi.png");
                this.icon.scaleX = this.icon.scaleY = 2/3;
            break;

            case Item.ITEM_TYPE_ZIDAN:
                this.icon.loadImage("res/zidan.png");
                this.icon.scaleX = this.icon.scaleY = 1/3;
            break;

            default:
                alert("道具指令错误!");
            break;
        }
        
        this.addChild(this.icon);
    }
    
}