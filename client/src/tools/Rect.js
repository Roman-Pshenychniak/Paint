import Tool from "./Tool";

export default class Rect extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen();
    }

    listen() {
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    }
    ц
    mouseUpHandler(e) {
        this.mouseDown = false;
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'rect',
                x: this.startX,
                y: this.startY,
                width: this.width,
                height: this.height,
                color: this.ctx.fillStyle,
                lineWidth: this.ctx.lineWidth,
            }
        }))
    }

    mouseDownHandler(e) {
        this.mouseDown = true;
        this.ctx.beginPath(); // говорить про те що ми почали малювати нову лінію
        this.startX = e.pageX - e.target.offsetLeft; // Вираховує позицію миші по осі X, віднімаючи від неї відстань від краю сторінки до початку канваса.
        this.startY = e.pageY - e.target.offsetTop; // Аналогічно для осі Y — обчислює вертикальну позицію миші на канвасі.
        this.saved = this.canvas.toDataURL(); // Зберігаємо зображення з канвасу
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            let currentX = e.pageX - e.target.offsetLeft;
            let currentY = e.pageY - e.target.offsetTop;
            this.width = currentX - this.startX;
            this.height = currentY - this.startY;
            this.draw(this.startX, this.startY, this.width, this.height);
        }
    }

    draw(x, y, w, h) {
        const img = new Image();
        img.src = this.saved
        // Спрацьовує тоді коли зображення встановлено, асинхронна функція
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Очищаємо канвас від тих фігур які ми намалювали, щоб бачити лише поточний обєкт
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height); // Через те що ми очищаємо весь канвас, нам потрібно повернути старі малюнки,тому ми зберіг img
            this.ctx.beginPath(); // говорить про те що ми почали малювати нову лінію
            this.ctx.rect(x, y, w, h);
            this.ctx.fill();
            this.ctx.stroke();
        }
    }

    static staticDraw(ctx, x, y, w, h, color, stroke, lineWidth) {
        ctx.strokeStyle = stroke;
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.rect(x, y, w, h);
        ctx.fill();
        ctx.stroke();
    }
}

// у цьому класі дії приблизно такі самі з нажиманням на кнопки, тільки різниця в муві і обчисленні того, що ми робимо
// спершу коли ми нажимаємо на кнопку отримаємо початкові координати курсора
// потім коли рухаємо рахується координати current ( поточні ) , обчислюємо різницю і це буде висотою та шириною відповідно
// та передаємо їх у функцію draw, де вона приймає x y w h та малює наш прямокутник, заповнює та малює контур, за це відповідає stroke
