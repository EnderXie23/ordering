import React, { useEffect, useState } from 'react'
import {
    CardContent,
    Grid,
    Typography,
    makeStyles,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@material-ui/core';
import { AccountCircle } from '@mui/icons-material';
import ProfileEdit from './ProfileEdit';
import ProfileChangePassword from './ProfileChangePassword';
import { useUser } from 'Pages/UserContext'
import { CustomerQueryProfileMessage } from 'Plugins/CustomerAPI/CustomerProfileMessage'
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 600,
        margin: 'auto',
        padding: theme.spacing(3),
        textAlign: 'center',
    },
    icon: {
        fontSize: theme.spacing(10),
        margin: 'auto',
        marginBottom: theme.spacing(3),
    },
    infoContainer: {
        marginBottom: theme.spacing(2),
    },
    infoItem: {
        display: 'flex',
        height: '64px',
        justifyContent: 'center',
    },
    label: {
        textAlign: 'right',
        paddingRight: theme.spacing(1),
    },
    text: {
        margin: 0,
        padding: 0,
        flex: 1,
    },
    value: {
        width: '70%',
        textAlign: 'left',
    },
    button: {
        margin: theme.spacing(1),
    },
}));

interface UserProfileDialogProps {
    open: boolean;
    onClose: () => void;
}

const Profile: React.FC<UserProfileDialogProps> = ({ open, onClose }) => {
    const classes = useStyles();

    const { name,setName } = useUser();
    const username = name.split('\n')[0];
    const alias = name.split('\n')[1];
    const [phoneNumber, setPhoneNumber] = useState('1234567890');
    const [editOpen, setEditOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [balance, setBalance] = useState(0);


    const handleEditOpen = () => {
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
        loadProfile();
    };

    const handlePasswordOpen = () => {
        setPasswordOpen(true);
    };

    const handlePasswordClose = () => {
        setPasswordOpen(false);
    };

    const sendPostRequest = async (message: CustomerQueryProfileMessage) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(response.data)
            setName(username + '\n' + response.data.nickname)
            setPhoneNumber(response.data.phone)
            setBalance(response.data.balance)
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

    const loadProfile = () => {
        const message = new CustomerQueryProfileMessage(username);
        sendPostRequest(message);
    }

    useEffect(() => {
        if(open){
            loadProfile();
        }
    }, [open])

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle style={{paddingBottom:0}}>
                <Typography variant="h4" component="h1" align="center" style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem'
                }}>
                    用户信息
                </Typography>
            </DialogTitle>
            <DialogContent>
                <CardContent>
                    <Grid container justifyContent="center" alignItems="center" spacing={2}>
                        <AccountCircle className={classes.icon} />
                    </Grid>
                    <Grid container direction="column" className={classes.infoContainer}>
                        <Grid item className={classes.infoItem}>
                            <Typography variant="h6" className={`${classes.label} ${classes.text}`}>
                                用户名：
                            </Typography>
                            <Typography variant="h6" className={`${classes.value} ${classes.text}`}>
                                {username}
                            </Typography>
                        </Grid>
                        <Grid item className={classes.infoItem}>
                            <Typography variant="h6" className={`${classes.label} ${classes.text}`}>
                                昵称：
                            </Typography>
                            <Typography variant="h6" className={`${classes.value} ${classes.text}`}>
                                {alias}
                            </Typography>
                        </Grid>
                        <Grid item className={classes.infoItem}>
                            <Typography variant="h6" className={`${classes.label} ${classes.text}`}>
                                电话号码：
                            </Typography>
                            <Typography variant="h6" className={`${classes.value} ${classes.text}`}>
                                {phoneNumber}
                            </Typography>
                        </Grid>
                        <Grid item className={classes.infoItem}>
                            <Typography variant="h6" className={`${classes.label} ${classes.text}`}>
                                余额：
                            </Typography>
                            <Typography variant="h6" className={`${classes.value} ${classes.text}`}>
                                {balance}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleEditOpen} color="primary" style={{ textTransform: 'none', fontWeight: 'bold' }}>
                    编辑资料
                </Button>
                <Button onClick={handlePasswordOpen} color="secondary" style={{ textTransform: 'none', fontWeight: 'bold' }}>
                    修改密码
                </Button>
                <Button onClick={onClose} color="default" style={{ textTransform: 'none', fontWeight: 'bold' }}>
                    关闭
                </Button>
            </DialogActions>
            <ProfileEdit open={editOpen} onClose={handleEditClose}/>
            <ProfileChangePassword open={passwordOpen} onClose={handlePasswordClose} />
        </Dialog>
    );
};

export default Profile;
