// ChangePasswordDialog.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@material-ui/core';

interface ProfileChangePasswordProps {
    open: boolean;
    onClose: () => void;
}

//TODO: really change
const ProfileChangePassword: React.FC<ProfileChangePasswordProps> = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>修改密码</DialogTitle>
            <DialogContent>
                <TextField margin="dense" label="当前密码" type="password" fullWidth />
                <TextField margin="dense" label="新密码" type="password" fullWidth />
                <TextField margin="dense" label="确认新密码" type="password" fullWidth />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    取消
                </Button>
                <Button onClick={onClose} color="primary">
                    保存
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProfileChangePassword;
