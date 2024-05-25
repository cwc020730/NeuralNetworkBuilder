
import { React, useContext } from "react";
import { AppContext } from "./AppContext";

const MainBottomAreaControlBar = () => {

    const { activeBottomArea, setActiveBottomArea } = useContext(AppContext);

    function handleControlButtonClick(activeButton) {
        setActiveBottomArea(activeButton);
    }

    return (
        <div className="main-bottom-area-control-bar">
            <div className="main-bottom-area-control-bar-grid-1">
                <div 
                    className = {`main-bottom-area-control-bar-grid-1-button ${activeBottomArea === 'unit-info' ? 'active' : ''}`}
                    onClick={() => handleControlButtonClick('unit-info')}
                >
                    UNIT INFO
                </div>
                <div 
                    className = {`main-bottom-area-control-bar-grid-1-button ${activeBottomArea === 'run' ? 'active' : ''}`}
                    onClick={() => handleControlButtonClick('run')}
                >
                    RUN
                </div>
            </div>
        </div>
      );
}

export default MainBottomAreaControlBar;