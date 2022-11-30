class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
<div class="ac_game_menu">
    <div class="ac_game_menu_field">
        <div class="ac_game_menu_field_item ac_game_menu_field_item_single_mode">
            独自享受
        </div>
        <br>
        <div class="ac_game_menu_field_item ac_game_menu_field_item_multi_mode">
            多人运动
        </div>
        <br>
        <div class="ac_game_menu_field_item ac_game_menu_field_item_setting">
            设置
        </div>
    </div>
</div>
`);
        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find(".ac_game_menu_field_item_single_mode");
        this.$multi_mode = this.$menu.find(".ac_game_menu_field_item_multi_mode");
        this.$setting = this.$menu.find(".ac_game_menu_field_item_setting");

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function(){
            outer.hide();
            outer.root.playground.show();
        });
        this.$multi_mode.click(function(){
            console.log("cleck multi_mode");
        });
        this.$setting.click(function(){
            console.log("cleck setting");
        });
    }

    show() {  // 显示menu菜单界面
        this.$menu.show();
    }

    hide() {  // 关闭menu菜单界面
        this.$menu.hide();
    }
}
let AC_GAME_OBJECT = [];

class AcGameObject {

    constructor() {
        AC_GAME_OBJECT.push(this);

        this.hash_called_start = false;  // 是否执行过start函数
        this.timedelta = 0;  // 当前帧距离上一帧的时间间隔
    }

    start() {  // 只会在第一次执行一次
    }

    update() {  // 每一帧均会执行一次
    }

    on_destory() {  // 在销毁前执行一次
    }

    destory() {  // 删掉该物体
        this.on_destory();

        for(let i = 0;i < AC_GAME_OBJECT.length;i ++ ) {
            if(AC_GAME_OBJECT[i] = this) {
                AC_GAME_OBJECT.splice(i,1);
                break;
            }
        }
    }
}

let last_timestamp;
let AC_GAME_ANIMATION = function(timestamp) {
    for(let i = 0;i < AC_GAME_OBJECT.length;i ++ ) {
        let obj = AC_GAME_OBJECT[i];

        if(obj.hash_called_start == false) {
            obj.start();
            obj.hahs_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;

    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION);
class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start() {
    }

    update() {
        console.log("run update");
        this.render();
    }

    render() {
        console.log("run render");
        this.ctx.fillStyle = "rgba(0,0,0)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }
}
class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="ac_game_playground"></div>`);

        // this.hide();
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);

        this.start();
    }

    start() {
    }

    show() {  // 打开playground界面
        this.$playground.show();
    }

    hide() {  // 关闭playground界面
        this.$playground.hide();
    }
}
export class AcGame {
    constructor(id) {
        this.id = id;
        this.$ac_game = $('#' + id);
        // this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);

        this.start();
    }

    start() {
    }
}
