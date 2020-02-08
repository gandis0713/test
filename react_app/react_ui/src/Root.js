import React from 'react';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import App from './App';

function Root() {
    return (
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    );
}

export default Root;