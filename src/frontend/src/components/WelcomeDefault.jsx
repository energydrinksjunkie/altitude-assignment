import React from 'react';
import { Typography, Box } from '@mui/material';

const WelcomeDefault = () => {
    return (
        <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center"
            height="100vh"
            textAlign="center"
        >
            <Typography variant="h4" color='primary'>
                Welcome to Altitude Task!
            </Typography>
            <Typography variant="body1" color="textSecondary">
                Log in or create an account to get started.
            </Typography>
        </Box>
    );
};

export default WelcomeDefault;
