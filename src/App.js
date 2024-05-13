import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./App.css";
import { ScaleProvider } from './components/ScaleContext';
import D3Canvas from "./components/D3Canvas";
import UnitInventory from './components/UnitInventory';
import InventoryController from "./components/InventoryController";


function App() {

    const [scale, setScale] = useState(1);

    useEffect(() => {
        axios.get('http://localhost:5000/api/message')
            .then(response => {
                console.log('Message from Flask:', response.data.message);
            })
            .catch(error => {
                console.error('Error fetching message:', error);
            });
    }, []);

    return (
        <ScaleProvider value={scale}>
            <div className="app">
                <header className="header">Header</header>
                <aside className="sidebar">
                    <InventoryController />
                </aside>
                <main className="main">
                    <div className="canvas">
                        <D3Canvas setScale={setScale}/>
                    </div>
                    <div className="debug-area">
                        <p>Terminal/Debug Area</p>
                    </div>
                </main>
                <footer className="footer">Footer</footer>
            </div>
        </ScaleProvider>
    );
}

export default App;
