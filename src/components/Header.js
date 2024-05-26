import React, { useState } from 'react';
import { generateJSONCanvasRepresentation, removeAllObjectsOnCanvas, loadJSONCanvasRepresentation } from './D3Canvas';

const Header = () => {
    const [isListVisible, setIsListVisible] = useState(false);

    const handleFileButtonClick = () => {
        setIsListVisible(!isListVisible);
    };

    const handleFileNewButtonClick = () => {
        setIsListVisible(false);
        removeAllObjectsOnCanvas();
    };

    const handleFileExportButtonClick = async () => {
        setIsListVisible(false);
        try {
            const JSONExport = generateJSONCanvasRepresentation();
            const JSONString = JSON.stringify(JSONExport, null, 4);
            const blob = new Blob([JSONString], { type: 'application/json' });
            
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: 'canvas.json',
                types: [{
                    description: 'JSON file',
                    accept: { 'application/json': ['.json'] },
                }],
            });
            
            const writableStream = await fileHandle.createWritable();
            await writableStream.write(blob);
            await writableStream.close();
            console.log('File saved successfully.');
        } catch (error) {
            console.error('Error saving file:', error);
        }
    };

    const handleFileImportButtonClick = async () => {
        setIsListVisible(false);
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: 'JSON file',
                    accept: { 'application/json': ['.json'] },
                }],
            });
    
            const file = await fileHandle.getFile();
            const fileContents = await file.text();
            const JSONImport = JSON.parse(fileContents);
            console.log('Imported JSON:', JSONImport);
            loadJSONCanvasRepresentation(JSONImport);
        } catch (error) {
            console.error('Error importing file:', error);
        }
    };

    const handleRunButtonClick = async () => {
        try {
            const JSONExport = generateJSONCanvasRepresentation();
            const response = await fetch('http://localhost:5000/receive_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(JSONExport),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            console.log('Response from backend:', result);
        } catch (error) {
            console.error('Error sending data to backend:', error);
        }
    };

    return (
        <div className='header-container'>
            <div className='logo'></div>
            <div className='button-container'>
                <div className='header-dropdown-container'>
                    <button className='header-button' onClick={handleFileButtonClick}>
                        File
                    </button>
                    {isListVisible && (
                        <div className='header-dropdown-menu'>
                            <button className='dropdown-button' onClick={handleFileNewButtonClick}>New</button>
                            <button className='dropdown-button' onClick={handleFileImportButtonClick}>Import</button>
                            <button className='dropdown-button' onClick={handleFileExportButtonClick}>Export</button>
                        </div>
                    )}
                </div>
                <button className='header-button'>Edit</button>
                <button className='header-button'>Help</button>
            </div>
            <div className='header-blank-reserve'></div>
            <div className='header-action-buttons'>
            <button className='header-button' onClick={handleRunButtonClick}>Run</button>
            </div>
        </div>
    );
};

export default Header;