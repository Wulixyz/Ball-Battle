class ChatField {
    constructor(playground) {
        this.playground = playground;

        this.$history = $(`<div class="ac_game_chat_field_history">历史记录</div>`);
        this.$input = $(`<input type="text" class="ac_game_chat_field_input">`);

        this.$history.hide();
        this.$input.hide();

        this.playground.$playground.append(this.$history);
        this.playground.$playground.append(this.$input);

        this.func_id = null;

        this.start();
    }

    start() {
        this.add_listening_event();
    }

    add_listening_event() {
        let outer = this;

        this.$input.keydown(function(e) {
            if(e.which === 27) {
                outer.hide_input();
                return false;
            } else if(e.which == 13) {
                let username = outer.playground.root.settings.username;
                let text = outer.$input.val();
                if(text) {
                    outer.$input.val("");
                    outer.add_message(username,text);
                    outer.playground.mps.send_message(text);
                }
                return false;
            }
        });
    }

    render_message(message) {
        return $(`<div>${message}</div>`);
    }

    add_message(username,text) {
        this.show_history();
        let message = `[${username}]${text}`;
        this.$history.append(this.render_message(message));
        this.$history.scrollTop(this.$history[0].scrollHeight);
    }

    show_history() {
        let outer = this;

        this.$history.fadeIn();

        if(this.func_id) clearTimeout(this.func_id);
        this.func_id = setTimeout(function(e) {
            outer.$history.fadeOut();
            outer.func_id = null;
        },3000);
    }

    show_input() {
        this.show_history();
        this.$input.show();
        this.$input.focus();
    }

    hide_input() {
        this.$input.hide();
        this.playground.game_map.$canvas.focus();
    }
}
