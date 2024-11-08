import React from 'react';
import { Box, Typography } from '@mui/material';
import Verify2FA from './Verify2FA';

function Verify2FALogin() {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          mx: 'auto',
          mt: 4,
          maxWidth: 400,
          bgcolor: 'background.paper',
        }}
      >
        <Typography 
          variant="h5" 
          component="h1" 
          gutterBottom
          sx={{ textAlign: 'center', color: 'text.primary' }}
        >
          Enter 2FA Code
        </Typography>

        <Verify2FA onSuccess="/" />
      </Box>
    </>
  );
}

export default Verify2FALogin;
