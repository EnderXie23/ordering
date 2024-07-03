import React from 'react';
import { useHistory } from 'react-router';

export function Main() {
    const history = useHistory();

    return (
        <div className="App">
            <header className="App-header">
                <h1>HTTP Post Requests</h1>
            </header>
            <main>
                <button onClick={() => history.push("/doctor-login")}>
                    Doctor Login
                </button>
                <button onClick={() => history.push("/doctor-register")}>
                    Doctor Register
                </button>
                <button onClick={() => history.push("/patient-login")}>
                    Patient Login
                </button>
                <button onClick={() => history.push("/patient-register")}>
                    Patient Register
                </button>
            </main>
        </div>
    );
}
