import {makeAutoObservable} from "mobx";

class ToolState {
    tool = null;
    constructor() {
        makeAutoObservable(this);
    }

    //this function has name action cuz this function change state
    setTool(tool) {
        this.tool = tool;
    }

    // Створюємо actions де ми будемо задавати ці значення
    setFillColor(color) {
        this.tool.fillColor = color;
    }

    setStrokeColor(color) {
        this.tool.strokeColor = color;
    }

    setLineWidth(lineWidth) {
        this.tool.lineWidth = lineWidth;
    }
    // Тобто це потрібно, щоб не міняти колір у самого object Tool,а міняти колір в контекста , тому що цю логіку ми зробили всередині сетера
}

export default new ToolState();

// цей клас описує стан, де ми працюємо з інструментом