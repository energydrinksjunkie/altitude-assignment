import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

function VerifyForgotPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyForgotPasswordToken = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/forgotPasswordVerify`, { token });
        
        const tempToken = response.data.token;
        if (tempToken) {
          localStorage.setItem('tempToken', tempToken);
          setMessage('Verification successful. Redirecting to reset password...');
          setError('');

          setTimeout(() => {
            navigate('/resetPassword');
          }, 2000);
        } else {
          throw new Error('Verification failed, no token provided.');
        }
      } catch (err) {
        if (err.response) {
          setError(err.response.data.error || 'Something went wrong');
          setMessage('');
        } else {
          setError('Network error or no response from server');
          setMessage('');
        }
      } finally {
        setLoading(false);
      }
    };

    verifyForgotPasswordToken();
  }, [token, navigate]);

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

export default VerifyForgotPassword;
