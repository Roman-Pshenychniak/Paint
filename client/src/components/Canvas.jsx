import React, { useEffect, useRef, useState } from 'react';
import "../styles/canvas.scss";
import { observer } from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import { Button, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Rect from "../tools/Rect";
import axios from "axios";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";

const Canvas = observer(() => {
    const canvasRef = useRef(); // посилання на канвас
    const usernameRef = useRef(); // посилання на поле введення, за допомогою хука юзреф
    const [modal, setModal] = useState(true); // створюємо стан, для видимості модального вікна
    const params = useParams();
    const [isCreated, setIsCreated] = useState(false); // Додаємо стан для контролю
    const [isSaving, setIsSaving] = useState(false);

    // При першому запуску програми
    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");
        canvasState.setCanvas(canvasRef.current);

        // Виконуємо GET-запит для перевірки, чи є зображення на сервері
        axios.get(`http://localhost:8000/image?id=${params.id}`)
            .then(res => {
                const img = new Image();
                img.src = res.data;

                // Встановлюємо подію завантаження зображення
                img.onload = () => {
                    // Малюємо зображення тільки після того, як воно завантажено
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                    setIsCreated(true); // Встановлюємо стан після успішного завантаження
                };
            })
            .catch(err => {
                console.log(err);
                saveImageToBackend();
                setIsCreated(true); // У випадку помилки також вважаємо, що зображення не створено
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCreated]);

    // Після того, як юзер ввів нікнейм, нам потрібно створити підключення по вебсокет протоколу
    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket('ws://localhost:8000');
            canvasState.setSocket(socket);
            canvasState.setSessionId(params.id);
            toolState.setTool(new Brush(canvasRef.current, socket, params.id)); // як інструмент присваюємо пензлик
            socket.onopen = () => {
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: 'connection',
                }))
            }
            socket.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                // eslint-disable-next-line default-case
                switch (msg.method) {
                    case "connection":
                        console.log(`User ${msg.username} connection`);
                        break;
                    case "draw":
                        drawHandler(msg);
                        break;
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasState.username]);


    const saveImageToBackend = () => {
        // Створюємо зображення тільки якщо воно ще не створене
        const dataUrl = canvasRef.current.toDataURL('image/png');
        const imgBase64 = dataUrl.replace('data:image/png;base64,', '');

        axios.post('http://localhost:8000/image', { img: imgBase64 }, { params: { id: params.id } })
            .then(res => {
                console.log("Image saved successfully!");
                setIsCreated(true); // Після збереження встановлюємо, що зображення створено
            })
            .catch(err => {
                console.error(err);
            });
    };

    const drawHandler = (msg) => {
        const figure = msg.figure;
        const ctx = canvasRef.current.getContext("2d");
        // eslint-disable-next-line default-case
        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y, figure.color, figure.stroke, figure.lineWidth);
                break;
            case "rect":
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color, figure.stroke, figure.lineWidth);
                break;
            case "circle":
                Circle.staticDraw(ctx, figure.x, figure.y, figure.r, figure.color, figure.stroke, figure.lineWidth);
                break;
            case "eraser":
                Eraser.draw(ctx, figure.x, figure.y, figure.lineWidth);
                break;
            case "line":
                Line.staticDraw(ctx, figure.x, figure.y, figure.x_end, figure.y_end, figure.color, figure.stroke, figure.lineWidth);
                break;
            case "finish":
                ctx.beginPath();
                break;
        }
    }

    // після того як користувач почав малювати якусь фігуру і закінчив, нам стан канвасу потрібно відправляти на сервер
    const mouseDownHandler = () => {
        // Не дозволяємо робити нові запити, поки попередній не завершився
        if (isSaving) return;

        // Зберігаємо попередній стан в історію
        canvasState.pushToUndo(canvasRef.current.toDataURL());

        // Починаємо процес збереження
        setIsSaving(true);  // Вказуємо, що почався процес збереження

        axios.post(`http://localhost:8000/image?id=${params.id}`, { img: canvasRef.current.toDataURL() })
            .then(res => {
                console.log(res.data); // Виводимо повідомлення про успіх
            })
            .catch(err => {
                console.error(err); // Обробляємо помилку
            })
            .finally(() => {
                setIsSaving(false); // Вказуємо, що процес збереження завершився
            });
    }

    // Функція яка в стан встановлює юзернейм та закриває модальне вікно, ми її викликаємо при нажиманні на кнопку у модальному вікні
    const connectionHandler = () => {
        canvasState.setUsername(usernameRef.current.value);
        setModal(false);
    }

    return (
        // Взяли модальне вікно в bootstrap для введення нікнейму
        <div className="canvas">
            <Modal show={modal} onHide={() => {
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter your name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" ref={usernameRef} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => connectionHandler()}>
                        Join
                    </Button>
                </Modal.Footer>
            </Modal>
            <canvas onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={600} height={400} />
        </div>
    );
})
    ;

export default Canvas;