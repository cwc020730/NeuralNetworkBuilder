import React from "react";
import "./App.css";

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
                    Components
                </div>
            </aside>
            <main className="main">
                <div className="canvas">
                    <p>Canvas</p>
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
