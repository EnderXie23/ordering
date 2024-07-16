import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@material-ui/core'
import { useUser } from 'Pages/UserContext'
import { CustomerEditProfileMessage } from 'Plugins/CustomerAPI/CustomerProfileMessage'
import axios from 'axios'
import { Alert } from '@mui/material'

interface ProfileEditProps {
    open: boolean;
    onClose: () => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ open, onClose }) => {
    const [newNickname, setNewNickname] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { name } = useUser();
    const username = name.split('\n')[0];

    const sendPostRequest = async (message: CustomerEditProfileMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.data == 'Profile updated successfully'){
                setSuccessMessage('修改成功');
                setErrorMessage('');
                setTimeout(() => {
                    setNewPhone('');
                    setNewNickname('');
                    onClose();
                }, 1500);
            }
        } catch (error) {
            console.error('Change password error:', error);
            setErrorMessage('Unexpected error occurred');
            setSuccessMessage('');
        }
    };

    const handleProfileEdit = () =>{
        const message = new CustomerEditProfileMessage(username, newNickname, newPhone);
        sendPostRequest(message);
    }

    useEffect(() => {
        if(open){
            setNewNickname(name.split('\n')[1]);
        }
    }, [open]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h4" component="h1" align="center" style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem'
                }}>
                    编辑资料
                </Typography>
            </DialogTitle>
            <DialogContent>
                <TextField disabled value={username} margin="dense" label="用户名" fullWidth />
                <TextField value={newNickname} margin="dense" label="昵称" fullWidth onChange={(e)=>setNewNickname(e.target.value)}/>
                <TextField value={newPhone} margin="dense" label="电话号码" fullWidth onChange={(e)=>setNewPhone(e.target.value)}/>
            </DialogContent>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            <DialogActions>
                <Button onClick={onClose} color="secondary" style={{ textTransform: 'none', fontWeight: 'bold' }}>
                    取消
                </Button>
                <Button onClick={handleProfileEdit} color="primary" style={{ textTransform: 'none', fontWeight: 'bold' }}>
                    保存
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProfileEdit;
