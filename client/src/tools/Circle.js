import Tool from "./Tool";

export default class Circle extends Tool {
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
                type: 'circle',
                x: this.startX,
                y: this.startY,
                r: this.radius,
                color: this.ctx.fillStyle,
                stroke: this.ctx.strokeStyle,
                lineWidth: this.ctx.lineWidth,
            }
        }))
    }

    mouseDownHandler(e) {
        this.mouseDown = true;
        this.startX = e.pageX - e.target.offsetLeft; // Вираховує позицію миші по осі X, віднімаючи від неї відстань від краю сторінки до початку канваса.
        this.startY = e.pageY - e.target.offsetTop; // Аналогічно для осі Y — обчислює вертикальну позицію миші на канвасі.
        this.saved = this.canvas.toDataURL(); // Зберігаємо зображення з канвасу
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            let currentX = e.pageX - e.target.offsetLeft;
            this.radius = currentX - this.startX;
            this.draw(this.startX, this.startY, this.radius);
        }
    }

    draw(x, y, r) {
        const img = new Image();
        img.src = this.saved;
        // Спрацьовує тоді коли зображення встановлено, асинхронна функція
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Очищаємо канвас від тих фігур які ми намалювали, щоб бачити лише поточний обєкт
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height); // Через те що ми очищаємо весь канвас, нам потрібно повернути старі малюнки,тому ми зберіг img
            this.ctx.beginPath(); // говорить про те що ми почали малювати нову лінію
            this.ctx.arc(x, y, r, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();
        }
    }

    static staticDraw(ctx, x, y, r, color, stroke, lineWidth) {
        ctx.strokeStyle = stroke;
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}

// у цьому класі ми робимо майже те саме, що і в класі прямокутник, тільки малюємо коло
// не обчислюємо ширину і висоту, а обчислюємо радіус, як ширину між початковою та поточкою точкою, а коло беремо від 0 до 2Pi
