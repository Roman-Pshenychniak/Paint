import { makeAutoObservable } from "mobx";

class CanvasState {
    canvas = null;
    socket = null;
    sessionId = null;
    undoList = []; // масив всіх дій
    redoList = []; // масив дій які відмінили
    username = ""; // нікнейм


    constructor() {
        makeAutoObservable(this);
    }

    setSessionId(id) {
        this.sessionId = id;
    }

    setSocket(socket) {
        this.socket = socket;
    }

    setUsername(username) {
        this.username = username;
    }

    //this function has name action cuz this function change state
    setCanvas(canvas) {
        this.canvas = canvas;
    }

    pushToUndo(data) {
        this.undoList.push(data);
    }

    pushToRedo(data) {
        this.redoList.push(data);
    }

    undo() {
        let ctx = this.canvas.getContext('2d');
        if (this.undoList.length > 0) {
            let dataUrl = this.undoList.pop();
            this.redoList.push(this.canvas.toDataURL());
            let img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            }
        }
        else {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    redo() {
        let ctx = this.canvas.getContext('2d');
        if (this.redoList.length > 0) {
            let dataUrl = this.redoList.pop();
            this.undoList.push(this.canvas.toDataURL());
            let img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            }
        }
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new CanvasState();