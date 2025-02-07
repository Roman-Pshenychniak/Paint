import React from 'react';
import '../styles/toolbar.scss'
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import canvasState from "../store/canvasState";
import Rect from "../tools/Rect";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";

const Toolbar = () => {

    const changeColor = e => {
        toolState.setStrokeColor(e.target.value);
        toolState.setFillColor(e.target.value);
    }

    const download = () => {
        const dataUrl = canvasState.canvas.toDataURL();
        console.log(dataUrl)
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = canvasState.sessionId + '.jpg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    return (
        <div className="toolbar">
            {/*теж потрібно зробити вибір інструмента при нажимання на кнопку*/}
            <button className="toolbar__btn brush" onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
            <button className="toolbar__btn rect" onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
            <button className="toolbar__btn circle" onClick={() => toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
            <button className="toolbar__btn eraser" onClick={() => toolState.setTool(new Eraser(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
            <button className="toolbar__btn line" onClick={() => toolState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
            <input onChange={e => changeColor(e)} type="color" style={{marginLeft: 10}}/>
            <button className="toolbar__btn undo" onClick={() => canvasState.undo()}/>
            <button className="toolbar__btn redo" onClick={() => canvasState.redo()}/>
            <button className="toolbar__btn save" onClick={() => download()}/>
        </div>
    );
};

export default Toolbar;