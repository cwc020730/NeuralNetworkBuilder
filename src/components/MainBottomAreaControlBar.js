
import { React, useState } from "react";

const MainBottomAreaControlBar = () => {

    const [activeButtomArea, setActiveBottomArea] = useState('unit-info');

    function handleControlButtonClick(activeButton) {
        setActiveBottomArea(activeButton);
    }

    return (
        <div className="main-bottom-area-control-bar">
            <div className="main-bottom-area-control-bar-grid-1">
                <div 
                    className = {`main-bottom-area-control-bar-grid-1-button ${activeButtomArea === 'unit-info' ? 'active' : ''}`}
                    onClick={() => handleControlButtonClick('unit-info')}
                >
                    UNIT INFO
                </div>
                <div 
                    className = {`main-bottom-area-control-bar-grid-1-button ${activeButtomArea === 'run' ? 'active' : ''}`}
                    onClick={() => handleControlButtonClick('run')}
                >
                    RUN
                </div>
            </div>
        </div>
      );
}

export default MainBottomAreaControlBar;