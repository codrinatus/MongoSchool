import React, {useState, useEffect} from 'react';

const Main = () => {
    const [selectedCollection, setSelectedCollection] = useState('elevi');
    const [entries, setEntries] = useState([]);
    const [newEntry, setNewEntry] = useState({});

    useEffect(() => {
        fetchEntries();
    }, [selectedCollection]);

    const fetchEntries = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/${selectedCollection}`,{
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
        console.log(localStorage.token);
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
        const {name, value} = event.target;
        setNewEntry((prev) => ({...prev, [name]: value}));
    };

    return (
        <div>
            <h1>Liceu</h1>
            <label>
                Select Collection:
                <select value={selectedCollection} onChange={handleDropdownChange}>
                    <option value="elevi">Elevi</option>
                    <option value="profesori">Profesori</option>
                    <option value="clase">Clase</option>
                    <option value="note">Note</option>
                </select>
            </label>
            <button onClick={handleDisplayEntries}>Display Entries</button>
            <h2>Entries:</h2>
            <ul>
                {entries.map((entry) => (
                    <li key={entry._id}>
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
            <div>
                <h2>Insert Entry:</h2>
                <form>
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
                    {/* Add more input fields as needed */}
                    <button type="button" onClick={handleInsertEntry}>
                        Insert Entry
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Main;
