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
    function PlayPage() {
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
        //背景移动速度
        _this.BG_SPEED = 3;
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
        _this._view.getChild("GunInGame").visible = false;
        _this._heartCount = 0;
        _this._coinNum = 0;
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
        if (!this._gun)
            this._gun = this._gun_left; //初始化
        this.Matter.Body.setAngularVelocity(this._gun, 0);
        ++this._clickCount;
        var angle = this._gun.angle;
        if (angle > 2 * Math.PI) {
            angle = 0.5 * angle / Math.PI;
        }
        //console.log("玩家点击屏幕，点击次数:" + this._clickCount + " " + this._gun.mass); 
        var force = 0.08 * this._gun.mass;
        var x0 = force * Math.sin(angle) / 12;
        var y0 = force * Math.cos(angle);
        if (y0 < 0)
            y0 = 0;
        this.Matter.Body.applyForce(this._gun, this._gun.position, { x: x0, y: -y0 });
        var rotateValue = Math.PI / 15;
        if (Math.PI < angle && angle < 2 * Math.PI)
            rotateValue *= -1;
        /*
                console.log("x:" + x0);
                console.log("y:" + y0);
                console.log("angle:" + angle);
                console.log("rotateValue:" + rotateValue);
                */
        this.Matter.Body.setAngularVelocity(this._gun, rotateValue);
        //var bulletList: fairygui.GList = this._bullet.asList;
        //bulletList.removeChildAt(bulletList.numItems - 1); //删除子弹
        //this._bg.y += 100;
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
    };
    PlayPage.prototype.gainBullet = function (count) {
        //var currCount = parseInt(this._coins.asTextField.text);
        //this._coins.asTextField.text = (count + currCount).toString();
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
        this._gun_left = this.Matter.Bodies.rectangle(Laya.stage.width / 2, 500, 92, 271, {
            isStatic: false,
            frictionAir: 0.03,
            //density: 0.68, //密度
            //restitution: 0.8, //弹性
            //weight: 10,
            label: "gun",
            mass: 100,
            //angle: Math.PI/2,
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
            isStatic: true,
            frictionAir: 0.03,
            //density: 0.68, //密度
            //restitution: 0.8, //弹性
            //weight: 10,
            label: "gun",
            mass: 100,
            //angle: Math.PI/2,
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
        this.Matter.World.add(this._engine.world, [this._gun_left, this._gun_right,
            this.Matter.Bodies.rectangle(0, Laya.stage.height + 100, Laya.stage.width * 2, 1, {
                isStatic: true,
                label: "gameover"
            }),
        ]);
        this.Matter.Events.on(this._engine, 'collisionActive', this.onCollision);
    };
    PlayPage.prototype.onCollision = function (event) {
        console.log("碰撞了..");
        var home = _gamePage._mainPage._playPage;
        for (var i = 0; i < event.pairs.length; i++) {
            var pair = event.pairs[i];
            if (!(pair.bodyA.label === 'gun' || pair.bodyB.label == "gun"))
                continue;
            var other;
            if (pair.bodyA.label === 'gun') {
                other = pair.bodyB;
            }
            else {
                other = pair.bodyA;
            }
            switch (other.label) {
                case "gameover":
                    {
                        home.onGameOver();
                    }
                    break;
                case "coin":
                    {
                        home.gainCoin(1);
                    }
                    break;
                case "bullet":
                    {
                        home.gainBullet(1);
                    }
                    break;
            }
            console.log("删除物体:", other.label);
            home.Matter.World.remove(home._engine.world, other);
        }
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
        return;
        Laya.timer.clear(this, this.onHeartBeat); //删除定时器
        if (this._gun)
            this.Matter.World.remove(this._engine.world, this._gun); //删除枪
        if (this._gun_left)
            this.Matter.World.remove(this._engine.world, this._gun_left); //删除枪
        if (this._gun_right)
            this.Matter.World.remove(this._engine.world, this._gun_right); //删除枪
    };
    PlayPage.prototype.onHeartBeat = function () {
        //this._score.asTextField.text = this._bg.y.toString();
        //移动
        //this.onLoop();
        //this._gun_rotater.visible = true;
        if (!this._gun)
            return;
        ++this._heartCount;
        //if (this._heartCount % 200 == 0) this.createCoins();
        var gun_x = this._gun.position.x;
        var gun_y = this._gun.position.y;
        var angle = this._gun.angle;
        this._gun_right.position.y = gun_y;
        this._gun_right.angle = angle;
        //console.log("gun_x: " + gun_x);
        var bijiao = 0;
        if (gun_x < Laya.stage.width) //屏幕左侧
         {
            bijiao = gun_x - this._gun.render.sprite.width;
        }
        else {
        }
        if (bijiao < 0) {
            this._gun_right.position.x = Laya.stage.width + gun_x;
            //console.log("超过屏幕，调整位置，此时使用右侧枪");
            this._gun_right.render.visible = true;
            //this._gun = this._gun_left;
        }
        else if (bijiao > Laya.stage.width) {
            this._gun_right.position.x = gun_x - Laya.stage.width;
            //console.log("超过屏幕，调整位置，此时使用左侧枪");
            this._gun_left.render.visible = true;
            this._gun = this._gun_right;
        }
        else {
            /*
            this._gun_left = this._gun;
            this._gun_right = this._gun;

            this._gun_left.visible = true;
            this._gun_right.visible = false;
            */
        }
    };
    PlayPage.prototype.createCoins = function () {
        for (var i = 0; i < 10; ++i) {
            var x = Math.random() * Laya.stage.width;
            var y = Math.random() * Laya.stage.height;
            var coin = new Sprite().loadImage("res/coin.png");
            coin.x = x;
            coin.y = -y;
            this.addChild(coin);
        }
    };
    PlayPage.prototype.onLoop = function () {
        if (this.IS_PAUSE || this.IS_OVER) {
            return;
        }
        if (this._heartCount % 21 == 0)
            this.createCoins();
        //移动
        this.y -= this.BG_SPEED;
        if (this.bg1.y + this.y <= -this.BG_HEIGHT) {
            this.bg1.y += this.BG_HEIGHT * 2;
        }
        if (this.bg2.y + this.y <= -this.BG_HEIGHT) {
            this.bg2.y += this.BG_HEIGHT * 2;
        }
        if (this.tree.y + this.y <= -this.BG_HEIGHT) {
            this.tree.y += this.BG_HEIGHT * 2;
        }
        if (this.cat.y + this.y <= -this.BG_HEIGHT) {
            this.cat.y += this.BG_HEIGHT * 2;
        }
    };
    PlayPage.prototype.checkHit = function (playerX, playerY) {
        /*
            玩家在上方:
                玩家的Y轴 < (地板Y+FLOOR_HEIGHT)
                玩家Y > 地板Y
        */
        if (playerY > this.y && playerY < (this.y + FLOOR_HEIGHT))
            return true;
        return false;
    };
    return PlayPage;
}(Sprite));
//# sourceMappingURL=PlayPage.js.map