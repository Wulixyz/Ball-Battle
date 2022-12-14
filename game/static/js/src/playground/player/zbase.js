class Player extends AcGameObject {
    constructor (playground,x,y,radius,color,speed,character,username,photo) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.character = character;
        this.username = username;
        this.photo = photo;
        this.eps = 0.01;
        this.friction = 0.9;
        this.spent_time = 0;

        this.cur_skill = null;

        if(this.character !== "robot") {
            this.img = new Image();
            this.img.src = this.photo;
        }
    }

    start() {
        if(this.character === "me") {
            this.add_listening_events();
        } else {
            this.move_to_random();
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu",function() {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e) {
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if(e.which === 3) {
                outer.move_to((e.clientX - rect.left) / outer.playground.scale,(e.clientY - rect.top) / outer.playground.scale);
            } else if(e.which === 1) {
                if(outer.cur_skill === "fireball") outer.shout_fireball((e.clientX - rect.left) / outer.playground.scale,(e.clientY - rect.top) / outer.playground.scale);

                outer.cur_skill = null;
            }
        });

        $(window).keydown(function(e) {
            if(e.which == 81) {  // 键入q
                outer.cur_skill = "fireball";
                return false;
            }
        });
    }

    shout_fireball(tx,ty) {
        let x = this.x,y = this.y;
        let radius = 0.01;
        let angle = Math.atan2(ty - y,tx - x);
        let vx = Math.cos(angle),vy = Math.sin(angle);
        let color = "orange";
        let speed = 0.5;
        let move_length = 1.0;
        this.playground.fireballs.push(new FireBall(this.playground,this,x,y,radius,vx,vy,color,speed,move_length,0.01));
    }

    get_dist(x1,x2,y1,y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx,ty) {
        this.move_length = this.get_dist(this.x,tx,this.y,ty);
        let angle = Math.atan2(ty - this.y,tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    move_to_random() {
        let tx = Math.random() * this.playground.width / this.playground.scale;
        let ty = Math.random() * this.playground.height / this.playground.scale;
        this.move_to(tx,ty);
    }

    is_attached(angle,damage) {
        for(let i = 0;i < 20 * Math.random() * 10;i ++ ) {
            let x = this.x,y = this.y;
            let radius = this.radius * Math.random() * 0.2;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle);
            let vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 10;
            new Particle(this.playground,x,y,radius,vx,vy,color,speed,move_length);
        }

        this.radius -= damage;
        if(this.radius < this.eps) {
            this.destroy();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100;
        this.speed *= 1.25;
    }

    update() {
        this.update_move();
        this.render();
    }

    update_move() {
        this.spent_time += this.timedelta / 1000;
        if(this.character === "robot" && Math.random() < 1 / 180.0 && this.spent_time > 3) {
            let player = this.playground.players[0];
            let dx = player.x + player.vx * player.speed * this.timedelta / 1000 * 0.3;
            let dy = player.y + player.vy * player.speed * this.timedelta / 1000 * 0.3;
            this.shout_fireball(dx,dy);
        }

        if(this.damage_speed > this.eps * 50) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        } else {
            if(this.move_length < this.eps) {
                if(this.character === "me") {
                    this.move_length = 0;
                    this.vx = 0;
                    this.vy = 0;
                } else {
                    this.move_to_random();
                }
            } else {
                let moved = Math.min(this.move_length,this.speed * this.timedelta / 1000);
                this.move_length -= moved;
                this.x += this.vx * moved;
                this.y += this.vy * moved;
            }
        }
    }

    render() {
        let scale = this.playground.scale;

        if(this.character !== "robot") {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (this.x - this.radius) * scale, (this.y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale);
            this.ctx.restore();
        } else {
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale,this.y * scale,this.radius * scale,0,Math.PI * 2,false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
    }

    on_destroy() {
        for(let i = 0;i < this.playground.players.length;i ++ ) {
            if(this === this.playground.players[i]) {
                this.playground.players.splice(i,1);
            }
        }
    }
}
