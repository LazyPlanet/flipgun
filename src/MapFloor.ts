class MapFloor extends Laya.Sprite
{
    private dieFloorList: any;

    public constructor()
     {
        super();

        this.dieFloorList = [];

        this.init();
    }

    private init(): void
    {
        var floor = this.addFloor();
        floor.x = 0;

        Laya.timer.frameLoop(MAP_FLOOR_FRAME_DELAY, this, this.onLoop);
    }

    private onLoop(): void
    {
        while (this.dieFloorList.lenght > 0) 
        {
            var floor = this.dieFloorList.shift();
            floor.removeSelf();

            Pool.recover("floor",floor)

        }
    }

    private addFloor(): Floor
    {
        var floor = new Floor();

        floor.init();

        floor.once(Floor.OUT_COMPLETE, this, this.getFloor);
        floor.once(Floor.OUT_DIE, this, this.delFloor);
        this.addChild(floor);

        return floor;
    }

    private getFloor(): void
    {
        this.addFloor();
    }

    private delFloor(floor): void
    {
        this.dieFloorList.push(floor);
    }

}