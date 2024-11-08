import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function GoogleLoginComponent() {
  const navigate = useNavigate();

  const handleLoginSuccess = async (response) => {
    try {
      const { credential } = response;
      const responseData = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/google`, {
        token: credential,
      });

      if (responseData.data.twoFactorAuthRequired) {
        localStorage.setItem('tempToken', responseData.data.token);
        navigate('/verify2fa');
      } else if (responseData.data.token) {
        localStorage.setItem('token', responseData.data.token);
        navigate('/');
      }
    } catch (error) {
      console.error('Google login failed', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleLoginFailure = (error) => {
    console.error('Google login error', error);
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
        useOneTap
      />
    </div>
  );
}

export default GoogleLoginComponent;
