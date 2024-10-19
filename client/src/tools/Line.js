import Tool from "./Tool";

export default class Line extends Tool {
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
        if (this.mouseDown) {
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'line',
                    x: this.startX,
                    y: this.startY,
                    x_end: this.endX,
                    y_end: this.endY,
                    color: this.ctx.fillStyle,
                    stroke: this.ctx.strokeStyle,
                    lineWidth: this.ctx.lineWidth,
                }
            }))
        }
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.endX = e.pageX - e.target.offsetLeft;
            this.endY = e.pageY - e.target.offsetTop;
            this.draw(this.startX, this.startY, this.endX, this.endY);
        }
    }

    mouseDownHandler(e) {
        this.mouseDown = true;
        this.ctx.beginPath(); // говорить про те що ми почали малювати нову лінію
        this.startX = e.pageX - e.target.offsetLeft; // Вираховує позицію миші по осі X, віднімаючи від неї відстань від краю сторінки до початку канваса.
        this.startY = e.pageY - e.target.offsetTop; // Аналогічно для осі Y — обчислює вертикальну позицію миші на канвасі.
        this.saved = this.canvas.toDataURL(); // Зберігаємо зображення з канвасу
    }


    draw(startX, startY, endX, endY) {
        const img = new Image();
        img.src = this.saved
        // Спрацьовує тоді коли зображення встановлено, асинхронна функція
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Очищаємо канвас від тих фігур які ми намалювали, щоб бачити лише поточний обєкт
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height); // Через те що ми очищаємо весь канвас, нам потрібно повернути старі малюнки,тому ми зберіг img
            this.ctx.beginPath(); // говорить про те що ми почали малювати нову лінію
            this.ctx.moveTo(startX, startY); // встановлюємо початкову точку
            this.ctx.lineTo(endX, endY); // визначаємо останню точку
            this.ctx.stroke(); // малюємо лінію
        }
    }

    static staticDraw(ctx, startX, startY, endX, endY, color, stroke, lineWidth) {
        ctx.fillStyle = color;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(startX, startY); // встановлюємо початкову точку
        ctx.lineTo(endX, endY); // визначаємо останню точку
        ctx.stroke(); // малюємо лінію
    }
}

// у цьому класі малюємо лінію, обчислюємо початкову координату та кінцеву та викликаємо функцію , яка малює лінію між цими двома точками
// вся інша логіка та сама, що і в інших тулах
