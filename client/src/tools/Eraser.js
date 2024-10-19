import Brush from "./Brush";

export default class Eraser extends Brush {
    // eslint-disable-next-line no-useless-constructor
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'eraser',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    lineWidth: this.ctx.lineWidth,
                }
            }))
        }
    }

    static draw(ctx, x, y, lineWidth) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = "white";
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

// цей клас наслідується від браш, але відмінність лише в білому кольорі, який тут завжди