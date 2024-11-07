import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, TextField, Button, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function EditProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [file, setFile] = useState(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
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
      // Convert the dateOfBirth to a format that input[type="date"] expects: YYYY-MM-DD
      const formattedDateOfBirth = response.data.dateOfBirth
        ? new Date(response.data.dateOfBirth).toISOString().split('T')[0]
        : '';
      setProfile({
        ...response.data,
        dateOfBirth: formattedDateOfBirth,
      });
      setTwoFactorEnabled(response.data.twoFactorEnabled);
    } catch (err) {
      setError('Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      await handleProfilePictureUpload(selectedFile);
    }
  };

  const handleProfilePictureUpload = async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const token = localStorage.getItem('token');
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/uploadProfilePicture`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Profile picture updated successfully!');
      fetchProfile(token);
    } catch (err) {
      setError('Error uploading profile picture');
    }
  };

  const handleProfileUpdate = async () => {
    const { firstName, lastName, email, dateOfBirth } = profile;
    const token = localStorage.getItem('token');

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/updateProfile`, {
        firstName,
        lastName,
        email,
        dateOfBirth,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Error updating profile');
    }
  };

  const handlePasswordChange = async () => {
    const token = localStorage.getItem('token');

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/changePassword`, {
        currentPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Password updated successfully!');
    } catch (err) {
      setError('Error changing password');
    }
  };

  const toggleTwoFactor = async () => {
    const token = localStorage.getItem('token');
    
    if (!twoFactorEnabled) {
      navigate('/generate2fa');
    } else {
      try {
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/disableTwoFactorAuth`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTwoFactorEnabled(false);
        setSuccess('Two-Factor Authentication has been disabled.');
      } catch (err) {
        setError('Error disabling Two-Factor Authentication');
      }
    }
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
      {success && <Alert severity="success">{success}</Alert>}

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
            src={profile.profilePicture || '/default-avatar.png'}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Button
            variant="outlined"
            component="label"
            sx={{ mb: 2 }}
          >
            Upload New Picture
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>

          <TextField
            label="First Name"
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            sx={{ mb: 2 }}
            fullWidth
          />
          <TextField
            label="Last Name"
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            sx={{ mb: 2 }}
            fullWidth
          />
          <TextField
            label="Email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            sx={{ mb: 2 }}
            fullWidth
          />
          <TextField
            label="Date of Birth"
            type="date"
            value={profile.dateOfBirth}
            onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
            sx={{ mb: 2 }}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <Button
            variant="outlined"
            onClick={handleProfileUpdate}
            sx={{ mb: 2 }}
          >
            Update Profile
          </Button>

          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            sx={{ mb: 2 }}
            fullWidth
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
            fullWidth
          />
          <Button
            variant="outlined"
            onClick={handlePasswordChange}
            sx={{ mb: 2 }}
          >
            Change Password
          </Button>

          <Typography variant="body2">
            Two-Factor Authentication is {twoFactorEnabled ? 'Enabled' : 'Disabled'}
          </Typography>
          <Button
            variant="outlined"
            onClick={toggleTwoFactor}
            sx={{ mt: 2 }}
          >
            {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default EditProfile;
