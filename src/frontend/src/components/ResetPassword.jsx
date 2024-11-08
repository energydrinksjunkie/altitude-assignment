import React, { useState } from 'react';
import { Box, TextField, Button, Snackbar, Alert, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordRegex.test(password)) {
      setAlertMessage('Password must be at least 8 characters long and include both letters and numbers.');
      setAlertType('error');
      setOpenSnackbar(true);
      return;
    }

    try {
      const tempToken = localStorage.getItem('tempToken');
      if (!tempToken) {
        setAlertMessage('No token found. Please restart the password reset process.');
        setAlertType('error');
        setOpenSnackbar(true);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/forgotPassword`,
        { password },
        {
          headers: { Authorization: `Bearer ${tempToken}` },
        }
      );

      setAlertMessage('Password reset successful. Redirecting to login...');
      setAlertType('success');
      setOpenSnackbar(true);
      localStorage.removeItem('tempToken');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err.response) {
        setAlertMessage(err.response.data.error || 'Failed to reset password.');
        setAlertType('error');
      } else {
        setAlertMessage('Network error or no response from server');
        setAlertType('error');
      }
      setOpenSnackbar(true);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        maxWidth: 400,
        mx: 'auto',
        mt: 4,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h6" component="h2" gutterBottom sx={{ textAlign: 'center', color: 'text.primary' }}>
        Reset Your Password
      </Typography>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          type="password"
          label="New Password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!password && !passwordRegex.test(password)}
          helperText={!!password && !passwordRegex.test(password) && "Password must be at least 8 characters with letters and numbers."}
          sx={{
            backgroundColor: 'background.default',
            borderRadius: 1,
            mb: 2,
          }}
        />

        <Button type="submit" variant="contained" fullWidth sx={{ mb: 2 }}>
          Reset Password
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

export default ResetPassword;
