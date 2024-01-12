import React, { useState } from 'react';
import Login from './Login.js';
import Register from './Register.js';
import Main from './Main.js';

const App = () => {
    const [showLogin, setShowLogin] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const toggleForm = () => {
        setShowLogin((prevShowLogin) => !prevShowLogin);
    };

    return (
        <div>
            {isLoggedIn ? (
                <Main />
            ) : (
                <>
                    {showLogin ? (
                        <Login onLoginSuccess={handleLoginSuccess} toggleForm={toggleForm} />
                    ) : (
                        <Register toggleForm={toggleForm} />
                    )}
                    <button onClick={toggleForm}>
                        {showLogin ? 'Go to Register' : 'Go to Login'}
                    </button>
                </>
            )}
        </div>
    );
};

export default App;
