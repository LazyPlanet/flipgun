class Item extends Laya.Sprite
{
    private _type: any;
    //public _itemList: any;
    
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

        //this._itemList = [];
    }

    //播放星星的碰撞效果
    private TweenStar(item): void
    {
        Tween.to(item, {y : -5, scaleX : 0.1, alpha : 0}, 200, null, Handler.create(this, this.undefinedFunc, [item]));
    }

    private undefinedFunc(): void
    {

    }    

    public getType(): any
    {
        return this._type;
    }

    public init(type): void
    {
        this._type = type;

        for (var i = 0; i < 1; ++i)
        {
            //var icon = new Laya.Sprite();

            switch (type) 
            {
                case Item.ITEM_TYPE_JIASU:
                {
                    this.loadImage("res/jiasu.png");
                    this.width = 219;
                    this.height = 311;
                    //icon.scaleX = 1/6;
                    //icon.scaleY = 1/5;
                }
                break;

                case Item.ITEM_TYPE_JINBI:
                {
                    this.loadImage("res/jinbi.png");
                    this.width = 80;
                    this.height = 80;
                    //icon.scaleX = icon.scaleY = 2/3;
                }
                break;

                case Item.ITEM_TYPE_ZIDAN:
                {
                    this.loadImage("res/zidan.png");
                    this.width = 70;
                    this.height = 120;
                    //icon.scaleX = icon.scaleY = 1/3;
                }
                break;

                default:
                    alert("错误物品!");
                break;
            }

            //console.log("增加物品，宽度:" + icon.width + " 长度:" + icon.height + icon.texture.width + icon.texture.height);
            //console.log(icon.getBounds());
        
            //this._itemList.push(icon);
            //this.addChild(icon);
        }
    }
    
}