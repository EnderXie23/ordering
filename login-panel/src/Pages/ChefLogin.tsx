import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { LoginMessage } from 'Plugins/ChefAPI/LoginMessage';
import { useHistory } from 'react-router'


export function ChefLogin() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const history=useHistory()
    const sendPostRequest = async (message: LoginMessage) => {
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
        const loginMessage = new LoginMessage(userName, password);
        sendPostRequest(loginMessage);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>厨师登录</h1>
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
                        登录
                    </button>
                    <button onClick={() => history.push("/chef-register")}>
                        新用户注册
                    </button>
                    <button onClick={() => history.push("/")}>
                        主页
                    </button>
                </form>
            </main>
        </div>
    );
}
