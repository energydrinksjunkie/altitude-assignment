import { useState } from 'react';
import { Box, TextField, Link, Button, Typography, Divider, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GoogleLoginComponent from './GoogleLogin';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('error');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, { 
                email, 
                password
            });

            if (response.data.twoFactorAuthRequired) {
                localStorage.setItem('tempToken', response.data.token);
                navigate('/verify2fa');
            } else if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/');
                showSnackbar('Login successful!', 'success');
            } else {
                showSnackbar('Invalid credentials. Please try again.', 'error');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                showSnackbar(err.response.data.error, 'error');
            } else {
                showSnackbar('An unexpected error occurred. Please try again.', 'error');
            }
        }
    };

    const showSnackbar = (message, type) => {
        setAlertMessage(message);
        setAlertType(type);
        setOpenSnackbar(true);

        setTimeout(() => {
            setOpenSnackbar(false);
        }, 3000);
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
                    sx={{ 
                        textAlign: 'center', 
                        color: 'text.primary'
                    }}
                >
                    Login
                </Typography>

                <TextField 
                    id="email" 
                    label="Email" 
                    margin="normal" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    fullWidth
                />

                <TextField 
                    id="password" 
                    label="Password" 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    fullWidth
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Link href="/forgotPassword" variant="body2">
                        Forgot password?
                    </Link>
                    <Link href="/register" variant="body2">
                        Don't have an account?
                    </Link>
                </Box>

                <Button 
                    type="submit" 
                    variant="outlined" 
                    sx={{ mb: 2, mt: 2, width: '100%' }}
                >
                    Login
                </Button>

                <Divider sx={{ width: '100%', mb: 2, color: 'text.primary' }}>OR</Divider>

                <GoogleLoginComponent />
            </Box>
        </>
    )
}

export default Login;
