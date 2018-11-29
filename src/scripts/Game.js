import AppConfig from "./App.Config.js";

class Game {
    constructor() {
        this.countClicks = 0;
        this.timeLeft = AppConfig.TOTAL_TIME;
        this.init();
    }

    init() {
        this.INTERESTED_EVENTS = [
            AppConfig.EVENTS.ON_CLICK,
            AppConfig.EVENTS.ON_PAUSE,
            AppConfig.EVENTS.ON_PLAY
        ];

        window.addEventListener("message", (event) => {
            if (this.INTERESTED_EVENTS.includes(event.data.type)) {
                this.handleIncomingEvent(event);
            }
        });
    }

    handleOwnEvent(event) {
        switch (event) {
            case AppConfig.EVENTS.GAME_OVER:
                clearInterval(this.interval);
                clearTimeout(this.timer);
                break;
            default:
                break;
        }
    }

    handleIncomingEvent(event) {
        console.log(event);
        switch (event.data.type) {
            case AppConfig.EVENTS.ON_CLICK:
                this.onClick();
                break;
            case AppConfig.EVENTS.ON_PAUSE:
                clearInterval(this.interval);
                clearTimeout(this.timer);
                break;
            case AppConfig.EVENTS.ON_PLAY:
                this.onPlay();
                break;
            default:
                break;
        }
    }

    onClick() {
        this.countClicks += 1;
        this.broadcastState();
        if (this.countClicks === AppConfig.NR_OF_CLICKS) {
            this.handleOwnEvent(AppConfig.EVENTS.GAME_OVER);
            window.postMessage({
                type: AppConfig.EVENTS.GAME_OVER,
                payload: null
            }, "http://localhost:8080");
            alert("You won");
        }
    }

    onPlay() {
        let myClass = this;
        this.timer = setTimeout(function() {
            myClass.handleOwnEvent(AppConfig.EVENTS.GAME_OVER);
            window.postMessage({
                type: AppConfig.EVENTS.GAME_OVER,
                payload: null
            }, "http://localhost:8080");
            alert("You lost");
        }, this.timeLeft * 1001);

        this.interval = setInterval(function() {
            myClass.timeLeft--;
            myClass.broadcastState();
        }, 1000);
    }

    broadcastState() {
        let countClicks = this.countClicks;
        let timeLeft = this.timeLeft;

        window.postMessage({
            type: AppConfig.EVENTS.ON_STATE_CHANGE,
            payload: {
                countClicks,
                timeLeft
            }
        }, "http://localhost:8080");
    }
}

export default Game;

/* 
        PRIVATE
    clicks
    time left
    setInterval
    handleEvents:
        click -> change clicks + dispatch  + case end game
        play/pause -> stop timer
    */