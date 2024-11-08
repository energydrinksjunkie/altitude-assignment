import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, CircularProgress, Snackbar, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import axios from 'axios';
import Verify2FA from './Verify2FA';

function Generate2FA() {
  const [activeStep, setActiveStep] = useState(0);
  const [method, setMethod] = useState('email');
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const steps = ['Select 2FA Method', 'Verify 2FA'];

  const handleMethodChange = (event) => {
    setMethod(event.target.value);
  };

  const handleNext = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      if (method === 'email') {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/generateTwoFactorAuthEmail`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.setItem('tempToken', response.data.token);
      } else {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/generateTwoFactorAuthApp`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.setItem('tempToken', response.data.token);
        setQrCode(response.data.qrCode);
      }

      setActiveStep(activeStep + 1);
    } catch (err) {
      setError('Failed to generate 2FA. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      window.location.href = '/editProfile';
    } else {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderRadius: 2,
        boxShadow: 3,
        mx: 'auto',
        mt: 4,
        maxWidth: 600,
      }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ width: '100%', mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{ color: 'text.primary' }}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 400,
            mb: 2,
          }}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>Select your 2FA Method</Typography>
            <RadioGroup value={method} onChange={handleMethodChange} sx={{ mb: 3 }}>
              <FormControlLabel value="email" control={<Radio />} label="Email" />
              <FormControlLabel value="app" control={<Radio />} label="Google Authenticator (App)" />
            </RadioGroup>
            {loading ? (
              <CircularProgress sx={{ color: 'primary.main' }} />
            ) : (
              <Button
                variant="outlined"
                onClick={handleNext}
                sx={{
                  mt: 2,
                  width: '100%',
                  borderRadius: 0,
                  boxShadow: 3,
                  '&:hover': { backgroundColor: 'primary.dark' },
                  height: '48px',
                }}
              >
                Next
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={handleBack}
              sx={{
                mt: 2,
                width: '100%',
                borderRadius: 0,
                boxShadow: 3,
                '&:hover': { backgroundColor: 'secondary.main' },
                height: '48px',
              }}
            >
              Back
            </Button>
          </Box>
        )}

        {activeStep === 1 && (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 400,
            mb: 2,
          }}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>Verify your 2FA</Typography>
            {method === 'email' ? (
              <Verify2FA onSuccess="/editProfile" />
            ) : (
              <>
                <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                  Scan this QR code with Google Authenticator:
                </Typography>
                <img src={qrCode} alt="QR Code" style={{ width: '200px', height: '200px', marginBottom: '20px', borderRadius: '10px' }} />
                <Verify2FA onSuccess="/editProfile" />
              </>
            )}
            <Button
              variant="outlined"
              onClick={handleBack}
              sx={{
                mt: 2,
                width: '100%',
                borderRadius: 0,
                boxShadow: 3,
                '&:hover': { backgroundColor: 'secondary.main' },
                height: '48px',
              }}
            >
              Back
            </Button>
          </Box>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message={error}
      />
    </>
  );
}

export default Generate2FA;
