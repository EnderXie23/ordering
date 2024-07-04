import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { RegisterMessage } from 'Plugins/ChefAPI/RegisterMessage';
import { useHistory } from 'react-router'
import { Container, TextField, Button, Typography, Alert, Box } from '@mui/material';

export function CustomerRegister() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const [successMessage, setSuccessMessage] = useState('');

    const history=useHistory()
    const sendPostRequest = async (message: RegisterMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Response status:', response.status);
            console.log('Response body:', response.data);
            setSuccessMessage('注册成功，跳转至登录页…');
            setErrorMessage('');
            setTimeout(() => {
                history.push('/chef-login');
            }, 1000);
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response && error.response.data) {
                    console.error('Error sending request:', error.response.data);
                    setErrorMessage('注册失败：' + extractErrorBody(error.response.data.error) || '注册失败');
                    setSuccessMessage('');
                } else {
                    console.error('Error sending request:', error.message);
                    setErrorMessage(error.message || '注册失败');
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

    const CustomerRegister = () => {
        if (password !== confirmPassword) {
            setErrorMessage('密码和确认密码不匹配');
            setSuccessMessage('');
            return;
        }

        const registerMessage = new RegisterMessage(userName, password);
        sendPostRequest(registerMessage);
    };

    return (
        <Container maxWidth="sm" className="container">
            <Typography variant="h4" component="h1" align="center" gutterBottom>
                新顾客注册
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
                <TextField
                    label="确认密码"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}
                <Button variant="contained" color="primary" onClick={CustomerRegister} fullWidth>
                    注册
                </Button>
                <Box display="flex" mt={2} className="button-container">
                    <Button color="secondary" onClick={() => history.push("/customer-login")}>
                        返回登录页
                    </Button>
                    <Button color="secondary" onClick={() => history.push("/")}>
                        主页
                    </Button>
                </Box>
            </form>
        </Container>
    );
}
