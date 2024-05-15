import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./App.css";
import { AppProvider } from './components/AppContext';
import D3Canvas from "./components/D3Canvas";
import UnitInventory from './components/UnitInventory';
import InventoryController from "./components/InventoryController";
import SelectedUnitDescription from "./components/SelectedUnitDescription";


function App() {

    // const [scale, setScale] = useState(1);
    // const [selectedUnitId, setSelectedUnitId] = useState(null);

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
        <AppProvider>
            <div className="app">
                <header className="header">Header</header>
                <aside className="sidebar">
                    <InventoryController />
                </aside>
                <main className="main">
                    <div className="canvas">
                        <D3Canvas />
                    </div>
                    <div className="unit-param-info-area">
                        <SelectedUnitDescription />
                        <div className="io-info"></div>
                        <div className="param-controls"></div>
                        <div className="action-buttons"></div>
                    </div>
                </main>
                <footer className="footer">Footer</footer>
            </div>
        </AppProvider>
    );
}

export default App;
