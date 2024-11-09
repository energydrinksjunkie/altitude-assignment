import React from 'react';
import { jwtDecode } from 'jwt-decode';
import Welcome from './Welcome';
import WelcomeDefault from './WelcomeDefault';
import UsersList from './UsersList';

const Home = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <WelcomeDefault />;
    }

    try {
        const decoded = jwtDecode(token);
        
        if (decoded.role === 'admin') {
            return <UsersList />;
        } else {
            return <Welcome />;
        }
    } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem('token');
        return <p>You have been logged out. Please log in again.</p>;
    }
};

export default Home;
