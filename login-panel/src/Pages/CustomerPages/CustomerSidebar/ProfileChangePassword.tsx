import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, IconButton, InputAdornment }
    from '@material-ui/core'
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { CustomerChangePwdMessage } from 'Plugins/CustomerAPI/CustomerProfileMessage'
import { Alert } from '@mui/material'
import { useUser } from 'Pages/UserContext'
import { CustomerRegisterMessage } from 'Plugins/CustomerAPI/CustomerRegisterMessage'
import axios, { isAxiosError } from 'axios'

interface ProfileChangePasswordProps {
    open: boolean;
    onClose: () => void;
}

const ProfileChangePassword: React.FC<ProfileChangePasswordProps> = ({open, onClose}) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
    const { name } = useUser();
    const username = name.split('\n')[0];

    const handleClose = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
        setErrorMessage('');
        setSuccessMessage('');
    }

    const sendPostRequest = async (message: CustomerChangePwdMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.data == 'password is wrong'){
                setErrorMessage('旧密码错误');
                setSuccessMessage('');
                setOldPassword('');
                return;
            } else {
                setSuccessMessage('密码修改成功');
                setErrorMessage('');
                setTimeout(() => {
                    handleClose();
                }, 1500);
            }
        } catch (error) {
            console.error('Change password error:', error);
            setErrorMessage('Unexpected error occurred');
            setSuccessMessage('');
        }
    };

    const handlePwdChange = () =>{
        if (oldPassword == '' || newPassword == '' || confirmPassword == '') {
            setErrorMessage('密码不能为空');
            setSuccessMessage('');
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMessage('两次密码输入不一致');
            setSuccessMessage('');
            return;
        }

        const message = new CustomerChangePwdMessage(username, oldPassword, newPassword);
        sendPostRequest(message);
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography align="center" style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem'
                }}>
                    修改密码
                </Typography>
            </DialogTitle>
            <DialogContent>
                <TextField value={oldPassword} margin="dense" label="当前密码" type={showPassword ? 'text' : 'password'} fullWidth
                           onChange={(e) => setOldPassword(e.target.value)}
                           InputProps={{
                               endAdornment: (
                                   <InputAdornment position="end">
                                       <IconButton
                                           aria-label="toggle password visibility"
                                           onClick={() => setShowPassword(!showPassword)}
                                           edge="end"
                                       >
                                           {showPassword ? <Visibility /> : <VisibilityOff />}
                                       </IconButton>
                                   </InputAdornment>
                               ),
                           }}/>
                <TextField value={newPassword} margin="dense" label="新密码" type={showNewPassword ? 'text' : 'password'} fullWidth
                           onChange={(e) => setNewPassword(e.target.value)}
                           InputProps={{
                               endAdornment: (
                                   <InputAdornment position="end">
                                       <IconButton
                                           aria-label="toggle password visibility"
                                           onClick={() => setShowNewPassword(!showNewPassword)}
                                           edge="end"
                                       >
                                           {showPassword ? <Visibility /> : <VisibilityOff />}
                                       </IconButton>
                                   </InputAdornment>
                               ),
                           }}/>
                <TextField value={confirmPassword} margin="dense" label="确认新密码" type={showConfirmPassword ? 'text' : 'password'}
                           fullWidth onChange={(e) => setConfirmPassword(e.target.value)}
                           InputProps={{
                               endAdornment: (
                                   <InputAdornment position="end">
                                       <IconButton
                                           aria-label="toggle confirm password visibility"
                                           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                           edge="end"
                                       >
                                           {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                       </IconButton>
                                   </InputAdornment>
                               ),
                           }}/>
            </DialogContent>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            <DialogActions>
                <Button onClick={handleClose} color="secondary" style={{ textTransform: 'none', fontWeight: 'bold' }}>
                    取消
                </Button>
                <Button onClick={handlePwdChange} color="primary" style={{ textTransform: 'none', fontWeight: 'bold' }}>
                    保存
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProfileChangePassword;
