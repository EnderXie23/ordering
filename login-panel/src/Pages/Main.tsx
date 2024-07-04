import React from 'react';
import { useHistory } from 'react-router';
import { Box, Button, Container, Typography } from '@mui/material'
import './index.css'; // Importing the CSS file

export function Main() {
    const history = useHistory();

    return (
        <Container maxWidth="sm" className="container">
            <Typography variant="h2" component="h1" align="center" gutterBottom>
                丑团外卖
            </Typography>
            <form onSubmit={(e) => e.preventDefault()}>
                <Box className="button-container">
                    <Button variant="contained" color="primary" className="button-spacing"
                            onClick={() => history.push("/customer-login")} fullWidth >
                        我是顾客
                    </Button>
                </Box>
                <Box className="button-container">
                    <Button variant="contained" color="primary" className="custom-button button-spacing"
                            onClick={() => history.push("/chef-login")} fullWidth>
                        我是厨师
                    </Button>
                </Box>
            </form>
        </Container>
    );
}


