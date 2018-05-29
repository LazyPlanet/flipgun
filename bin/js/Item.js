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
    }
    //播放星星的碰撞效果
    Item.prototype.TweenStar = function (item) {
        Tween.to(item, { y: -5, scaleX: 0.1, alpha: 0 }, 200, null, Handler.create(this, this.undefinedFunc, [item]));
    };
    Item.prototype.undefinedFunc = function () {
    };
    //随机物品的上下位置
    Item.prototype.randomItemPosition = function (item) {
        var randomNumber = Laya.stage.height * Math.random();
        if (randomNumber <= 50) {
            item.y = -30;
        }
        else {
            item.y = FLOOR_HEIGHT + randomNumber;
            //水平倾斜角度，默认值为0。以角度为单位
            //item.skewX = 180;
            //垂直倾斜角度，默认值为0。以角度为单位。
            //item.skewY = 180;
            //镜像翻转
            //item.scaleX = -1;
        }
        return item;
    };
    Item.prototype.init = function (type) {
        this.type = type;
        this.icon = new Sprite();
        switch (type) {
            case Item.ITEM_TYPE_JIASU:
                this.icon.loadImage("res/jiasu.png");
                break;
            case Item.ITEM_TYPE_JINBI:
                this.icon.loadImage("res/jinbi.png");
                break;
            case Item.ITEM_TYPE_ZIDAN:
                this.icon.loadImage("res/zidan.png");
                break;
            default:
                alert("道具指令错误!");
                break;
        }
        this.addChild(this.icon);
    };
    //加速
    Item.ITEM_TYPE_JIASU = "ITEM_TYPE_JIASU";
    //金币
    Item.ITEM_TYPE_JINBI = "ITEM_TYPE_JINBI";
    //无敌
    Item.ITEM_TYPE_ZIDAN = "ITEM_TYPE_INVINCIBLE";
    return Item;
}(Laya.Sprite));
//# sourceMappingURL=Item.js.map