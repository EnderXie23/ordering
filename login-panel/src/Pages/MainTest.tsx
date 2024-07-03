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
                <button onClick={() => history.push("/chef-login")}>
                    Chef Login
                </button>
                <button onClick={() => history.push("/chef-register")}>
                    Chef Register
                </button>
                <button onClick={() => history.push("/customer-login")}>
                    Customer Login
                </button>
                <button onClick={() => history.push("/customer-register")}>
                    Customer Register
                </button>
            </main>
        </div>
    );
}
