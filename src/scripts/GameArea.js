import AppConfig from "./App.Config.js"

class GameArea {
    constructor(parent) {
        this.generateHTML(parent);
        this.init();
    }

    generateHTML(parent) {
        let classDiv = document.createElement("div");
        classDiv.className = "game-area";

        let button = document.createElement("button");
        button.setAttribute("id", "click_btn");
        button.textContent = "Click me";

        this.clickBtn = button;

        classDiv.appendChild(button);

        parent.appendChild(classDiv);
    }

    init() {
        this.INTERESTED_EVENTS = [
            AppConfig.EVENTS.ON_PAUSE,
            AppConfig.EVENTS.ON_PLAY,
            AppConfig.EVENTS.GAME_OVER
        ];
        this.clickBtn.disabled = true;

        this.clickBtn.addEventListener("click", () => this.handleOwnEvent(AppConfig.EVENTS.ON_CLICK));

        window.addEventListener("message", (event) => {
            if (this.INTERESTED_EVENTS.includes(event.data.type)) {
                this.handleIncomingEvent(event);
            }
        });
    }

    handleOwnEvent(event) {
        if (event === AppConfig.EVENTS.ON_CLICK) {
            this.clickBtn.style.top = Math.random() * 85 + "%";
            this.clickBtn.style.left = Math.random() * 85 + "%";
            window.postMessage({
                type: AppConfig.EVENTS.ON_CLICK,
                payload: null
            }, "http://localhost:8080");
        }
    }

    handleIncomingEvent(event) {
        console.log(event);
        switch (event.data.type) {
            case AppConfig.EVENTS.ON_PLAY:
                this.clickBtn.disabled = false;
                break;
            case AppConfig.EVENTS.ON_PAUSE:
            case AppConfig.EVENTS.GAME_OVER:
                this.clickBtn.disabled = true;
                break;
            default:
                break;
        }
    }
}

export default GameArea;