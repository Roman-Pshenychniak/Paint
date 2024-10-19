import Tool from "./Tool";

export default class Brush extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen();
    }

    listen() {
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    }

    mouseUpHandler(e) {
        this.mouseDown = false;
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'finish'
            }
        }))
    }

    mouseDownHandler(e) {
        this.mouseDown = true;
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop); // переміщуємо курсор, отримуємо координати на канвасі
        // Вираховує позицію миші по осі X, віднімаючи від неї відстань від краю сторінки до початку канваса.
        // Аналогічно для осі Y — обчислює вертикальну позицію миші на канвасі.
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            //this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
            // отримуємо координати курсора мишки

            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'brush',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    color: this.ctx.fillStyle,
                    stroke: this.ctx.strokeStyle,
                    lineWidth: this.ctx.lineWidth,
                }
            }))
        }
    }

    static draw(ctx, x, y, color, stroke, lineWidth) {
        ctx.fillStyle = color;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.lineTo(x, y);
        ctx.stroke();
    }

}

// цей клас наслідується від тула, тобто розширяє його
// як стається малювання, користувач нажимає на мишку
// і поки вона нажата ми можемо водити у всі 4 сторони і лінії будуть малюватись
// тому зробимо 3 обробника подій, коли зажали мишку, коли відпустили і коли рухають нею