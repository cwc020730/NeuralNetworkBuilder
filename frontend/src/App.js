import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./App.css";
import { AppProvider } from './components/AppContext';
import D3Canvas from "./components/D3Canvas";
import UnitInventory from './components/UnitInventory';
import InventoryController from "./components/InventoryController";
import SelectedUnitDescription from "./components/SelectedUnitDescription";
import ParamControls from "./components/ParamControls";
import IOInfo from "./components/IOInfo";
import Header from "./components/Header";
import MainBottomAreaControlBar from "./components/MainBottomAreaControlBar";
import MainBottomArea from "./components/MainBottomArea";
import ErrorModal from "./components/ErrorModal";


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
                <header className="header">
                    <Header />
                </header>
                <aside className="sidebar">
                    <InventoryController />
                </aside>
                <main className="main">
                    <div className="canvas">
                        <D3Canvas />
                    </div>
                    <MainBottomArea />
                </main>
                <footer className="footer">Footer</footer>
                <ErrorModal message="This is an error message" />
            </div>
        </AppProvider>
    );
}

export default App;
