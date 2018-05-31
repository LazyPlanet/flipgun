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
    private _bullet: fairygui.GObject; //子弹数
    private _coins: fairygui.GObject; //金币
    
    private _gun: any; //fairygui.GObject; //枪
    private _gun_left: any; //fairygui.GObject; //枪
    private _gun_right: any; //fairygui.GObject; //枪

    private _gunTexture: any; //枪图集
    private _ammoList: any; 

    private _clickCount = 0; //玩家点击次数
    private _gameOver = false; //游戏是否结束

	public Matter: any = Browser.window.Matter;
	public LayaRender: any = Browser.window.LayaRender;
		
	//private _background: Laya.Sprite;
    //private _background: fairygui.GObject; //金币
	public _engine: any;

    private _heartCount: number;
    private _coinNum: number;
    private _bulletNum: number;

    private bg1: any;
    private bg2: any;
    private cat: any;
    private tree: any;

    private itemList = [];  //当前生成的物品集合

    private BG_MUSIC_VOLUME = 0.5;
    private BG_WIDTH = 800;
    private BG_HEIGHT = 480;

    //游戏相关状态
    private IS_PAUSE = false;
    private IS_OVER = false;

    //背景移动速度
    private BG_SPEED = 3;
    //背景的帧处理间隔
    private BG_FRAME_DELAY = 1;

    private _bg = null;
    private _floor = null;

    public constructor() 
    {
        super();
        
        this._view = fairygui.UIPackage.createObject("GunUI", "PlayScene").asCom;
        this._view.setSize(fairygui.GRoot.inst.width,fairygui.GRoot.inst.height);
        fairygui.GRoot.inst.addChild(this._view);

        this._view.onClick(this, this.onClick);

        this._score = this._view.getChild("Score"); 
        this._score.asTextField.text = "" + 0; //初始分数

        this._bullet = this._view.getChild("AmmoList"); 

        this._coins = this._view.getChild("CoinsNum"); 
        this._coins.asTextField.text = "" + 0; //初始金币数

        this._view.getChild("GunInGame").visible = false; 
        
        this._heartCount = 0;
        this._coinNum = 0;
        this._bulletNum = 0;

        this.init();

        this._bg = new BackGround();
        this.addChild(this._bg);
    }
    
    private onClick(evt: Event): void 
    {
        if (this.isOver()) 
        {
            console.warn("游戏已经结束，不能再次点击.");
            return; //游戏已经结束
        }
        
        if (!this._gun) this._gun = this._gun_left; //初始化
        
        this.Matter.Body.setAngularVelocity(this._gun, 0);

        ++this._clickCount;
      
        var angle = this._gun.angle;

        if (angle > 2 * Math.PI)
        {
            angle = 0.5 * angle / Math.PI;
        }

        var force = 0.08 * this._gun.mass;
        var x0 = force * Math.sin(angle) / 12;
        var y0 = force * Math.cos(angle);

        if (y0 < 0) y0 = 0;

        this.Matter.Body.applyForce(this._gun, this._gun.position, { x: x0, y: -y0 });

        var rotateValue = Math.PI / 15;
        if (Math.PI < angle && angle < 2 * Math.PI) rotateValue *= -1;

        this.Matter.Body.setAngularVelocity(this._gun, rotateValue);

        //var bulletList: fairygui.GList = this._bullet.asList;
        //bulletList.removeChildAt(bulletList.numItems - 1); //删除子弹
    }

    private init(): void
    {
        console.log("开始游戏...");
        
        this._gameOver = false;

        this.initMatter();
        this.initWorld();

        Laya.timer.frameLoop(1, this, this.onHeartBeat);
    }

    private setScore(score: number)
    {
        this._score.asTextField.text = score.toString();
    }

    private gainCoin(count: number)
    {
        this._coinNum = this._coinNum + count;
        this._coins.asTextField.text = this._coinNum.toString();

        console.log("增加金币，当前金币数量:" + this._coinNum);
    }

    private gainBullet(count: number)
    {
        this._bulletNum = this._bulletNum + count;
        this._bullet.asTextField.text = this._bulletNum.toString();

        console.log("增加金币，当前数量:" + this._bulletNum);
    }

    public getHoster(): any
    {
        return this._gun;
    }

    private initMatter(): void
    {
        //初始化物理引擎
		this._engine = this.Matter.Engine.create({ enableSleeping: true });
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
        this._gun = this._gun_left = this.Matter.Bodies.rectangle(Laya.stage.width / 2, 500, 92, 271, { 
            isStatic: false,
            frictionAir: 0.03,  //空气摩擦力
            //density: 0.68, //密度
            //restitution: 0.8, //弹性
            //weight: 10,
            label: "gun",
            mass: 100,
            //angle: Math.PI/2,
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
            isStatic: true,
            frictionAir: 0.03,  //空气摩擦力
            //density: 0.68, //密度
            //restitution: 0.8, //弹性
            //weight: 10,
            label: "gun",
            mass: 100,
            //angle: Math.PI/2,
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

        this.Matter.World.add(this._engine.world, [this._gun_left, this._gun_right, //枪
            this.Matter.Bodies.rectangle(0, Laya.stage.height + 100, Laya.stage.width * 2, 1, { 
                isStatic: true, 
                label: "gameover"
             }), //触底失败
        ]);

        this.Matter.Events.on(this._engine, 'collisionActive', this.onCollision);
    }

    private onCollision(event): void
    {
        console.log("碰撞了..");

        var home = _gamePage._mainPage._playPage;

        for(var i = 0; i < event.pairs.length; i++) {

            var pair = event.pairs[i];

            if(!(pair.bodyA.label === 'gun' || pair.bodyB.label == "gun")) continue;

            var other;

            if (pair.bodyA.label === 'gun')
            {
                other = pair.bodyB;
            }
            else
            {
                other = pair.bodyA;
            }

            switch(other.label)
            {
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
    }

    private onGameOver(): void
    {
        if (this._gameOver) return;

        console.log("结束游戏...");

        this._gameOver = true;

        this.onDestroy(); //清理定时器
    }

    private isOver(): boolean
    {
        if (this._gameOver) return true;

        //游戏子弹检测，没有子弹则结束游戏
        var bulletList: fairygui.GList = this._bullet.asList;
        if (bulletList.numItems == 0) return true;

        return false;
    }

    private onDestroy(): void
    {
        Laya.timer.clear(this, this.onHeartBeat); //删除定时器

        if (this._gun) this.Matter.World.remove(this._engine.world, this._gun); //删除枪
        if (this._gun_left) this.Matter.World.remove(this._engine.world, this._gun_left); //删除枪
        if (this._gun_right) this.Matter.World.remove(this._engine.world, this._gun_right); //删除枪
    }
    
    private onHeartBeat(): void
    {
        if (!this._gun) return;

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
        else
        {
            
        }

        if (bijiao < 0)
        {
            this._gun_right.position.x = Laya.stage.width + gun_x;

            //console.log("超过屏幕，调整位置，此时使用右侧枪");

            this._gun_right.render.visible = true;
            //this._gun = this._gun_left;
        }
        else if (bijiao > Laya.stage.width)
        {
            this._gun_right.position.x = gun_x - Laya.stage.width;

            //console.log("超过屏幕，调整位置，此时使用左侧枪");

            this._gun_left.render.visible = true;
            this._gun = this._gun_right;
        }
       
        this.hitCheck(this._gun.position.x, this._gun.position.y);
    }

    private createCoins(): void
    {
        for (var i = 0; i < 10; ++i)
        {
            var x = Math.random() * Laya.stage.width;
            var y = Math.random() * Laya.stage.height;

            var coin = new Sprite().loadImage("res/coin.png");
            coin.x = x;
            coin.y = -y;
            this.addChild(coin);
        }
    }

    public hitCheck(playerX, playerY): void
    {
        var itemBack1 = this._bg.itemBack1;

        for(var i = 0; i < itemBack1.length; ++i)
        {
            var element = itemBack1[i];
            var itemX = element.x;
            var itemY = element.y;
            var itemWidth = element.width;
            var itemHeight = element.height;

            var pY_left = Math.abs(itemY) % Laya.stage.height - itemHeight / 2;
            var pY_right = Math.abs(itemY) % Laya.stage.height + itemHeight / 2;
            
            console.log("检测碰撞物体:" + " playerX:" + playerX + " playerY:" + playerY + " itemX:" + itemX + " itemY:" + itemY + 
                " itemWidth:" + itemWidth + " itemHeight:" + itemHeight + " pY_left:" + pY_left + " pY_right:" + pY_right);

            if (playerX < itemX - itemWidth / 2 || playerX > itemX + itemWidth / 2 || playerY < pY_left || playerY > pY_right)
            {
                continue;
            }

            var itemType = element.getType();

            switch(itemType){
                case Item.ITEM_TYPE_JIASU: //加速
                break;

                case Item.ITEM_TYPE_JINBI: //金币
                this.gainCoin(1);
                break;

                case Item.ITEM_TYPE_ZIDAN: //子弹
                this.gainBullet(1);
                break;

                default:
                    alert("错误物品!");
                break;
            }

            this.removeChild(element);
            console.log("删除碰撞物体");
        }
    }

}
