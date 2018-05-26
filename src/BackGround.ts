
class BackGround extends Sprite
{
    /**
     * 背景类
     */

    private bg1: any;
    private bg2: any;
    private cat: any;
    private tree: any;

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

    public constructor() 
    {
        super();

        this.init();
    }

    private init(): void
    {
        Laya.SoundManager.musicVolume = this.BG_MUSIC_VOLUME;
        Laya.SoundManager.playMusic("res/wav/BG.wav",0);

        //创建背景1
        this.bg1 = new Sprite().loadImage("res/BackGround.png");
        this.addChild(this.bg1);

        //创建背景2
        this.bg2 = new Sprite().loadImage("res/BackGround.png");
        this.addChild(this.bg2);
        this.bg2.pos(0, this.BG_HEIGHT);

        //前景图片树木
        this.tree = new Sprite().loadImage("res/tree0.png");
        this.addChild(this.tree);
        this.tree.pos(64, this.BG_HEIGHT);

        //绘制猫
        this.cat = new Sprite().loadImage("res/m_background.png");
        this.addChild(this.cat);

        //创建一个帧循环处理函数，用于背景位置的更新，实现背景滚动效果。
        Laya.timer.frameLoop(this.BG_FRAME_DELAY, this, this.onLoop)
    }

    private onLoop(): void
    {
        if(this.IS_PAUSE || this.IS_OVER){return;}

        //移动
        this.y -= this.BG_SPEED;

        //当背景1向左移动出游戏的显示区域，则将背景1的x轴坐标,向右移动*2.
        if (this.bg1.y + this.y <= -this.BG_HEIGHT) {
            this.bg1.y += this.BG_HEIGHT * 2;
        }
        //当背景2向左移动出游戏的显示区域，则将背景2的x轴坐标,向右移动*2.
        if (this.bg2.y + this.y <= -this.BG_HEIGHT) {
            this.bg2.y += this.BG_HEIGHT * 2;
        }
        //树木移动
        if (this.tree.y + this.y <= -this.BG_HEIGHT) {
            this.tree.y += this.BG_HEIGHT * 2;
        }
        //cat移动
        if (this.cat.y + this.y <= -this.BG_HEIGHT) {
            this.cat.y += this.BG_HEIGHT * 2;
        }
    }


}