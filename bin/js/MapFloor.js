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
var MapFloor = /** @class */ (function (_super) {
    __extends(MapFloor, _super);
    function MapFloor() {
        var _this = _super.call(this) || this;
        _this.dieFloorList = [];
        _this.init();
        return _this;
    }
    MapFloor.prototype.init = function () {
        var floor = this.addFloor();
        floor.x = 0;
        Laya.timer.frameLoop(MAP_FLOOR_FRAME_DELAY, this, this.onLoop);
    };
    MapFloor.prototype.onLoop = function () {
        while (this.dieFloorList.lenght > 0) {
            var floor = this.dieFloorList.shift();
            floor.removeSelf();
            Pool.recover("floor", floor);
        }
    };
    MapFloor.prototype.addFloor = function () {
        var floor = new Floor();
        floor.init();
        floor.once(Floor.OUT_COMPLETE, this, this.getFloor);
        floor.once(Floor.OUT_DIE, this, this.delFloor);
        this.addChild(floor);
        return floor;
    };
    MapFloor.prototype.getFloor = function () {
        this.addFloor();
    };
    MapFloor.prototype.delFloor = function (floor) {
        this.dieFloorList.push(floor);
    };
    return MapFloor;
}(Laya.Sprite));
//# sourceMappingURL=MapFloor.js.map