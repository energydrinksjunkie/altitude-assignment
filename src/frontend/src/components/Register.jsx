import { useState } from 'react';
import { Box, TextField, Link, Button, Typography, Divider, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GoogleLoginComponent from './GoogleLogin';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      showSnackbar('Invalid email format', 'error');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters, with at least one letter and one number');
      showSnackbar('Password must be at least 8 characters, with at least one letter and one number', 'error');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      showSnackbar('Passwords do not match', 'error');
      return;
    }

    if (!dateOfBirth) {
      setError('Date of birth is required');
      showSnackbar('Date of birth is required', 'error');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, {
        firstName,
        lastName,
        dateOfBirth,
        email,
        password
      });

      if (response.data.message) {
        setMessage(response.data.message);
        showSnackbar(response.data.message, 'success', 5000);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError('Something went wrong.');
        showSnackbar('Something went wrong.', 'error');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        showSnackbar(err.response.data.error, 'error');
      } else {
        showSnackbar('Something went wrong, please try again later.', 'error');
      }
    }
  };

  const showSnackbar = (message, type, duration = 3000) => {
    setAlertMessage(message);
    setAlertType(type);
    setOpenSnackbar(true);

    setTimeout(() => {
      setOpenSnackbar(false);
    }, duration);
  };

  return (
    <>
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

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 400,
          mx: 'auto',
          mt: 4,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: 'background.paper',
        }}
      >
        <Typography 
          variant="h5" 
          component="h1" 
          gutterBottom
          sx={{ textAlign: 'center', color: 'text.primary' }}
        >
          Register
        </Typography>

        <TextField
          required
          id="firstName"
          label="First name"
          margin="normal"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          fullWidth
        />

        <TextField
          required
          id="lastName"
          label="Last name"
          margin="normal"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          fullWidth
        />
        <TextField
          required
          id="dateOfBirth"
          label="Date of birth"
          margin="normal"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          fullWidth
          slotProps={{
            inputLabel: {
            shrink: true,
            }
        }}
        />

        <TextField
          required
          id="email"
          label="Email"
          margin="normal"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
        />

        <TextField
          required
          id="password"
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
        />

        <TextField
          required
          id="confirmPassword"
          label="Confirm password"
          type="password"
          margin="normal"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          fullWidth
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Link href="/login" variant="body2" sx={{ color: 'text.secondary' }}>
            Already have an account?
          </Link>
        </Box>

        <Button 
          type="submit" 
          variant="outlined" 
          sx={{ mb: 2, mt: 2, width: '100%' }}
        >
          Register
        </Button>

        <Divider sx={{ width: '100%', mb: 2, color: 'text.primary' }}>OR</Divider>

        <GoogleLoginComponent />
      </Box>
    </>
  );
}

export default Register;
