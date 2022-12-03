class FireBall extends AcGameObject {
    constructor(playground,player,x,y,radius,vx,vy,color,speed,move_length,damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.1;
    }

    start() {
    }

    update() {
        if(this.move_length < this.eps) {
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length,this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;

        for(let i = 0;i < this.playground.players.length;i ++ ) {
            let player = this.playground.players[i];
            if(this.player != player && this.is_collision(player)) {
                this.attach(player);
            }
        }

        for(let i = 0;i < this.playground.fireballs.length;i ++ ) {
            let fireball = this.playground.fireballs[i];
            if(this != fireball && this.is_collision(fireball)) {
                this.is_attached();
                fireball.is_attached();
            }
        }
        this.render();
    }

    get_dist(x1,y1,x2,y2) {
        let tx = x1 - x2;
        let ty = y1 - y2;
        return Math.sqrt(tx * tx + ty * ty);
    }

    is_collision(obj) {
        let distance = this.get_dist(this.x,this.y,obj.x,obj.y);
        if(distance < this.radius + obj.radius)
            return true;
        return false;
    }

    attach(player) {
        let angle = Math.atan2(player.y - this.y,player.x - this.x);
        player.is_attached(angle,this.damage);
        this.destroy();
    }

    is_attached() {
        for(let i = 0;i < 10 * Math.random() * 5;i ++ ) {
            let x = this.x,y = this.y;
            let radius = this.radius * Math.random() * 0.2;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle);
            let vy = Math.sin(angle);
            let speed = this.speed * 5;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground,x,y,radius,vx,vy,"orange",speed,move_length);
        }

        this.destroy();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2,false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destroy() {
        for(let i = 0;i < this.playground.fireballs.length;i ++ ) {
            if(this == this.playground.fireballs[i]) {
                this.playground.fireballs.splice(i,1);
            }
        }
    }
}
