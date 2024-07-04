import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { CustomerRegisterMessage } from 'Plugins/CustomerAPI/CustomerRegisterMessage';
import { useHistory } from 'react-router'

export function CustomerRegister() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const history=useHistory()
    const sendPostRequest = async (message: CustomerRegisterMessage) => {
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
        const customerRegisterMessage = new CustomerRegisterMessage(userName, password);
        sendPostRequest(customerRegisterMessage);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>新顾客注册</h1>
            </header>
            <main>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label>
                            用户名：
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            密码：
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                    </div>
                    <button type="button" onClick={handleLogin}>
                        注册
                    </button>
                    <button onClick={() => history.push("/customer-login")}>
                        回到登录页面
                    </button>
                    <button onClick={() => history.push("/")}>
                        主页
                    </button>
                </form>
            </main>
        </div>
    );
}
