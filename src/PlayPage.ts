import Sprite = Laya.Sprite;
import Stage = Laya.Stage;
import Render = Laya.Render;
import Browser = Laya.Browser;
import WebGL = Laya.WebGL;

class PlayPage extends Sprite
{
    private _view: fairygui.GComponent;
    private _backBtn: fairygui.GObject;
    private _demoContainer: fairygui.GComponent;
    private _cc: fairygui.Controller;

    private _demoObjects: any;

    private _score: fairygui.GObject; //分数
    private _ammoList: fairygui.GObject; //子弹数
    private _coins: fairygui.GObject; //金币
    
    private _gun: any; //fairygui.GObject; //枪
    //private _gun_left: any; //fairygui.GObject; //枪
    private _gun_right: any; //fairygui.GObject; //枪

    private _selectedGun: any; //玩家选择枪的配置数据
    private _pauseBtn: fairygui.GObject; //暂停

    private _clickCount = 0; //玩家点击次数
    private _gameOver = false; //游戏是否结束
    private _paused = false; //游戏是否暂停

	public Matter: any = Browser.window.Matter;
	public LayaRender: any = Browser.window.LayaRender;
		
	public _engine: any;

    private _heartCount: number;
    private _coinNum: number;
    private _bulletNum: number;
    private _ammoNum: any;
    private _scoreNum: number; //分数

    private bg1: any;
    private bg2: any;
    private cat: any;
    private tree: any;

    private itemList = [];  //当前生成的物品集合

    private BG_MUSIC_VOLUME = 0.5;
    private BG_WIDTH = 800;
    private BG_HEIGHT = 480;

    //背景的帧处理间隔
    private BG_FRAME_DELAY = 1;

    private _bg = null;
    private _floor = null;
    private _pausePage = null;

    public constructor(gunIndex: number) 
    {
        super();
        
        this._view = fairygui.UIPackage.createObject("GunUI", "PlayScene").asCom;
        this._view.setSize(fairygui.GRoot.inst.width,fairygui.GRoot.inst.height);
        fairygui.GRoot.inst.addChild(this._view);

        this._view.onClick(this, this.onClick);

        this._score = this._view.getChild("Score"); 
        this._ammoList = this._view.getChild("AmmoList"); 
        this._ammoNum = this._view.getChild("AmmoNum"); 
        this._coins = this._view.getChild("CoinsNum"); 

        this._heartCount = 0; //心跳
        this._coinNum = 0; //金币数量
        this._scoreNum = 0; //分数
       
        this._selectedGun = ItemNormal.list.guns[gunIndex];
        if (!this._selectedGun) return;
        this._bulletNum = this._selectedGun.ammo; //子弹数量
        
        this._gameOver = false;
        this._paused = false;

        this.init(); //初始化
    }

    private init(): void
    {
        console.log("开始游戏...");

        this._bg = new BackGround();
        this.addChild(this._bg);   

        this.initMatter();
        this.initWorld();

        this.onUpdate();

        this._pauseBtn = this._view.getChild("PauseButton"); //开始按钮
        this._pauseBtn.onClick(this, this.onPause);

        Laya.timer.frameLoop(1, this, this.onHeartBeat); //心跳
    }
    
    private onClick(evt: Event): void 
    {
        if (this._paused) return;

        if (this.isOver()) 
        {
            console.warn("游戏已经结束，不能再次点击.");
            return; //游戏已经结束
        }

        ++this._clickCount;
      
        var angle = this._gun.angle;

        if (angle > 2 * Math.PI)
        {
            var num = Math.floor(0.5 * angle / Math.PI);
            angle -= (num * 2 * Math.PI);
        }

        var force = 0.08 * this._gun.mass;
        var x0 = force * Math.sin(angle) / 12;
        var y0 = force * Math.cos(angle);

        if (y0 < 0) y0 = 0;

        this.Matter.Body.applyForce(this._gun, this._gun.position, { x: x0, y: -y0 });

        //this._bg.y += (y0 * 10); //背景移动，仿佛枪在上移

        var rotateValue = Math.PI / 15;
        if (Math.PI < angle && angle < 2 * Math.PI) rotateValue *= -1;

        this.Matter.Body.setAngularVelocity(this._gun, rotateValue);

        --this._bulletNum; //子弹减少

        this.onUpdate(); //更新界面
    }

