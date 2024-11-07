import React from 'react';
import { Box } from '@mui/material';
import Verify2FA from './Verify2FA';

function Verify2FALogin() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
      }}
    >
      <Verify2FA onSuccess="/" />
    </Box>
  );
}

export default Verify2FALogin;
