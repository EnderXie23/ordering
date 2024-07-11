// EditProfileDialog.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@material-ui/core';

interface ProfileEditProps {
    open: boolean;
    onClose: () => void;
}

//TODO: really edit
const ProfileEdit: React.FC<ProfileEditProps> = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>编辑资料</DialogTitle>
            <DialogContent>
                <TextField margin="dense" label="用户名" fullWidth />
                <TextField margin="dense" label="昵称" fullWidth />
                <TextField margin="dense" label="电话号码" fullWidth />
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

export default ProfileEdit;
