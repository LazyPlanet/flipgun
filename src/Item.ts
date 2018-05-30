class Item extends Laya.Sprite
{
    private icon: any;
    private starTexture: any;
    private decelerationTexure: any;
    private invincibleTexture: any;

    public _itemList: any;
    
    //金币
    static ITEM_TYPE_JINBI = 1;
    //加速
    static ITEM_TYPE_JIASU = 2;
    //子弹
    static ITEM_TYPE_ZIDAN = 3;

    private _itemTypes: any;
    
    public constructor() 
    {
        super();

        this._itemList = [];
    }

    //播放星星的碰撞效果
    private TweenStar(item): void
    {
        Tween.to(item, {y : -5, scaleX : 0.1, alpha : 0}, 200, null, Handler.create(this, this.undefinedFunc, [item]));
    }

    private undefinedFunc(): void
    {

    }    

    public init(type): void
    {
        for (var i = 0; i < 1; ++i)
        {
            var icon = new Laya.Sprite();

            switch (type) 
            {
                case Item.ITEM_TYPE_JIASU:
                    icon.loadImage("res/jiasu.png");
                    icon.scaleX = 1/6;
                    icon.scaleY = 1/5;
                break;

                case Item.ITEM_TYPE_JINBI:
                    icon.loadImage("res/jinbi.png");
                    icon.scaleX = icon.scaleY = 2/3;
                break;

                case Item.ITEM_TYPE_ZIDAN:
                    icon.loadImage("res/zidan.png");
                    icon.scaleX = icon.scaleY = 1/3;
                break;

                default:
                    alert("道具指令错误!");
                break;
            }
        
            icon.x = icon.x + 80 * i + 80;

            this._itemList.push(icon);

            this.addChild(icon);
        }
    }

    
}