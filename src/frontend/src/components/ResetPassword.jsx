import React, { useState } from 'react';
import { Box, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and include both letters and numbers.');
      return;
    }

    try {
      const tempToken = localStorage.getItem('tempToken');
      if (!tempToken) {
        setError('No token found. Please restart the password reset process.');
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/forgotPassword`,
        { password },
        {
          headers: { Authorization: `Bearer ${tempToken}` },
        }
      );

      setSuccess('Password reset successful. Redirecting to login...');
      setError('');
      localStorage.removeItem('tempToken');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'Failed to reset password.');
      } else {
        setError('Network error or no response from server');
      }
      setSuccess('');
    }
  };

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
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
        <TextField
          type="password"
          label="New Password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!error && !passwordRegex.test(password)}
          helperText={!passwordRegex.test(password) && "Password must be at least 8 characters with letters and numbers."}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Reset Password
        </Button>

        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </form>
    </Box>
  );
}

export default ResetPassword;
