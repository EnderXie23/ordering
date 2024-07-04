import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios'
import { API } from 'Plugins/CommonUtils/API'
import { LoginMessage } from 'Plugins/ChefAPI/LoginMessage'
import { RegisterMessage } from 'Plugins/ChefAPI/RegisterMessage'
import { CustomerLoginMessage } from 'Plugins/CustomerAPI/CustomerLoginMessage'
import { CustomerRegisterMessage } from 'Plugins/CustomerAPI/CustomerRegisterMessage'
import { AddCustomerMessage } from 'Plugins/ChefAPI/AddCustomerMessage'
import { useHistory } from 'react-router';
import './index.css'; // Importing the CSS file
import { render } from 'react-dom'

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


