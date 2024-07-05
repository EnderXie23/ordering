import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { LoginMessage } from 'Plugins/ChefAPI/LoginMessage';
import { useHistory } from 'react-router'
import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material'
import { useUser } from 'Pages/UserContext'
import { CustomerLoginMessage } from 'Plugins/CustomerAPI/CustomerLoginMessage'

export function CustomerLogin() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const [successMessage, setSuccessMessage] = useState('');
    const { setUsername } = useUser()

    const history=useHistory()
    const sendPostRequest = async (message: CustomerLoginMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Response status:', response.status);
            console.log('Response body:', response.data);
            if (response.data == 'Valid user') {
                setSuccessMessage('登录成功，跳转中…');
                setErrorMessage('');
                setUsername(userName)
                setTimeout(() => {
                    history.push('/place-order');
                }, 1000);
            } else if (response.data == 'Invalid user') {
                setSuccessMessage('');
                setErrorMessage('登录失败：用户名或密码错误');
            } else {
                setSuccessMessage('');
                setErrorMessage(response.data);
            }
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response && error.response.data) {
                    console.error('Error sending request:', error.response.data);
                    setErrorMessage(extractErrorBody(error.response.data.error) || '登录失败');
                    setSuccessMessage('');
                } else {
                    console.error('Error sending request:', error.message);
                    setErrorMessage(error.message || '登录失败');
                    setSuccessMessage('');
                }
            } else {
                console.error('Unexpected error:', error);
                setErrorMessage('Unexpected error occurred');
                setSuccessMessage('');
            }
        }
    };

    const extractErrorBody = (errorData: any) => {
        if (typeof errorData === 'string') {
            const bodyMatch = errorData.match(/Body: (.*)$/);
            return bodyMatch ? bodyMatch[1] : errorData;
        }
        return JSON.stringify(errorData);
    };

    const CustomerLogin = () => {
        const loginMessage = new CustomerLoginMessage(userName, password);
        sendPostRequest(loginMessage);
    };

    return (
        <Container maxWidth="sm" className="container">
            <Typography variant="h4" component="h1" align="center" gutterBottom>
                顾客登录
            </Typography>
            <form onSubmit={(e) => e.preventDefault()}>
                <TextField
                    label="用户名"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="密码"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column'}}>
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                    {successMessage && <Alert severity="success">{successMessage}</Alert>}
                    <Button variant="contained" color="primary" onClick={CustomerLogin} fullWidth>
                        登录
                    </Button>
                </Box>
                <Box display="flex" mt={2} className="button-container">
                    <Button color="secondary" onClick={() => {setTimeout(() => {history.push('/customer-register')}, 500)}}>
                        新用户注册
                    </Button>
                    <Button color="secondary" onClick={() => {setTimeout(() => {history.push('/')}, 500)}}>
                        主页
                    </Button>
                </Box>
            </form>
        </Container>
    );
}
