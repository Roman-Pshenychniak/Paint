import "./styles/app.scss"
import Toolbar from "./components/Toolbar";
import SettingBar from "./components/SettingBar";
import Canvas from "./components/Canvas";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <Routes>
                    <Route path="/:id" element={
                        <>
                            <Toolbar />
                            <SettingBar />
                            <Canvas />
                        </>
                    } />
                    <Route path="*" element={<Navigate to={`f${(+new Date()).toString(16)}`} />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

// Логіка полягає в тому, що аби присвоїти до шляху ідентифікатор, який динамічно присвоюється
// Присвоюється тоді, коли його немає. Тобто якщо користувач за ходить, то він отримує його і зразу перекидує на шлях у якому є цей індетифікатор
// Для того, аби кожне нове підключення мало свій індитифікатор і ми могли мати різних корстувачів одночасно для малювання

export default App;