    private onUpdate(): void
    {
        this._ammoNum.text = this._bulletNum.toString();
        this._coins.asTextField.text = this._coinNum.toString();
        this._score.text = this._scoreNum.toString();

        //设置质量
        for (var i = 0; i < this._ammoList.asList.numChildren; ++i)
        {
            var element = this._ammoList.asList._children[i];

            if (i < this._bulletNum) { element.getController("Empty").selectedIndex = 0; } //白底
            else { element.getController("Empty").selectedIndex = 1; } //黑底
        }
    }

    public onPause(): void
    {
        this._paused = !this._paused;
        this._bg.onPause(this._paused);
        
        console.log("暂停游戏:" + this._paused);

        if (this._paused)
        {
            this._view.visible = false;
            this._gun.render.visible = false;
            this._gun_right.render.visible = false;

            this._pausePage = new PausePage(this._scoreNum, this._bulletNum, this._coinNum);
            //this._pausePage.zOrder = 1;
            Laya.stage.addChild(this._pausePage);
        }
        else
        {
            this._view.visible = true;
            this._gun.render.visible = true;
            //this._gun_right.render.visible = true;
        }

        this._gun.isStatic = this._paused;
        this._gun_right.isStatic = this._paused;
    }

    private setScore(score: number)
    {
        this._scoreNum += score;
        console.log("增加分数，当前分数数量:" + this._scoreNum);
    }

    private gainCoin(count: number)
    {
        this._coinNum = this._coinNum + count;
        console.log("增加金币，当前金币数量:" + this._coinNum);
    }

    private gainBullet(count: number)
    {
        this._bulletNum = this._bulletNum + count;
        console.log("增加金币，当前数量:" + this._bulletNum);
    }

    public getHoster(): any
    {
        return this._gun;
    }

    private initMatter(): void
    {
		this._engine = this.Matter.Engine.create({ enableSleeping: true }); //初始化物理引擎
		this.Matter.Engine.run(this._engine);
			
        //this._engine.world.gravity.y = 1;

		var render = this.LayaRender.create({engine: this._engine, options: {
                background: '#000000', wireframes: false
            }
        });
		this.LayaRender.run(render);
    }
		
    private initWorld(): void
    {
        this._gun = this.Matter.Bodies.rectangle(Laya.stage.width / 2, 500, 92, 271, { 
            isStatic: false,
            frictionAir: 0.03,  //空气摩擦力
            //density: 0.68, //密度
            //restitution: 0.8, //弹性
            //weight: 10,
            label: "gun",
            mass: 100,
            //angle: Math.PI/2,
            width: 92,
            height: 271,
            render: {
                visible: true, //开启渲染
                sprite: 
                {
                    texture: "res/ak_47.png",
                    width: 92,
                    height: 271,
                    //x: 200,
                    //y: 300,
                    xOffset: 46, // x 设置为中心点
                    yOffset: 135 // y 设置为中心点
                },
            },
            collisionFilter: {group: false}
        });

        this._gun_right = this.Matter.Bodies.rectangle(Laya.stage.width / 2, 500, 92, 271, { 
            isStatic: false,
            frictionAir: 0.03,  //空气摩擦力
            //density: 0.68, //密度
            //restitution: 0.8, //弹性
            //weight: 10,
            label: "gun",
            mass: 100,
            //angle: Math.PI/2,
            width: 92,
            height: 271,
            render: {
                visible: false, //开启渲染
                sprite: 
                {
                    texture: "res/ak_47.png",
                    width: 92,
                    height: 271,
                    //x: 200,
                    //y: 300,
                    xOffset: 46, // x 设置为中心点
                    yOffset: 135 // y 设置为中心点
                },
            },
            collisionFilter: {group: false}
        });

        this.Matter.World.add(this._engine.world, [ this._gun, this._gun_right ]);
    }

    private onGameOver(): void
    {
        console.log("结束游戏");

        this._view.visible = false; //隐藏当前界面
        this._bg.visible = false; //隐藏背景图

        var continuePage = new ContinuePage(this._scoreNum);
        Laya.stage.addChild(continuePage);

        this._gameOver = true;
        this._bg.onGameOver(); 

        this.onDestroy(); //清理定时器
    }

    private isOver(): boolean
    {
        if (this._gameOver) return true;
        
        if (this._bulletNum <= 0) return true;

        return false;
    }

