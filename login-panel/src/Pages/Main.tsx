import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios'
import { API } from 'Plugins/CommonUtils/API'
import { LoginMessage } from 'Plugins/ChefAPI/LoginMessage'
import { RegisterMessage } from 'Plugins/ChefAPI/RegisterMessage'
import { CustomerLoginMessage } from 'Plugins/CustomerAPI/CustomerLoginMessage'
import { CustomerRegisterMessage } from 'Plugins/CustomerAPI/CustomerRegisterMessage'
import { AddCustomerMessage } from 'Plugins/ChefAPI/AddCustomerMessage'
import { useHistory } from 'react-router';

export function Main(){
    const history=useHistory()
    const sendPostRequest = async (message: API) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Response status:', response.status);
            console.log('Response body:', response.data);
        } catch (error) {
            if (isAxiosError(error)) {
                // Check if the error has a response and a data property
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

    return (
        <div className="App">
            <header className="App-header">
                <h1>HTTP Post Requests</h1>
            </header>
            <main>
                <button onClick={() => sendPostRequest(new LoginMessage('aaaa', 'bbbb'))}>
                    Chef Login aaaa
                </button>
                <button onClick={() => sendPostRequest(new RegisterMessage('aaaa', 'bbbb'))}>
                    Chef Register aaaa
                </button>
                <button onClick={() => sendPostRequest(new LoginMessage('aaaab', 'bbbb'))}>
                    Chef Login aaaab
                </button>
                <button onClick={() => sendPostRequest(new CustomerLoginMessage('cccc', 'bbbb'))}>
                    Customer Login cccc
                </button>
                <button onClick={() => sendPostRequest(new CustomerRegisterMessage('cccc', 'bbbb'))}>
                    Customer Register cccc
                </button>
                <button onClick={() => sendPostRequest(new AddCustomerMessage('aaaa', 'cccc'))}>
                    Add Customer
                </button>
                <button onClick={() => history.push("/another")}>
                    jump to another page
                </button>
            </main>
        </div>
    );
}


