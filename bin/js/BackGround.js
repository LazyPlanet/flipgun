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
var BackGround = /** @class */ (function (_super) {
    __extends(BackGround, _super);
    function BackGround() {
        var _this = _super.call(this) || this;
        _this.BG_MUSIC_VOLUME = 0.5;
        //private BG_WIDTH = 800;
        _this.BG_HEIGHT = Laya.stage.height;
        //游戏相关状态
        _this.IS_PAUSE = false;
        _this.IS_OVER = false;
        //背景移动速度
        _this.BG_SPEED = 3;
        //背景的帧处理间隔
        _this.BG_FRAME_DELAY = 1;
        _this.itemBack1 = [];
        _this.itemBack2 = [];
        _this.init();
        return _this;
    }
    BackGround.prototype.init = function () {
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
        Laya.timer.frameLoop(this.BG_FRAME_DELAY, this, this.onLoop);
    };
    BackGround.prototype.onLoop = function () {
        if (this.IS_PAUSE || this.IS_OVER) {
            return;
        }
        //移动
        this.y += this.BG_SPEED;
        //当背景1向下移动出游戏的显示区域，则将背景1的y轴坐标,向下移动*2.
        if (this.bg1.y + this.y >= this.BG_HEIGHT) {
            this.bg1.y -= this.BG_HEIGHT * 2;
            this.bg1.removeChild();
            for (var i = 0; i < this.itemBack1.length; ++i) {
                var element = this.itemBack1[i];
                this.removeChild(element);
            }
            this.addItem("bg1");
        }
        //当背景2向左移动出游戏的显示区域，则将背景2的y轴坐标,向下移动*2.
        if (this.bg2.y + this.y >= this.BG_HEIGHT) {
            this.bg2.y -= this.BG_HEIGHT * 2;
            this.bg2.removeChild();
            for (var i = 0; i < this.itemBack2.length; ++i) {
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
    };
    BackGround.prototype.addItem = function (des) {
        var _this = this;
        var arr = [];
        /*
        //创建一个随机数
        var randomNumber = Math.random() * 10;
        
        //如果随机数小于五,不添加,因为会造成道具太多的问题
        //if(randomNumber < 1) return;

        //需要添加的数量
        var addNum = 3;

        //计算道具的最大数量,现在强制道具的宽度都是32
        var maxItemNum = Math.floor(Laya.stage.width / 40);

        //定制数量的规则
        if(maxItemNum >= 8)
        {
            addNum = 5 + Math.floor((maxItemNum - 5) * Math.random());;
        }
        else
        {
            addNum = maxItemNum;
        }
        
        //计算居中的点
        var sx = Laya.stage.width / addNum;
        var sy = Laya.stage.height / addNum;

        var arr = [];

        for (var i = 0; i < addNum; i++)
        {
            //if (i % 2 == 0) { continue; }

            randomNumber = Math.random();

            var item = new Item();

            if (randomNumber >= 1 - 0.08)
            {
                item.init(Item.ITEM_TYPE_JIASU); //加速
            }
            else if (randomNumber >= 1 - 0.1)
            {
                item.init(Item.ITEM_TYPE_ZIDAN); //子弹
            }
            else if (randomNumber >= 1 - 0.82)
            {
                item.init(Item.ITEM_TYPE_JINBI); //金币
                item.scaleX = -1;
            }

            var y = this.bg1.y;
            if (des == "bg2") y = this.bg2.y;

            item.x = (sx + i * 60);
            item.y = y + i * sy;
            item.zOrder = 1;
            
            //item.y = y + i * 50; //Laya.stage.height / 2 * Math.random();

            //console.log("为背景:" + des + "添加物品信息，x:" + item.x + " y:" + item.y + " this.y " + this.y);
            //console.log("addNum " + addNum + " randomNumber" + randomNumber);

            this.addChild(item);
            arr.push(item);
        }
        */
        var list = ItemNormal.list.content;
        var index = Math.floor(list.length * Math.random());
        var y = this.bg1.y;
        if (des == "bg2")
            y = this.bg2.y;
        var array = list[index];
        array.forEach(function (element) {
            var item = new Item();
            item.init(element.type);
            item.zOrder = 1;
            item.x = element.x;
            item.y = y + element.y;
            _this.addChild(item);
            arr.push(item);
        });
        if (des == "bg1") {
            this.itemBack1 = [].concat(arr);
        }
        else {
            this.itemBack2 = [].concat(arr);
        }
    };
    return BackGround;
}(Laya.Sprite));
//# sourceMappingURL=BackGround.js.map