    private onDestroy(): void
    {
        Laya.timer.clear(this, this.onHeartBeat); //删除定时器

        if (this._gun) this.Matter.World.remove(this._engine.world, this._gun); //删除枪
        //if (this._gun_left) this.Matter.World.remove(this._engine.world, this._gun_left); //删除枪
        if (this._gun_right) this.Matter.World.remove(this._engine.world, this._gun_right); //删除枪
    }
    
    private onHeartBeat(): void
    {
        if (this._paused) 
        {
            this._gun.render.visible = false;
            this._gun_right.render.visible = false;
            return;
        }

        if (this.isOver())
        {
            this.onGameOver();
            return;
        }
        
        ++ this._heartCount;

        var gun_x = this._gun.position.x;
        var gun_y = this._gun.position.y;
        var angle = this._gun.angle;

        if (this._gun_right.render.visible)
        {
            this._gun_right.position.y = gun_y;
            this._gun_right.angle = angle;
        }

        //console.log("心跳参数输出:" +  "this._gun.position:" + this._gun.position.x + " " + this._gun.position.y + " " 
        //        + " this._gun_right:" + this._gun_right.position.x + " " + this._gun_right.position.y);

        //console.log("背景移动距离:" + this._bg.y);

        this._scoreNum = this._bg.y;

        if (-Laya.stage.width + this._gun.width / 2 < gun_x && gun_x < this._gun.width / 2)
        {
            this._gun_right.position.y = gun_y;
            this._gun_right.angle = angle;

            this._gun_right.position.x = Laya.stage.width + gun_x;

            console.log("此时使用右侧枪"); 

            this._gun_right.render.visible = true;
        }
        else if (gun_x < -Laya.stage.width + this._gun.width / 2)
        {
            var position = this._gun_right.position;
            position.x += Laya.stage.width;
            this._gun.angle = this._gun_right.angle;

            this.Matter.Body.setPosition(this._gun, position);

            this._gun_right.render.visible = false;

            console.log("移动枪到右侧枪位置，隐藏右侧枪支");
        }
        else if (gun_x < Laya.stage.width * 2 - this._gun.width / 2 && gun_x > Laya.stage.width - this._gun.width / 2)
        {
            this._gun_right.position.y = gun_y;
            this._gun_right.angle = angle;

            this._gun_right.position.x = gun_x - Laya.stage.width;

            console.log("超过屏幕，调整位置，此时使用左侧枪");

            if (this._gun.position.x > 0 && this._gun.position.x < Laya.stage.width)
            {
                this._gun_right.render.visible = false;
            }
            else
            {
                this._gun_right.render.visible = true;
            }

            console.log("调试日志:" +  "this._gun.position:" + this._gun.position.x + " " + this._gun.position.y + " " 
                + " this._gun_right:" + this._gun_right.position.x + " " + this._gun_right.position.y);
        }
        else if (gun_x > Laya.stage.width * 2 - this._gun.width / 2)
        {
            var position = this._gun_right.position;
            position.x -= (Laya.stage.width + this._gun.width / 2);

            this.Matter.Body.setPosition(this._gun, position);

            console.log("超过屏幕2倍，调整位置，此时使用左侧枪");

            this._gun.angle = this._gun_right.angle;
        }
        else
        {
            this._gun.render.visible = true;
            this._gun_right.render.visible = false;

            //console.log("恢复正常状态");
        }

        this.hitCheck(this._gun);
        this.hitCheck(this._gun_right);
    }

    public hitCheck(player): void
    {
        this.itemCheck(player, this._bg.itemBack1);
        this.itemCheck(player, this._bg.itemBack2);
    }

    private itemCheck(player, itemList): void
    {
        var itemBack1 = this._bg.itemList;

        for(var i = 0; i < itemList.length; ++i)
        {
            var playerX = player.position.x;
            var playerY = player.position.y;

            var element = itemList[i];
            if (!element.visible) continue;

            var itemX = element.x + this._bg.x;
            var itemY = element.y + this._bg.y;
            var itemWidth = element.width;
            var itemHeight = element.height;

            var pY_left = itemY % Laya.stage.height - itemHeight / 2;
            var pY_right = itemY % Laya.stage.height + itemHeight / 2;
            
            if (playerX + this._gun.width / 2 < itemX - itemWidth / 2 || playerX - this._gun.width / 2 > itemX + itemWidth / 2 || 
                playerY + this._gun.height / 2 < pY_left || playerY - this._gun.height / 2 > pY_right)
            {
                continue;
            }

            var itemType = element.getType();

            switch(itemType)
            {
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

    } //itemCheck

} //class
