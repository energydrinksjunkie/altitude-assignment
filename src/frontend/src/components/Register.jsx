import { useState } from 'react';
import { Box, TextField, Link, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

function Login() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!emailRegex.test(email)) {
            setError('Invalid email format');
            return;
        }

        if (!passwordRegex.test(password)) {
            setError('Password must be at least 8 characters, with at least one letter and one number');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!dateOfBirth) {
            setError('Date of birth is required');
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
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Something went wrong, please try again later.');
            }
        }
    };


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                    Register
                    </Typography>
                    <TextField
                    required 
                id="firstName" 
                label="First name" 
                margin="normal" 
                value={firstName} 
                onChange={e => setFirstName(e.target.value)}
                />
                <TextField 
                required
                id="lastName" 
                label="Last name" 
                margin="normal" 
                value={lastName} 
                onChange={e => setLastName(e.target.value)}
                />
            <DatePicker id="dateOfBirth"
            margin="normal"
              label="Date of birth" 
              value={dateOfBirth ? dayjs(dateOfBirth) : null} 
                onChange={(newValue) => setDateOfBirth(newValue)}
               />
            <TextField 
                id="email" 
                label="Email" 
                margin="normal" 
                required
                value={email} 
                onChange={e => setEmail(e.target.value)}
                />
            <TextField 
                required
                id="password" 
                label="Password" 
                type="password" 
                margin="normal"
                value={password} 
                onChange={e => setPassword(e.target.value)}
                />
                <TextField
                required 
                id="confirmPassword" 
                label="Confirm password" 
                type="password" 
                margin="normal"
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)}
                />
                <Typography color="error">{error}</Typography>
                <Typography color="success">{message}</Typography>
            <Button 
            type="submit" 
            variant="outlined" 
            sx = {{ mb: 2, mt: 2 }}
            >
                Register
                </Button>
            <Link href="/login">Already have an account?</Link>
        </Box>
        </LocalizationProvider>
    )
}
export default Login