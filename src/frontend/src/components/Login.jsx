import { useState } from 'react';
import { Box, TextField, Link, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
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
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };
    

    return (
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
              }}

            >
                <Typography 
                variant="h5" 
                component="h1" 
                gutterBottom>
                    Login
                    </Typography>
            <TextField 
                id="email" 
                label="Email" 
                margin="normal" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                />
            <TextField 
                id="password" 
                label="Password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                />
                <Typography color="error">{error}</Typography>
            <Button 
            type="submit" 
            variant="outlined" 
            sx = {{ mb: 2, mt: 2 }}
            >
                Login
                </Button>
            <Link href="/register">Don't have an account?</Link>
        </Box>
    )
}
export default Login