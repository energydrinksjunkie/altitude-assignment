import React, { useState } from 'react';
import { Box, TextField, Button, Snackbar, Alert, Typography } from '@mui/material';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/resendForgotPassword`,
        { email }
      );

      setAlertMessage(response.data.message || 'If the email is registered, a password reset link has been sent.');
      setAlertType('success');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to send reset email.';
      setAlertMessage(errorMsg);
      setAlertType('error');
    }

    setOpenSnackbar(true);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 400,
        mx: 'auto',
        mt: 4,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h6" component="h2" gutterBottom sx={{ textAlign: 'center', color: 'text.primary' }}>
        Enter your email to receive a password reset link
      </Typography>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          type="email"
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{
            backgroundColor: 'background.default',
            borderRadius: 1,
            mb: 2,
          }}
        />

        <Button type="submit" variant="contained" fullWidth sx={{ mb: 2 }}>
          Send Reset Link
        </Button>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={alertType} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ForgotPassword;
