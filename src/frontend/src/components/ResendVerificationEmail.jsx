import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

function ResendVerificationEmail() {
  const { email } = useParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const resendVerificationEmail = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/resendVerificationEmail`, {
          email,
        });

        setMessage(response.data.message || 'If this email is registered, a verification link has been resent.');
        setError('');
      } catch (err) {
        if (err.response) {
          setError(err.response.data.error || 'Failed to resend verification email.');
        } else {
          setError('Network error or no response from server');
        }
        setMessage('');
      } finally {
        setLoading(false);
      }
    };

    resendVerificationEmail();
  }, [email]);

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
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </>
      )}
    </Box>
  );
}

export default ResendVerificationEmail;
