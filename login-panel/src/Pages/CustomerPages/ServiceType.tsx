import React, { useState } from 'react';
import { useUser } from 'Pages/UserContext'
import { useHistory } from 'react-router'
import { Grid, Button, Box, Typography } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import backgroundImage from 'Images/background.png'

const ServiceType: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const {setService, setServiceTypeInfo} = useUser();

    const history=useHistory()

    const handleServiceTypeSelection = (serviceType: string) => {
        setService(serviceType === 'takeaway' ? 0 : 1);
        setServiceTypeInfo(inputValue);
        history.push('/place-order');
        console.log(serviceType);
    };

    return (
        <div className='root' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Box className='cover' />
                <Box className='main-box' sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
                    <Typography variant="h4" component="h1" align="center" gutterBottom sx={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem'
                    }}>
                        请选择服务方式
                    </Typography>
                    <Grid item style={{ display: 'flex' }}>
                        <Button
                            variant="contained"
                            className='button'
                            onClick={() => handleServiceTypeSelection('dine-in')}
                            style={{ padding: '20px', margin:'20px', width: '200px', height: '200px', display: 'flex',
                                flexDirection: 'column', alignItems: 'center' }}
                            sx = {{
                                backgroundColor: '#52b3f7',
                                '&:hover': {
                                    backgroundColor: '#4aa1de',
                                }
                            }}
                        >
                            <RestaurantIcon style={{ fontSize: '80px' }} />
                            <Typography variant="h5" style={{ marginTop: '20px', fontWeight: 'bold', }}>堂食</Typography>
                        </Button>
                        <Button
                            variant="contained"
                            className='button'
                            onClick={() => handleServiceTypeSelection('takeaway')}
                            style={{ padding: '20px', margin:'20px', width: '200px', height: '200px', display: 'flex',
                                flexDirection: 'column', alignItems: 'center' }}
                            sx = {{
                                backgroundColor: '#f6c543',
                                '&:hover': {
                                    backgroundColor: '#ddb13c',
                                }
                            }}
                        >
                            <DeliveryDiningIcon style={{ fontSize: '80px' }} />
                            <Typography variant="h5" style={{ marginTop: '20px', fontWeight: 'bold', }}>外卖</Typography>
                        </Button>
                    </Grid>
                </Box>
        </div>
    );
};

export default ServiceType;
