export default class Tool {
    constructor(canvas, socket, id) {
        this.canvas = canvas;
        this.socket = socket;
        this.id = id;
        this.ctx = canvas.getContext('2d'); //
        this.destroyEvents();
    }

    // Створюємо сетери для тулу в загальному, аби не реалізовувати у кожному дочірньому класі окремо
    set fillColor(color) {
        this.ctx.fillStyle = color; // заповнення кольору фігури
    }

    set strokeColor(color) {
        this.ctx.strokeStyle = color; // вставлення кольору контуру
    }

    set lineWidth(lineWidth) {
        this.ctx.lineWidth = lineWidth; // встановлення товщини ліній
    }

    destroyEvents() {
        this.canvas.onmouseup = null;
        this.canvas.onmousedown = null;
        this.canvas.onmousemove = null;
    }
    // робимо для того, коли ми поміняємо тулс, то обробники подій залишуться на канвасі
    // а ми захочемо робити щось інше , наприклад зробити квадрат
    // а там буде логіка попереднього, тому треба видаляти при зміні тулсів
}

// клас який буде батьківським для всіх тулів,
// де ми зберігаємо посилання на канвас і обєкт контекст
// який дозволяє малювати лінії, залишати фігури, у нашому випадку ми беремо 2д