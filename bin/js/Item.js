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
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item() {
        return _super.call(this) || this;
        //this._itemList = [];
    }
    //播放星星的碰撞效果
    Item.prototype.TweenStar = function (item) {
        Tween.to(item, { y: -5, scaleX: 0.1, alpha: 0 }, 200, null, Handler.create(this, this.undefinedFunc, [item]));
    };
    Item.prototype.undefinedFunc = function () {
    };
    Item.prototype.getType = function () {
        return this._type;
    };
    Item.prototype.init = function (type) {
        this._type = type;
        for (var i = 0; i < 1; ++i) {
            //var icon = new Laya.Sprite();
            switch (type) {
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
    };
    //public _itemList: any;
    //金币
    Item.ITEM_TYPE_JINBI = 1;
    //加速
    Item.ITEM_TYPE_JIASU = 2;
    //子弹
    Item.ITEM_TYPE_ZIDAN = 3;
    return Item;
}(Laya.Sprite));
//# sourceMappingURL=Item.js.map