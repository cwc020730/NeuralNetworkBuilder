import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "./AppContext";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const DataPanelImageContainer = () => {
    const { selectedUnitId, selectedDataName, imageDataMap, setImageDataMap } = useContext(AppContext);
    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const imagesPerPage = 5; // Number of images per page (you can adjust this as needed)

    const getImageByPage = (page_number) => {
        const image_data_at_page = imageDataMap.get(`${selectedUnitId}/${selectedDataName}`)[page_number - 1];
        const src = `data:image/png;base64,${image_data_at_page}`;
        return src;
    }

    // Function to handle next page
    const nextPage = () => {
        const totalPages = imageDataMap.get(`${selectedUnitId}/${selectedDataName}`).length;
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
                <img className="data-panel-image" src={getImageByPage(currentPage)} alt={`${selectedUnitId} ${selectedDataName}`} />
            ) : (
                <></>
            )}
            {imageDataMap.get(`${selectedUnitId}/${selectedDataName}`) ? (
                <div className="data-image-pagination-controls">
                    <button className="prev" onClick={prevPage} disabled={currentPage === 1}></button>
                    <span className="data-image-page-num">PAGE {currentPage} OF {imageDataMap.get(`${selectedUnitId}/${selectedDataName}`).length}</span>
                    <button className="next" onClick={nextPage} disabled={currentPage === imageDataMap.get(`${selectedUnitId}/${selectedDataName}`).length}></button>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}

export default DataPanelImageContainer;
