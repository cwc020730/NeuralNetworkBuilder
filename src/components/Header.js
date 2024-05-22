import React, { useState } from 'react';

const Header = () => {
    const [isListVisible, setIsListVisible] = useState(false);

    const handleFileButtonClick = () => {
        setIsListVisible(!isListVisible);
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
                            <button className='dropdown-button'>New</button>
                            <button className='dropdown-button'>Open</button>
                            <button className='dropdown-button'>Save</button>
                            <button className='dropdown-button'>Import</button>
                            <button className='dropdown-button'>Export</button>
                        </div>
                    )}
                </div>
                <button className='header-button'>Edit</button>
                <button className='header-button'>Help</button>
            </div>
            <div className='header-blank-reserve'></div>
            <div className='header-action-buttons'>
                <button className='header-button'>Export</button>
                <button className='header-button'>Run</button>
            </div>
        </div>
    );
};

export default Header;