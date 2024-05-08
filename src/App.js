import React from "react";
import "./App.css";
import D3Canvas from "./components/D3Canvas";
import ComponentInventory from './components/ComponentInventory';

function App() {
    return (
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
                    <D3Canvas />
                </div>
                <div className="debug-area">
                    <p>Terminal/Debug Area</p>
                </div>
            </main>
            <footer className="footer">Footer</footer>
        </div>
    );
}

export default App;
