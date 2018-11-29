import GameArea from "./GameArea.js";
import ControlsArea from "./ControlsArea.js";
import Game from "./Game.js";

let mainDiv = document.getElementsByTagName("main")[0]

let controlsArea = new ControlsArea(mainDiv);
let controlsArea2 = new ControlsArea(mainDiv);
let gameArea = new GameArea(mainDiv);

let game = new Game();