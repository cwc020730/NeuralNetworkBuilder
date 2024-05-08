import React, { useState } from "react";
import "./App.css";
import { ScaleProvider } from './components/ScaleContext';
import D3Canvas from "./components/D3Canvas";
import ComponentInventory from './components/ComponentInventory';


function App() {

    const [scale, setScale] = useState(1);

    return (
        <ScaleProvider value={scale}>
            <div className="app">
                <header className="header">Header</header>
                <aside className="sidebar">
                    <div className="sidebar-menu">
                        <div className="category-menu">
                            Category Menu
                        </div>
                        <div className="search-bar">
                            Search Bar
                        </div>
                    </div>
                    <div className="component-inventory">
                        <ComponentInventory />
                    </div>
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
