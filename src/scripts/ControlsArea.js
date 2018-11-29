import AppConfig from "./App.Config.js";

class ControlsArea {
    constructor(parent) {
        this.generateHTML(parent);
        this.init();
    }

    generateHTML(parent) {
        let mainDiv = document.createElement("div");
        mainDiv.className = "controls";

        this.progressDiv = document.createElement("div");
        this.progressDiv.className = "progress";
        this.progressDiv.id = "progress_content";

        let span = document.createElement("span");
        span.textContent = "0/5 clicked";
        this.progressDiv.appendChild(span);
        mainDiv.appendChild(this.progressDiv);

        let controlsButtons = document.createElement("div");
        controlsButtons.className = "controlls__button-wrapper";
        this.startBtn = document.createElement("button");
        this.startBtn.textContent = "Play ";
        controlsButtons.appendChild(this.startBtn);

        this.pauseBtn = document.createElement("button");
        this.pauseBtn.textContent = "Pause ";
        controlsButtons.appendChild(this.pauseBtn);
        mainDiv.appendChild(controlsButtons);

        this.timer = document.createElement("p");
        this.timer.textContent = "00:10";
        this.timer.className = "controls__timer";
        mainDiv.appendChild(this.timer);

        parent.appendChild(mainDiv);
    }

    init() {
        this.INTERESTED_EVENTS = [
            AppConfig.EVENTS.ON_CLICK,
            AppConfig.EVENTS.GAME_OVER,
            AppConfig.EVENTS.ON_STATE_CHANGE,
            AppConfig.EVENTS.ON_PLAY,
            AppConfig.EVENTS.ON_PAUSE
        ];

        this.pauseBtn.disabled = true;

        this.pauseBtn.addEventListener("click", () => this.handleOwnEvent(AppConfig.EVENTS.ON_PAUSE));
        this.startBtn.addEventListener("click", () => this.handleOwnEvent(AppConfig.EVENTS.ON_PLAY));

        window.addEventListener("message", (event) => {
            if (this.INTERESTED_EVENTS.includes(event.data.type)) {
                this.handleIncomingEvent(event);
            }
        })
    }

    handleOwnEvent(event) {
        switch (event) {
            case AppConfig.EVENTS.ON_PLAY:
                this.startBtn.disabled = true;
                this.pauseBtn.disabled = false;
                window.postMessage({
                    type: AppConfig.EVENTS.ON_PLAY,
                    payload: null
                }, "http://localhost:8080");
                break;
            case AppConfig.EVENTS.ON_PAUSE:
                this.startBtn.disabled = false;
                this.pauseBtn.disabled = true;
                window.postMessage({
                    type: AppConfig.EVENTS.ON_PAUSE,
                    payload: null
                }, "http://localhost:8080");
                break;
            default:
                break;
        }
    }

    handleIncomingEvent(event) {
        console.log(event);
        switch (event.data.type) {
            case AppConfig.EVENTS.ON_CLICK:
                break;
            case AppConfig.EVENTS.GAME_OVER:
                this.pauseBtn.disabled = true;
                this.startBtn.disabled = true;
                break;
            case AppConfig.EVENTS.ON_STATE_CHANGE:
                this.onStateChange(event.data.payload);
                break;
            case AppConfig.EVENTS.ON_PLAY:
                this.startBtn.disabled = true;
                this.pauseBtn.disabled = false;
                break;
            case AppConfig.EVENTS.ON_PAUSE:
                this.startBtn.disabled = false;
                this.pauseBtn.disabled = true;
                break;
            default:
                break;
        }
    }

    onStateChange(data) {
        this.progressDiv.textContent = data.countClicks + "/5 clicked";
        this.progressDiv.style.background = "linear-gradient(to right, var(--green) 0%, var(--green) " + 20 * data.countClicks + "%, #fff " + 20 * data.countClicks + "%, #fff 100%)";
        this.timer.textContent = "00:" + data.timeLeft
    }
}

export default ControlsArea;