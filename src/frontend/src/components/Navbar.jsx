import React from 'react';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    let isLoggedIn = false;
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            isLoggedIn = decodedToken && decodedToken.exp * 1000 > Date.now();
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    return (
        <AppBar position="sticky">
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                        Altitude Task
                    </Typography>
                </Box>
                <Box>
                <Button color="inherit" onClick={() => navigate('/')}>
                                Home
                            </Button>
                    {isLoggedIn ? (
                        <>
                            <Button color="inherit" onClick={handleProfile}>
                                My Profile
                            </Button>
                            <Button color="inherit" onClick={handleLogout}>
                                Log Out
                            </Button>
                        </>
                    ) : (
                        <Button color="inherit" onClick={handleLogin}>
                            Log In
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
