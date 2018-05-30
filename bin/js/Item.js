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
        var _this = _super.call(this) || this;
        _this._itemList = [];
        return _this;
    }
    //播放星星的碰撞效果
    Item.prototype.TweenStar = function (item) {
        Tween.to(item, { y: -5, scaleX: 0.1, alpha: 0 }, 200, null, Handler.create(this, this.undefinedFunc, [item]));
    };
    Item.prototype.undefinedFunc = function () {
    };
    Item.prototype.init = function (type) {
        for (var i = 0; i < 1; ++i) {
            var icon = new Laya.Sprite();
            switch (type) {
                case Item.ITEM_TYPE_JIASU:
                    icon.loadImage("res/jiasu.png");
                    icon.scaleX = 1 / 6;
                    icon.scaleY = 1 / 5;
                    break;
                case Item.ITEM_TYPE_JINBI:
                    icon.loadImage("res/jinbi.png");
                    icon.scaleX = icon.scaleY = 2 / 3;
                    break;
                case Item.ITEM_TYPE_ZIDAN:
                    icon.loadImage("res/zidan.png");
                    icon.scaleX = icon.scaleY = 1 / 3;
                    break;
                default:
                    alert("道具指令错误!");
                    break;
            }
            icon.x = icon.x + 80 * i + 80;
            this._itemList.push(icon);
            this.addChild(icon);
        }
    };
    //金币
    Item.ITEM_TYPE_JINBI = 1;
    //加速
    Item.ITEM_TYPE_JIASU = 2;
    //子弹
    Item.ITEM_TYPE_ZIDAN = 3;
    return Item;
}(Laya.Sprite));
//# sourceMappingURL=Item.js.map