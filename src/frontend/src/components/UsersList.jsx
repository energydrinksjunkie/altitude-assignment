import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Avatar, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const [filters, setFilters] = useState({
        name: '',
        fromDate: '',
        toDate: '',
        isVerified: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            const { name, fromDate, toDate, isVerified } = filters;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    name,
                    fromDate,
                    toDate,
                    isVerified
                }
            });

            const filteredUsers = Array.isArray(response.data) ? response.data.filter(user => user.role !== 'admin') : [];
            setUsers(filteredUsers);
            setFilteredUsers(filteredUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleDeleteClick = (userId) => {
        setUserToDelete(userId);
        setOpenDeleteDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDeleteDialog(false);
        setUserToDelete(null);
    };

    const handleDeleteUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/users/deleteUser/${userToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            
            fetchUsers();
            handleCloseDialog();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Users List
            </Typography>

            {/* Filters Section */}
            <Box display="flex" gap={2} mb={2}>
                <TextField
                    label="Search by name"
                    variant="outlined"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    fullWidth
                />
                <TextField
                    label="From Date"
                    variant="outlined"
                    type="date"
                    name="fromDate"
                    value={filters.fromDate}
                    onChange={handleFilterChange}
                    fullWidth
                />
                <TextField
                    label="To Date"
                    variant="outlined"
                    type="date"
                    name="toDate"
                    value={filters.toDate}
                    onChange={handleFilterChange}
                    fullWidth
                />
                <TextField
                    label="Verified"
                    variant="outlined"
                    select
                    name="isVerified"
                    value={filters.isVerified}
                    onChange={handleFilterChange}
                    fullWidth
                    SelectProps={{
                        native: true,
                    }}
                >
                    <option value="">All</option>
                    <option value="true">Verified</option>
                    <option value="false">Unverified</option>
                </TextField>
            </Box>

            {/* Users List */}
            <Box display="flex" flexDirection="column" gap={2}>
                {filteredUsers.length === 0 ? (
                    <Typography>No users found.</Typography>
                ) : (
                    filteredUsers.map((user) => (
                        <Box
                            key={user._id}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            padding={2}
                            border={1}
                            borderRadius="8px"
                        >
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} />
                                <Typography variant="h6">
                                    {user.firstName} {user.lastName}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography>Email: {user.email}</Typography>
                                <Typography>Date of Birth: {new Date(user.dateOfBirth).toLocaleDateString()}</Typography>
                                <Typography>Status: {user.isVerified ? 'Verified' : 'Not Verified'}</Typography>
                            </Box>
                            <Box display="flex" gap={1}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleDeleteClick(user._id)}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Box>
                    ))
                )}
            </Box>

            {/* Delete confirmation dialog */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this user?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteUser} color="secondary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UsersList;
