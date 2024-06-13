// ErrorModal.js
import { React, useContext } from 'react';
import { AppContext } from './AppContext';
import './ErrorModal.css';

const ErrorModal = () => {

    const { backendError, setBackendError } = useContext(AppContext);

    const onClose = () => {
        setBackendError(null);
    }

    return (
        backendError && (
            <div className="modal-backdrop">
                <div className="modal">
                    <div className="modal-header">
                        <h2>⚠ Error: {backendError["header"]}</h2>
                        <button onClick={onClose} className="close-button">&times;</button>
                    </div>
                    <div className="modal-body">
                        <p>{backendError["error"]}</p>
                    </div>
                </div>
            </div>
        )
    );
};

export default ErrorModal;