import React, {useState, useEffect} from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Alert } from '@mui/material'
import WalletCharge from './WalletCharge'
import { CustomerQueryProfileMessage, CustomerChargeMessage } from 'Plugins/CustomerAPI/CustomerProfileMessage'
import axios from 'axios'
import { useUser } from 'Pages/UserContext'

interface WalletProps {
    open: boolean;
    onClose: () => void;
}

const Wallet: React.FC<WalletProps> = ({ open,  onClose }) => {
    const [balance, setBalance] = useState(0.0);
    const { name } = useUser();
    const username = name.split('\n')[0];
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    const QueryProfileRequest = async (message: CustomerQueryProfileMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(response.data)
            setBalance(response.data.split('\n')[1])
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

    const ChargeRequest = async (message: CustomerChargeMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(response.data)
            if (response.data == 'Savings updated successfully'){
                setSuccessMessage('充值成功');
                setErrorMessage('');
            } else {
                setErrorMessage('充值失败');
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            setErrorMessage('Unexpected error occurred');
            setSuccessMessage('');
        }
    };

    useEffect(() => {
        if (open) {
            const message = new CustomerQueryProfileMessage(username);
            QueryProfileRequest(message);
        }
    }, [open]);

    // wallet-charge
    const [chargeWalletOpen, setWalletChargeOpen] = useState(false);
    const handleWalletChargeOpen = () => {
        setWalletChargeOpen(true);
    };
    const handleWalletChargeClose = () => {
        setWalletChargeOpen(false);
    };

    const handleCharge = (amount: number) => {
        const new_amount = (Number(balance) + Number(amount)).toString();
        const cmessage = new CustomerChargeMessage(username, new_amount);
        ChargeRequest(cmessage);

        const qmessage = new CustomerQueryProfileMessage(username);
        QueryProfileRequest(qmessage)
    };

    const handleClose = () => {
        setErrorMessage('');
        setSuccessMessage('');
        onClose();
    }

    return (
        <>
            <Dialog open={open} onClose={handleClose} aria-labelledby="user-balance-dialog">
                <DialogTitle id="user-balance-dialog">用户余额</DialogTitle>
                <DialogContent>
                    <Typography>您的当前余额是: {balance} 元</Typography>
                </DialogContent>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        关闭
                    </Button>
                    <Button onClick={handleWalletChargeOpen} color="primary" variant="contained">
                        立即充值
                    </Button>
                </DialogActions>
            </Dialog>

            <WalletCharge
                open={chargeWalletOpen}
                onClose={handleWalletChargeClose}
                onCharge={handleCharge}
            />
        </>
    );
};

export default Wallet;
