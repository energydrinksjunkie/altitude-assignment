import React from 'react';
import { Typography, Box } from '@mui/material';

const Welcome = () => {
    return (
        <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center"
            height="100vh"
            textAlign="center"
        >
            <Typography variant="h4">
                Welcome!
            </Typography>
            <Typography variant="body1" color="textSecondary">
                You're logged in.
            </Typography>
        </Box>
    );
};

export default Welcome;
