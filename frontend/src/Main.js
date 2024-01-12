import React, { useState, useEffect } from 'react';
import './Main.css';

const Main = () => {
    const [selectedCollection, setSelectedCollection] = useState('elevi');
    const [entries, setEntries] = useState([]);
    const [newEntry, setNewEntry] = useState({});

    useEffect(() => {
        fetchEntries();
    }, [selectedCollection]);

    const fetchEntries = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/${selectedCollection}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setEntries(data);
            } else {
                console.error('Failed to fetch entries');
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    };

    const handleDropdownChange = (event) => {
        setSelectedCollection(event.target.value);
    };

    const handleDisplayEntries = () => {
        fetchEntries();
    };

    const handleInsertEntry = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/${selectedCollection}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newEntry),
            });

            if (response.ok) {
                console.log('Entry inserted successfully');
                fetchEntries();
            } else {
                console.error('Failed to insert entry');
            }
        } catch (error) {
            console.error('Error during insertion:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewEntry((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Liceu</h1>
            </div>
            <div className="collection-select">
                <label>
                    Select Collection:
                    <select value={selectedCollection} onChange={handleDropdownChange}>
                        <option value="elevi">Elevi</option>
                        <option value="profesori">Profesori</option>
                        <option value="clase">Clase</option>
                        <option value="note">Note</option>
                    </select>
                </label>
            </div>
            <div className="entries-section">
                <button className="display-entry-button" onClick={handleDisplayEntries}>Display Entries</button>
                <ul className="entries-list">
                    {entries.map((entry) => (
                        <li key={entry._id} className="entries-list-item">
                            {selectedCollection === 'elevi' ? (
                                `Nume: ${entry.nume}, Prenume: ${entry.prenume}, Clasa: ${entry.clasa}`
                            ) : selectedCollection === 'profesori' ? (
                                `Nume: ${entry.nume}, Prenume: ${entry.prenume}, Materie: ${entry.materie}`
                            ) : selectedCollection === 'clase' ? (
                                `Numar elevi: ${entry.numar_elevi}, Nume: ${entry.nume}, Nivel: ${entry.nivel}`
                            ) : selectedCollection === 'note' ? (
                                `Materie: ${entry.materie}, Elev: ${entry.elev}, Nota: ${entry.nota}`
                            ) : null}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="insert-entry-section">
                <h2>Insert Entry:</h2>
                <form className="insert-entry-form">
                    <label>
                        Attribute 1:
                        <input
                            type="text"
                            name="attribute1"
                            value={newEntry.attribute1 || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Attribute 2:
                        <input
                            type="text"
                            name="attribute2"
                            value={newEntry.attribute2 || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Attribute 3:
                        <input
                            type="text"
                            name="attribute3"
                            value={newEntry.attribute3 || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    {}
                    <button type="button" className="insert-entry-button" onClick={handleInsertEntry}>
                        Insert Entry
                    </button>
                </form>
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Main;
