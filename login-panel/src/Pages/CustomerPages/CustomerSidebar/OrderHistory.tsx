import React, {useState, useEffect} from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Alert } from '@mui/material'
import axios from 'axios'
import { useUser } from 'Pages/UserContext'

interface OrderHistoryProps {
    open: boolean;
    onClose: () => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ open,  onClose }) => {
    const [balance, setBalance] = useState(0.0);
    const { name } = useUser();
    const username = name.split('\n')[0];
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    const handleClose = () => {
        setErrorMessage('');
        setSuccessMessage('');
        onClose();
    }

    useEffect(() => {
        if (open) {
            setErrorMessage('');
            setSuccessMessage('');
        }
    }, [open]);

    return (
        <>
        </>
    );
};

export default OrderHistory;