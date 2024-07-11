import React, {useState, useEffect} from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';
import WalletCharge from './WalletCharge'

interface WalletProps {
    open: boolean;
    onClose: () => void;
}

const Wallet: React.FC<WalletProps> = ({ open,  onClose }) => {
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        // Fetch user balance when the dialog opens
        if (open) {
            // TODO: Replace with actual fetch call
            setBalance(0); // Example balance
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
        // TODO: really handle it here
        setBalance(balance + amount);
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} aria-labelledby="user-balance-dialog">
                <DialogTitle id="user-balance-dialog">用户余额</DialogTitle>
                <DialogContent>
                    <Typography>您的当前余额是: {balance} 元</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">
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
