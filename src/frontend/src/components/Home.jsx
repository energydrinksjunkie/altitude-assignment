import React from 'react';
import { jwtDecode } from 'jwt-decode';
import Welcome from './Welcome';
import UsersList from './UsersList';

const Home = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <p>Hey, make an account to continue!</p>;
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
        return <p>Greška sa autentikacijom. Molimo vas pokušajte ponovo.</p>;
    }
};

export default Home;
