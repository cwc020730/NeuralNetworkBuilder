// Header.js
import React from 'react';
import styled from 'styled-components';

const Header = () => {
  return (
    <div className='header-container'>
        <div className='logo'></div>
        <div className='button-container'>
            <button className='header-button'>File</button>
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