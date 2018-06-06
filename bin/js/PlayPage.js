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
var Sprite = Laya.Sprite;
var Stage = Laya.Stage;
var Render = Laya.Render;
var Browser = Laya.Browser;
var WebGL = Laya.WebGL;
var PlayPage = /** @class */ (function (_super) {
    __extends(PlayPage, _super);
    function PlayPage(gunIndex) {
        var _this = _super.call(this) || this;
        _this._clickCount = 0; //玩家点击次数
        _this._gameOver = false; //游戏是否结束
        _this.Matter = Browser.window.Matter;
        _this.LayaRender = Browser.window.LayaRender;
        _this.itemList = []; //当前生成的物品集合
        _this.BG_MUSIC_VOLUME = 0.5;
        _this.BG_WIDTH = 800;
        _this.BG_HEIGHT = 480;
        //游戏相关状态
        _this.IS_PAUSE = false;
        _this.IS_OVER = false;
        //背景的帧处理间隔
        _this.BG_FRAME_DELAY = 1;
        _this._bg = null;
        _this._floor = null;
        _this._view = fairygui.UIPackage.createObject("GunUI", "PlayScene").asCom;
        _this._view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
        fairygui.GRoot.inst.addChild(_this._view);
        _this._view.onClick(_this, _this.onClick);
        _this._score = _this._view.getChild("Score");
        _this._score.asTextField.text = "" + 0; //初始分数
        _this._bullet = _this._view.getChild("AmmoList");
        _this._coins = _this._view.getChild("CoinsNum");
        _this._coins.asTextField.text = "" + 0; //初始金币数
        _this._heartCount = 0;
        _this._coinNum = 0;
        _this._bulletNum = 0;
        _this.init();
        _this._bg = new BackGround();
        _this.addChild(_this._bg);
        return _this;
    }
    PlayPage.prototype.onClick = function (evt) {
        if (this.isOver()) {
            console.warn("游戏已经结束，不能再次点击.");
            return; //游戏已经结束
        }
        ++this._clickCount;
        var angle = this._gun.angle;
        if (angle > 2 * Math.PI) {
            var num = Math.floor(0.5 * angle / Math.PI);
            angle -= (num * 2 * Math.PI);
        }
        var force = 0.08 * this._gun.mass;
        var x0 = force * Math.sin(angle) / 12;
        var y0 = force * Math.cos(angle);
        if (y0 < 0)
            y0 = 0;
        this.Matter.Body.applyForce(this._gun, this._gun.position, { x: x0, y: -y0 });
        //this._bg.y += y0; //背景移动，仿佛枪在上移
        var rotateValue = Math.PI / 15;
        if (Math.PI < angle && angle < 2 * Math.PI)
            rotateValue *= -1;
        this.Matter.Body.setAngularVelocity(this._gun, rotateValue);
        //var bulletList: fairygui.GList = this._bullet.asList;
        //bulletList.removeChildAt(bulletList.numItems - 1); //删除子弹
    };
    PlayPage.prototype.init = function () {
        console.log("开始游戏...");
        this._gameOver = false;
        this.initMatter();
        this.initWorld();
        Laya.timer.frameLoop(1, this, this.onHeartBeat);
    };
    PlayPage.prototype.setScore = function (score) {
        this._score.asTextField.text = score.toString();
    };
    PlayPage.prototype.gainCoin = function (count) {
        this._coinNum = this._coinNum + count;
        this._coins.asTextField.text = this._coinNum.toString();
        console.log("增加金币，当前金币数量:" + this._coinNum);
    };
    PlayPage.prototype.gainBullet = function (count) {
        this._bulletNum = this._bulletNum + count;
        this._bullet.asTextField.text = this._bulletNum.toString();
        console.log("增加金币，当前数量:" + this._bulletNum);
    };
    PlayPage.prototype.getHoster = function () {
        return this._gun;
    };
    PlayPage.prototype.initMatter = function () {
        //初始化物理引擎
        this._engine = this.Matter.Engine.create({ enableSleeping: true });
        this.Matter.Engine.run(this._engine);
        //this._engine.world.gravity.y = 1;
        var render = this.LayaRender.create({ engine: this._engine, options: {
                background: '#000000', wireframes: false
            }
        });
        this.LayaRender.run(render);
    };
    PlayPage.prototype.initWorld = function () {
        this._gun = this.Matter.Bodies.rectangle(Laya.stage.width / 2, 500, 92, 271, {
            isStatic: false,
            frictionAir: 0.03,
            //density: 0.68, //密度
            //restitution: 0.8, //弹性
            //weight: 10,
            label: "gun",
            mass: 100,
            //angle: Math.PI/2,
            width: 92,
            height: 271,
            render: {
                visible: true,
                sprite: {
                    texture: "res/ak_47.png",
                    width: 92,
                    height: 271,
                    //x: 200,
                    //y: 300,
                    xOffset: 46,
                    yOffset: 135 // y 设置为中心点
                },
            },
            collisionFilter: { group: false }
        });
        this._gun_right = this.Matter.Bodies.rectangle(Laya.stage.width / 2, 500, 92, 271, {
            isStatic: false,
            frictionAir: 0.03,
            //density: 0.68, //密度
            //restitution: 0.8, //弹性
            //weight: 10,
            label: "gun",
            mass: 100,
            //angle: Math.PI/2,
            width: 92,
            height: 271,
            render: {
                visible: false,
                sprite: {
                    texture: "res/ak_47.png",
                    width: 92,
                    height: 271,
                    //x: 200,
                    //y: 300,
                    xOffset: 46,
                    yOffset: 135 // y 设置为中心点
                },
            },
            collisionFilter: { group: false }
        });
        //this._gun = this._gun_left;
        this.Matter.World.add(this._engine.world, [this._gun, this._gun_right,
        ]);
        //this.Matter.Events.on(this._engine, 'collisionActive', this.onCollision);
    };
    PlayPage.prototype.onGameOver = function () {
        if (this._gameOver)
            return;
        console.log("结束游戏...");
        this._gameOver = true;
        this.onDestroy(); //清理定时器
    };
    PlayPage.prototype.isOver = function () {
        if (this._gameOver)
            return true;
        //游戏子弹检测，没有子弹则结束游戏
        var bulletList = this._bullet.asList;
        if (bulletList.numItems == 0)
            return true;
        return false;
    };
    PlayPage.prototype.onDestroy = function () {
        Laya.timer.clear(this, this.onHeartBeat); //删除定时器
        if (this._gun)
            this.Matter.World.remove(this._engine.world, this._gun); //删除枪
        if (this._gun_left)
            this.Matter.World.remove(this._engine.world, this._gun_left); //删除枪
        if (this._gun_right)
            this.Matter.World.remove(this._engine.world, this._gun_right); //删除枪
    };
    PlayPage.prototype.onHeartBeat = function () {
        ++this._heartCount;
        var gun_x = this._gun.position.x;
        var gun_y = this._gun.position.y;
        var angle = this._gun.angle;
        if (this._gun_right.render.visible) {
            this._gun_right.position.y = gun_y;
            this._gun_right.angle = angle;
        }
        //console.log("心跳参数输出:" +  "this._gun.position:" + this._gun.position.x + " " + this._gun.position.y + " " 
        //        + " this._gun_right:" + this._gun_right.position.x + " " + this._gun_right.position.y);
        if (-Laya.stage.width + this._gun.width / 2 < gun_x && gun_x < this._gun.width / 2) {
            this._gun_right.position.y = gun_y;
            this._gun_right.angle = angle;
            this._gun_right.position.x = Laya.stage.width + gun_x;
            console.log("此时使用右侧枪");
            this._gun_right.render.visible = true;
        }
        else if (gun_x < -Laya.stage.width + this._gun.width / 2) {
            var position = this._gun_right.position;
            position.x += Laya.stage.width;
            this._gun.angle = this._gun_right.angle;
            this.Matter.Body.setPosition(this._gun, position);
            this._gun_right.render.visible = false;
            console.log("移动枪到右侧枪位置，隐藏右侧枪支");
        }
        else if (gun_x < Laya.stage.width * 2 - this._gun.width / 2 && gun_x > Laya.stage.width - this._gun.width / 2) {
            this._gun_right.position.y = gun_y;
            this._gun_right.angle = angle;
            this._gun_right.position.x = gun_x - Laya.stage.width;
            console.log("超过屏幕，调整位置，此时使用左侧枪");
            this._gun_right.render.visible = true;
        }
        else if (gun_x > Laya.stage.width * 2 - this._gun.width / 2) {
            var position = this._gun_right.position;
            position.x -= (Laya.stage.width + this._gun.width / 2);
            this.Matter.Body.setPosition(this._gun, position);
            console.log("超过屏幕2倍，调整位置，此时使用左侧枪");
            this._gun.angle = this._gun_right.angle;
        }
        else {
            this._gun.render.visible = true;
            this._gun_right.render.visible = false;
            //console.log("恢复正常状态");
        }
        this.hitCheck(this._gun);
        this.hitCheck(this._gun_right);
    };
    PlayPage.prototype.hitCheck = function (player) {
        this.itemCheck(player, this._bg.itemBack1);
        this.itemCheck(player, this._bg.itemBack2);
    };
    PlayPage.prototype.itemCheck = function (player, itemList) {
        var itemBack1 = this._bg.itemList;
        for (var i = 0; i < itemList.length; ++i) {
            var playerX = player.position.x;
            var playerY = player.position.y;
            var element = itemList[i];
            if (!element.visible)
                continue;
            var itemX = element.x + this._bg.x;
            var itemY = element.y + this._bg.y;
            var itemWidth = element.width;
            var itemHeight = element.height;
            var pY_left = itemY % Laya.stage.height - itemHeight / 2;
            var pY_right = itemY % Laya.stage.height + itemHeight / 2;
            if (playerX + this._gun.width / 2 < itemX - itemWidth / 2 || playerX - this._gun.width / 2 > itemX + itemWidth / 2 ||
                playerY + this._gun.height / 2 < pY_left || playerY - this._gun.height / 2 > pY_right) {
                continue;
            }
            var itemType = element.getType();
            switch (itemType) {
                case Item.ITEM_TYPE_JIASU: //加速
                    {
                        console.debug("加速.");
                        this._bg.y += 10;
                    }
                    break;
                case Item.ITEM_TYPE_JINBI: //金币
                    {
                        element.visible = false;
                        this._bg.removeChild(element);
                        this.gainCoin(1);
                    }
                    break;
                case Item.ITEM_TYPE_ZIDAN: //子弹
                    {
                        element.visible = false;
                        this._bg.removeChild(element);
                        this.gainBullet(1);
                    }
                    break;
                default:
                    alert("错误物品!");
                    break;
            }
        }
    };
    return PlayPage;
}(Sprite));
//# sourceMappingURL=PlayPage.js.map