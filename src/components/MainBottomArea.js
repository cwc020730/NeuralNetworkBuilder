
import { React, useContext } from "react";
import MainBottomAreaControlBar from "./MainBottomAreaControlBar";
import SelectedUnitDescription from "./SelectedUnitDescription";
import IOInfo from "./IOInfo";
import ParamControls from "./ParamControls";
import { AppContext } from "./AppContext";

const MainBottomArea = () => {

    const { activeBottomArea } = useContext(AppContext);

    const unitParamInfoArea = (
        <div className="unit-param-info-area">
                <SelectedUnitDescription />
                <IOInfo />
                <ParamControls />
                <div className="action-buttons"></div>
        </div>
    )

    const runPanel = (
        <div className="run-panel">
            RUN PANEL
        </div>
    );

    return (
        <>
            <MainBottomAreaControlBar />
            {activeBottomArea === 'unit-info' ? unitParamInfoArea : null}
            {activeBottomArea === 'run' ? runPanel : null}
        </>
    );
}

export default MainBottomArea;