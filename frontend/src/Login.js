import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLoginSuccess, toggleForm }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const token = await response.json();
                localStorage.setItem('token', token.token.toString());
                console.log(token.token);
                onLoginSuccess();
            } else {
                setLoginError('Login failed. Check your credentials.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setLoginError('Error during login');
        }
    };

    const redirectToSwaggerUI = () => {
        window.location.href = 'http://localhost:3001/api-docs/#/';
    };

    return (
        <div className="container">
            <h1>Login</h1>
            <form className="form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <input className="input" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="button" type="submit">Login</button>
                <button className="button" type="button" onClick={redirectToSwaggerUI}>Go to Swagger UI</button>
            </form>
            {loginError && <p>{loginError}</p>}
            <button className="toggle-button" onClick={toggleForm}>
                Go to Register
            </button>
        </div>
    );
};

export default Login;
