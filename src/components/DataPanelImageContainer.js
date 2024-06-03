import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "./AppContext";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const DataPanelImageContainer = () => {
    const { selectedUnitId, selectedDataName } = useContext(AppContext);
    const [imageDataMap, setImageDataMap] = useState(new Map());
    const imageDataMapRef = useRef(imageDataMap);

    useEffect(() => {
        socket.on("image_updated", (data) => {
            console.log("image_updated", data);
            const key = `${data.unit_id}/${data.data_name}`;
            const newImageDataMap = new Map(imageDataMapRef.current);
            newImageDataMap.set(key, `data:image/png;base64,${data.image_data}`);
            imageDataMapRef.current = newImageDataMap;
            setImageDataMap(newImageDataMap);
        });

        return () => {
            socket.off("image_updated");
        };
    }, []);

    const key = `${selectedUnitId}/${selectedDataName}`;
    const imageData = imageDataMap.get(key);

    return (
        <div className="data-panel-image-container">
            {imageData ? (
                <img src={imageData} alt={`${selectedUnitId} ${selectedDataName}`} />
            ) : (
                <></>
            )}
        </div>
    );
}

export default DataPanelImageContainer;
