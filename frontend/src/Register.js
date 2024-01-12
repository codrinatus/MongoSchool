import React, { useState } from 'react';
import './Login.css';

const Register = ({ toggleForm }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registrationMessage, setRegistrationMessage] = useState('');

    const handleRegister = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                setRegistrationMessage('Registration successful');
            } else {
                const data = await response.json();
                setRegistrationMessage(`Registration failed: ${data.error}`);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setRegistrationMessage('Error during registration');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleRegister();
    };

    return (
        <div className="container">
            <h1>Register</h1>
            <form className="form" onSubmit={handleSubmit}>
                <input className="input" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="button" type="submit">Register</button>
            </form>
            {registrationMessage && <p>{registrationMessage}</p>}
            <button className="toggle-button" onClick={toggleForm}>Go to Login</button> {}
        </div>
    );
};

export default Register;
