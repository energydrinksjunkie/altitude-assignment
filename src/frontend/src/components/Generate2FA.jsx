import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, CircularProgress, Alert, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import axios from 'axios';
import Verify2FA from './Verify2FA';

function Generate2FA() {
  const [activeStep, setActiveStep] = useState(0);
  const [method, setMethod] = useState('email');
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.setItem('tempToken', response.data.token);
      } else {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/generateTwoFactorAuthApp`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.setItem('tempToken', response.data.token);
        setQrCode(response.data.qrCode);
      }

      setActiveStep(activeStep + 1);
    } catch (err) {
      setError('Failed to generate 2FA. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
          <Typography variant="h6">Select your 2FA Method</Typography>
          <RadioGroup value={method} onChange={handleMethodChange}>
            <FormControlLabel value="email" control={<Radio />} label="Email" />
            <FormControlLabel value="app" control={<Radio />} label="Google Authenticator (App)" />
          </RadioGroup>
          {loading ? (
            <CircularProgress />
          ) : (
            <Button variant="contained" onClick={handleNext} sx={{ mt: 2 }}>
              Next
            </Button>
          )}
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      )}

      {activeStep === 1 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
          <Typography variant="h6">Verify your 2FA</Typography>
          {method === 'email' ? (
            <Verify2FA onSuccess="/editProfile" />
          ) : (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Scan this QR code with Google Authenticator:
              </Typography>
              <img src={qrCode} alt="QR Code" style={{ width: '200px', height: '200px', marginBottom: '20px' }} />
              <Verify2FA onSuccess="/editProfile" />
            </>
          )}
          <Button variant="outlined" onClick={handleBack} sx={{ mt: 2 }}>
            Back
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Generate2FA;
