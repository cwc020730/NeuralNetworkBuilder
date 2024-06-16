import React, { useState, useEffect, useRef, useContext } from 'react';
import { generateJSONCanvasRepresentation, removeAllObjectsOnCanvas, loadJSONCanvasRepresentation } from './D3Canvas';
import { io } from 'socket.io-client';
import { AppContext } from './AppContext';

const Header = () => {
    const [isListVisible, setIsListVisible] = useState(false);
    const [currStatus, setCurrStatus] = useState('idle');
    const { setBackendError, socket } = useContext(AppContext);

    const handleFileButtonClick = () => {
        setIsListVisible(!isListVisible);
    };

    const handleFileNewButtonClick = () => {
        setIsListVisible(false);
        removeAllObjectsOnCanvas();
    };

    const handleFileSaveButtonClick = async () => {
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

    const handleFileOpenButtonClick = async () => {
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

    const handleFileImportButtonClick = async () => {
        setIsListVisible(false);
        if (currStatus === 'idle') {
            try {
                const [fileHandle] = await window.showOpenFilePicker({
                    types: [{
                        description: 'Model state dict file',
                        accept: { 'application/octet-stream': ['.pt', '.pth'] },
                    }],
                });
                const file = await fileHandle.getFile();
                const reader = new FileReader();
                reader.onload = () => {
                    const arrayBuffer = reader.result;
                    const byteArray = new Uint8Array(arrayBuffer);
                    if (socket) {
                        socket.emit('send_state_dict', { file: byteArray });
                    } 
                    else {
                        console.error('Socket is not available');
                        setBackendError({
                            header: 'Import Error',
                            error: 'Socket is not available',
                        });
                    }
                };
                reader.readAsArrayBuffer(file);
            }
            catch (error) {
                console.error('Error importing file:', error);
                setBackendError({
                    header: 'Import Error',
                    error: 'Error importing file: ' + error
                });
            }
        }
        else {
            setBackendError({
                header: 'Import Error',
                error: 'Cannot import while the model is running.'
            });
        }
    }

    const handleFileExportButtonClick = async () => {
        if (currStatus === 'idle') {
            try {
                const response = await fetch('http://localhost:5000/download_model');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'model.pth';
                document.body.appendChild(a);
                a.click();
                a.remove();
            } catch (error) {
                console.error('Error exporting model:', error);
                setBackendError({
                    header: 'Export Error',
                    error: 'Error exporting model: ' + error
                });
            }
        }
        else {
            setBackendError({
                header: 'Export Error',
                error: 'Cannot export while the model is running.'
            });
        }
      };

    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('header_status_updated', (message) => {
            console.log('header_status_updated', message.status)
            setCurrStatus(message.status);
        });

        return () => {
            socket.off('header_status_updated');
        };
    }, []);

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
                            <button className='dropdown-button' onClick={handleFileOpenButtonClick}>Open</button>
                            <button className='dropdown-button' onClick={handleFileSaveButtonClick}>Save</button>
                            <button className='dropdown-button' onClick={handleFileImportButtonClick}>Import</button>
                            <button className='dropdown-button' onClick={handleFileExportButtonClick}>Export</button>
                        </div>
                    )}
                </div>
                <button className='header-button'>Edit</button>
                <button className='header-button'>Help</button>
            </div>
            <div className='header-status'>
                {currStatus}
            </div>
            <div className='header-action-buttons'>
                <button className='header-button' onClick={handleRunButtonClick}>Run</button>
            </div>
        </div>
    );
};

export default Header;