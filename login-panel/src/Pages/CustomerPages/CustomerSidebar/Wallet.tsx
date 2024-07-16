import React, {useState, useEffect} from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Alert, Box } from '@mui/material'
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
            setBalance(Number(response.data.balance));
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
                setTimeout(() => {
                    setSuccessMessage('');
                },1500);
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

    // wallet-charge
    const [chargeWalletOpen, setWalletChargeOpen] = useState(false);
    const handleWalletChargeOpen = () => {
        setWalletChargeOpen(true);
    };
    const handleWalletChargeClose = () => {
        setWalletChargeOpen(false);
    };

    const handleCharge = async(amount: number) => {
        const new_amount = (Number(balance) + Number(amount)).toFixed(2);
        const cmessage = new CustomerChargeMessage(username, new_amount);
        await ChargeRequest(cmessage);

        const qmessage = new CustomerQueryProfileMessage(username);
        QueryProfileRequest(qmessage)
    };

    const handleClose = () => {
        setErrorMessage('');
        setSuccessMessage('');
        onClose();
    }

    useEffect(() => {
        if (open) {
            const message = new CustomerQueryProfileMessage(username);
            QueryProfileRequest(message);
            setErrorMessage('');
            setSuccessMessage('');
        }
    }, [open]);

    return (
        <>
            <Dialog open={open}
                    onClose={handleClose}
                    aria-labelledby="user-balance-dialog"
                    PaperProps={{
                        style: {
                            width: '50vw',
                            height: '35vh',
                        },
                    }}>
                <DialogTitle>
                    <Typography variant="h4" component="h1" align="center" style={{
                        fontSize: '3rem',
                        fontWeight: 'bold',
                    }}>
                        用户余额
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" padding={2}>
                        <Typography variant="h6" gutterBottom>
                            您当前的余额是:
                        </Typography>
                        <Typography variant="h4" color="primary">
                            {balance.toFixed(2)} 元
                        </Typography>
                    </Box>
                </DialogContent>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}
                <DialogActions>
                    <Button onClick={handleClose} color="secondary" style={{ textTransform: 'none', fontWeight: 'bold' }}>
                        关闭
                    </Button>
                    <Button onClick={handleWalletChargeOpen} variant="contained" className='button'>
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