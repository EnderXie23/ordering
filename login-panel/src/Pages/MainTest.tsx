import React from 'react';
import { useHistory } from 'react-router';

export function Main() {
    const history = useHistory();

    return (
        <div className="App">
            <header className="App-header">
                <h1>丑团外卖</h1>
            </header>
            <main>
                <button onClick={() => history.push("/customer-login")}>
                    我是顾客
                </button>

                <button onClick={() => history.push("/chef-login")}>
                    我是厨师
                </button>
            </main>
        </div>
    );
}
