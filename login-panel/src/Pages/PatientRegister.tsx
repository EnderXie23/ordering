import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { PatientRegisterMessage } from 'Plugins/PatientAPI/PatientRegisterMessage';
import { useHistory } from 'react-router'

export function PatientRegister() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const history=useHistory()
    const sendPostRequest = async (message: PatientRegisterMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Response status:', response.status);
            console.log('Response body:', response.data);
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response && error.response.data) {
                    console.error('Error sending request:', error.response.data);
                } else {
                    console.error('Error sending request:', error.message);
                }
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    const handleLogin = () => {
        const patientRegisterMessage = new PatientRegisterMessage(userName, password);
        sendPostRequest(patientRegisterMessage);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Patient Register</h1>
            </header>
            <main>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label>
                            Username:
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Password:
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                    </div>
                    <button type="button" onClick={handleLogin}>
                        Register
                    </button>
                    <button onClick={() => history.push("/")}>
                        Return
                    </button>
                </form>
            </main>
        </div>
    );
}
