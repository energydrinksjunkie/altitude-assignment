import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

function Verify() {

  const navigate = useNavigate();
  const { token } = useParams();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/verify`, { token });
        setMessage(response.message || 'Verification successful');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (err) {
        if (err.response) {
          setError(err.response.data.error || 'Something went wrong');
        } else {
          setError('Network error or no response from server');
        }
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
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
};

export default Verify;