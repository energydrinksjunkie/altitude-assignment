import React, { useState } from 'react';
import { Box, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/resendForgotPassword`,
        { email }
      );

      setSuccess(response.data.message || 'If the email is registered, a password reset link has been sent.');
      setError('');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'Failed to send reset email.');
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
          type="email"
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Send Reset Link
        </Button>

        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </form>
    </Box>
  );
}

export default ForgotPassword;
