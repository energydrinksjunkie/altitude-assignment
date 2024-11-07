import React, { useState } from 'react';
import { TextField, Button, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Verify2FA({ onSuccess }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVerify = async () => {
    setLoading(true);
    setError('');

    try {
      const tempToken = localStorage.getItem('tempToken');

      if (!tempToken) {
        setError('No temporary token found. Please try again.');
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/verifyTwoFactorAuth`,
        { token: code },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        }
      );

      localStorage.removeItem('tempToken');
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }


      navigate(onSuccess);
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TextField
        label="Enter your 2FA code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      {loading ? (
        <CircularProgress />
      ) : (
        <Button variant="contained" onClick={handleVerify}>
          Verify
        </Button>
      )}
      {error && <Alert severity="error">{error}</Alert>}
    </div>
  );
}

export default Verify2FA;
