class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="ac_game_playground"></div>`);
        this.root.$ac_game.append(this.$playground);

        this.hide();

        this.start();
    }

    get_random_color() {
        let color = ["blue","red","pink","grey","green"];
        return color[Math.floor(Math.random() * color.length)];
    }

    start() {
        let outer = this;
        $(window).resize(function() {
            outer.resize();
        });
    }

    resize() {
        console.log("resize");

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        let unit = Math.min(this.height / 9,this.width / 16);
        this.height = unit * 9;
        this.width = unit * 16;
        this.scale = this.height;

        if(this.game_map) this.game_map.resize();
    }

    show() {  // 打开playground界面
        this.$playground.show();
        this.resize();

        this.width = this.$playground.width();
        this.height = this.$playground.height();

        this.game_map = new GameMap(this);
        this.players = [];
        this.fireballs = [];

        this.players.push(new Player(this,this.width / 2 / this.scale,0.5,0.05,"white",0.15,true));

        for(let i = 0;i < 5;i ++ ) {
            this.players.push(new Player(this,this.width / 2 / this.scale,0.5,0.05,this.get_random_color(),0.15,false));
        }
    }

    hide() {  // 关闭playground界面
        this.$playground.hide();
    }
}
