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
        _this._paused = false; //游戏是否暂停
        _this.Matter = Browser.window.Matter;
        _this.LayaRender = Browser.window.LayaRender;
        _this.itemList = []; //当前生成的物品集合
        _this.BG_MUSIC_VOLUME = 0.5;
        _this.BG_WIDTH = 800;
        _this.BG_HEIGHT = 480;
        //背景的帧处理间隔
        _this.BG_FRAME_DELAY = 1;
        _this._bg = null;
        _this._floor = null;
        _this._pausePage = null;
        _this._view = fairygui.UIPackage.createObject("GunUI", "PlayScene").asCom;
        _this._view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
        fairygui.GRoot.inst.addChild(_this._view);
        _this._view.onClick(_this, _this.onClick);
        _this._score = _this._view.getChild("Score");
        _this._ammoList = _this._view.getChild("AmmoList");
        _this._ammoNum = _this._view.getChild("AmmoNum");
        _this._coins = _this._view.getChild("CoinsNum");
        _this._heartCount = 0; //心跳
        _this._coinNum = 0; //金币数量
        _this._scoreNum = 0; //分数
        _this._selectedGun = ItemNormal.list.guns[gunIndex];
        if (!_this._selectedGun)
            return _this;
        _this._bulletNum = _this._selectedGun.ammo; //子弹数量
        _this._gameOver = false;
        _this._paused = false;
        _this.init(); //初始化
        return _this;
    }
    PlayPage.prototype.init = function () {
        console.log("开始游戏...");
        this._bg = new BackGround();
        this.addChild(this._bg);
        this.initMatter();
        this.initWorld();
        this.onUpdate();
        this._pauseBtn = this._view.getChild("PauseButton"); //开始按钮
        this._pauseBtn.onClick(this, this.onPause);
        //播放背景音乐
        //背景音乐同时只能播放一个，
        //如果在播放背景音乐时再次调用本方法，
        //会先停止之前的背景音乐，再播放当前的背景音乐。
        //也就是说,这个方法只能用于背景音乐
        //Laya.SoundManager.musicVolume = BG_MUSIC_VOLUME;
        //Laya.SoundManager.playMusic("res/wav/BG.wav", 0);
        Laya.timer.frameLoop(1, this, this.onHeartBeat); //心跳
    };
    PlayPage.prototype.onComplete = function () {
        console.log("播放完成");
    };
    PlayPage.prototype.onClick = function (evt) {
        if (this._paused)
            return;
        if (this.isOver()) {
            console.warn("游戏已经结束，不能再次点击.");
            return; //游戏已经结束
        }
        console.log("播放音效");
        //Laya.SoundManager.playSound("wav/AK47.mp3", 1);
        ++this._clickCount;
        var angle = this._gun.angle;
        if (angle > 2 * Math.PI) {
            var num = Math.floor(0.5 * angle / Math.PI);
            angle -= (num * 2 * Math.PI);
        }
        var force = 0.08 * this._gun.mass;
        var x0 = force * Math.sin(angle);
        var y0 = force * Math.cos(angle);
        if (y0 < 0)
            y0 = 0;
        this.Matter.Body.applyForce(this._gun, this._gun.position, { x: x0, y: -y0 });
        var rotateValue = Math.PI / 15;
        if (Math.PI < angle && angle < 2 * Math.PI)
            rotateValue *= -1;
        this.Matter.Body.setAngularVelocity(this._gun, rotateValue);
        --this._bulletNum; //子弹减少
        this.onUpdate(); //更新界面
    };
    PlayPage.prototype.onUpdate = function () {
        this._ammoNum.text = this._bulletNum.toString();
        this._coins.asTextField.text = this._coinNum.toString();
        this._score.text = this._scoreNum.toString();
        for (var i = 0; i < this._ammoList.asList.numChildren; ++i) {
            var element = this._ammoList.asList._children[i];
            if (i < this._bulletNum) {
                element.getController("Empty").selectedIndex = 0;
            } //白底
            else {
                element.getController("Empty").selectedIndex = 1;
            } //黑底
        }
    };
    PlayPage.prototype.resetNum = function (score, bullet, coins) {
        this._scoreNum = score;
        this._bulletNum = bullet;
        this._coinNum = coins;
        this.onUpdate();
    };
    PlayPage.prototype.onPause = function () {
        this._paused = !this._paused;
        this._bg.onPause(this._paused);
        console.log("暂停游戏:" + this._paused);
        this._gun.isStatic = this._paused;
        this._gun_right.isStatic = this._paused;
        if (this._paused) {
            this._view.visible = false;
            if (this._gun)
                this.Matter.World.remove(this._engine.world, this._gun); //删除枪
            if (this._gun_right)
                this.Matter.World.remove(this._engine.world, this._gun_right); //删除枪
            this._pausePage = new PausePage(this._scoreNum, this._bulletNum, this._coinNum);
            this._pausePage.zOrder = 1;
            Laya.stage.addChild(this._pausePage);
        }
        else {
            this._view.visible = true;
            if (this._gun)
                this.Matter.World.add(this._engine.world, this._gun); //删除枪
            if (this._gun_right)
                this.Matter.World.add(this._engine.world, this._gun_right); //删除枪
        }
    };
    PlayPage.prototype.onHide = function () {
        this._gun.render.visible = false;
        this._gun_right.render.visible = false;
    };
    PlayPage.prototype.setScore = function (score) {
        this._scoreNum += score;
        console.log("增加分数，当前分数数量:" + this._scoreNum);
    };
    PlayPage.prototype.gainCoin = function (count) {
        this._coinNum = this._coinNum + count;
        console.log("增加金币，当前金币数量:" + this._coinNum);
    };
    PlayPage.prototype.gainBullet = function (count) {
        this._bulletNum = this._bulletNum + count;
        console.log("增加金币，当前数量:" + this._bulletNum);
    };
    PlayPage.prototype.getHoster = function () {
        return this._gun;
    };
    PlayPage.prototype.initMatter = function () {
        this._engine = this.Matter.Engine.create({ enableSleeping: true }); //初始化物理引擎
        this.Matter.Engine.run(this._engine);
        //this._engine.world.gravity.y = 1;
        this._render = this.LayaRender.create({ engine: this._engine, options: {
                background: '#000000', wireframes: false
            }
        });
        this.LayaRender.run(this._render);
    };
    PlayPage.prototype.initWorld = function () {
        this._gun = this.Matter.Bodies.rectangle(200, 500, 92, 271, {
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
        this._gun_right = this.Matter.Bodies.rectangle(Laya.stage.width / 2, 700, 92, 271, {
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
        this.Matter.World.add(this._engine.world, [this._gun, this._gun_right]);
    };
    PlayPage.prototype.onGameOver = function () {
        console.log("结束游戏");
        this._view.visible = false; //隐藏当前界面
        this._bg.visible = false; //隐藏背景图
        var continuePage = new ContinuePage(this._scoreNum);
        Laya.stage.addChild(continuePage);
        this._gameOver = true;
        this._bg.onGameOver();
        this.onDestroy(); //清理定时器
    };
    PlayPage.prototype.isOver = function () {
        if (this._gameOver)
            return true;
        if (this._bulletNum <= 0)
            return true;
        return false;
    };
    PlayPage.prototype.onDestroy = function () {
        Laya.timer.clear(this, this.onHeartBeat); //删除定时器
        if (this._gun)
            this.Matter.World.remove(this._engine.world, this._gun); //删除枪
        if (this._gun_right)
            this.Matter.World.remove(this._engine.world, this._gun_right); //删除枪
    };
    PlayPage.prototype.onHeartBeat = function () {
        //console.log("此时枪支状态1:" + this._gun.render.visible + " " + this._gun_right.render.visible);
        if (this._paused) {
            if (this._gun)
                this.Matter.World.remove(this._engine.world, this._gun); //删除枪
            if (!this._gun.render.visible)
                return;
            console.log("暂停游戏，隐藏枪支.");
            this._gun.isStatic = false;
            this._gun_right.isStatic = false;
            this._gun.render.visible = false;
            this._gun_right.render.visible = false;
            this._gun.render.sprite.texture.visible = false;
            this._gun_right.render.sprite.visible = false;
            return;
        }
        if (this.isOver()) {
            this.onGameOver();
            return;
        }
        ++this._heartCount;
        var gun_x = this._gun.position.x;
        var gun_y = this._gun.position.y;
        var angle = this._gun.angle;
        if (this._gun_right.render.visible) {
            this._gun_right.position.y = gun_y;
            this._gun_right.angle = angle;
        }
        console.log("心跳参数输出:" + "this._gun.position:" + this._gun.position.x + " " + this._gun.position.y + " "
            + " this._gun_right:" + this._gun_right.position.x + " " + this._gun_right.position.y);
        //console.log("背景移动距离:" + this._bg.y);
        this._scoreNum = this._bg.y;
        if (-Laya.stage.width + this._gun.width / 2 < gun_x && gun_x < this._gun.width / 2) {
            this._gun_right.position.y = gun_y;
            this._gun_right.angle = angle;
            this._gun_right.position.x = Laya.stage.width + gun_x;
            //console.log("此时使用右侧枪"); 
            this._gun_right.render.visible = true;
        }
        else if (gun_x < -Laya.stage.width + this._gun.width / 2) {
            var position = this._gun_right.position;
            position.x += Laya.stage.width;
            this._gun.angle = this._gun_right.angle;
            this.Matter.Body.setPosition(this._gun, position);
            this._gun_right.render.visible = false;
            //console.log("移动枪到右侧枪位置，隐藏右侧枪支");
        }
        else if (gun_x < Laya.stage.width * 2 - this._gun.width / 2 && gun_x > Laya.stage.width - this._gun.width / 2) {
            this._gun_right.position.y = gun_y;
            this._gun_right.angle = angle;
            this._gun_right.position.x = gun_x - Laya.stage.width;
            //console.log("超过屏幕，调整位置，此时使用左侧枪");
            if (this._gun.position.x > 0 && this._gun.position.x < Laya.stage.width) {
                this._gun_right.render.visible = false;
            }
            else {
                this._gun_right.render.visible = true;
            }
            //console.log("调试日志:" +  "this._gun.position:" + this._gun.position.x + " " + this._gun.position.y + " " 
            //    + " this._gun_right:" + this._gun_right.position.x + " " + this._gun_right.position.y);
        }
        else if (gun_x > Laya.stage.width * 2 - this._gun.width / 2) {
            var position = this._gun_right.position;
            position.x -= (Laya.stage.width + this._gun.width / 2);
            this.Matter.Body.setPosition(this._gun, position);
            //console.log("超过屏幕2倍，调整位置，此时使用左侧枪");
            this._gun.angle = this._gun_right.angle;
        }
        else {
            this._gun.render.visible = true;
            this._gun_right.render.visible = false;
            //console.log("恢复正常状态");
        }
        if (this._gun.position.y > Laya.stage.height)
            this._gameOver = true;
        this.hitCheck(this._gun);
        this.hitCheck(this._gun_right);
        //console.log("此时枪支状态:" + this._gun.render.visible + " " + this._gun_right.render.visible);
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
                        this._bulletNum = this._selectedGun.ammo; //子弹数量加满
                        this.onUpdate();
                    }
                    break;
                default:
                    alert("错误物品!");
                    break;
            } //switch
        } //for
    }; //itemCheck
    return PlayPage;
}(Sprite)); //class
//# sourceMappingURL=PlayPage.js.map