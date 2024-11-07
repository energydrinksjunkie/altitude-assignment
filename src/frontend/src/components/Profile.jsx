import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Button, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile(token);
    } else {
      setError('No token found. Please log in again.');
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (token) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/getProfile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Profile response:', response);
      setProfile(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigate('/editProfile');
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
      }}
    >
      {error && <Alert severity="error">{error}</Alert>}
      {profile && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
            width: '300px',
            textAlign: 'center',
          }}
        >
          <Avatar
            
            src={profile.profilePicture || "../assets/default.png"}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h6">{profile.firstName} {profile.lastName}</Typography>
          <Typography variant="body2" color="text.secondary"> {dayjs(profile.dateOfBirth).format('YYYY-MM-DD')}</Typography>
          <Typography variant="body2" color="text.secondary">{profile.email}</Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={handleEditProfile}
          >
            Edit Profile
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Profile;