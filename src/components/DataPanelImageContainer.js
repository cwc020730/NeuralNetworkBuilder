import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "./AppContext";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const DataPanelImageContainer = () => {
    const { selectedUnitId, selectedDataName, imageDataMap, setImageDataMap } = useContext(AppContext);
    const imageDataMapRef = useRef(imageDataMap);
    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const imagesPerPage = 5; // Number of images per page (you can adjust this as needed)

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

    // Function to handle next page
    const nextPage = () => {
        const totalPages = Math.ceil(imageDataMap.size / imagesPerPage);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Function to handle previous page
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="data-panel-image-container">
            {imageDataMap.get(`${selectedUnitId}/${selectedDataName}`) ? (
                <img className="data-panel-image" src={imageDataMap.get(`${selectedUnitId}/${selectedDataName}`)} alt={`${selectedUnitId} ${selectedDataName}`} />
            ) : (
                <></>
            )}
            <div className="data-image-pagination-controls">
                <button className="prev" onClick={prevPage} disabled={currentPage === 1}></button>
                <span className="data-image-page-num">PAGE {currentPage} OF {Math.ceil(imageDataMap.size / imagesPerPage)}</span>
                <button className="next" onClick={nextPage} disabled={currentPage === Math.ceil(imageDataMap.size / imagesPerPage)}></button>
            </div>
        </div>
    );
}

export default DataPanelImageContainer;
