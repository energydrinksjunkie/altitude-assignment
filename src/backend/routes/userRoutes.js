const express = require('express');
const bycrypt = require('bcrypt');
const User = require('../models/userModel');
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');
const upload = require('../middleware/uploadMiddleware');
const { auth, authAdmin } = require('../middleware/authMiddleware');
const {sendVerificationEmail, sendPasswordResetEmail} = require('../services/emailService');

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, dateOfBirth } = req.body;
        const user = new User({
            firstName,
            lastName,
            email,
            password: await bycrypt.hash(password, 10),
            dateOfBirth,
            profilePicture: path.join(__dirname, '../../public/uploads/default.png')
        });
        await user.save();
        
        await sendVerificationEmail(user);

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        const isMatch = await bycrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        if (!user.isVerified) {
            throw new Error('User is not verified');
        }
        if (user.isBlocked) {
            throw new Error('User is deleted');
        }
        const token = jwt.sign( { id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token: token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/uploadProfilePicture', auth, upload, async (req, res) => {
    try {
        req.user.profilePicture = req.file.path;
        await req.user.save();
        res.status(200).json({ message: 'Profile picture uploaded successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/changePassword', auth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const isMatch = await bycrypt.compare(oldPassword, req.user.password);
        if (!isMatch) {
            throw new Error('Current password is incorrect');
        }
        req.user.password = await bycrypt.hash(newPassword, 10);
        await req.user.save();
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/updateProfile', auth, async (req, res) => {
    try {
        const { firstName, lastName, dateOfBirth } = req.body;
        req.user.firstName = firstName;
        req.user.lastName = lastName;
        req.user.dateOfBirth = dateOfBirth;
        await req.user.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/getProfile', auth, async (req, res) => {
    try {
        res.status(200).json({ firstName: req.user.firstName, lastName: req.user.lastName, email: req.user.email, dateOfBirth: req.user.dateOfBirth, profilePicture: req.user.profilePicture });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/users', auth, authAdmin, async (req, res) => {
    const { isVerified } = req.query;
    
    try {
        let users;

        if (isVerified === 'true') {
            users = await User.find({ isVerified: true });
        } else if (isVerified === 'false') {
            users = await User.find({ isVerified: false });
        } else {
            users = await User.find();
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/deleteUser/:id', auth, authAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        user.isBlocked = true;
        await user.save();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error('User not found');
        }

        if (user.isVerified) {
            throw new Error('User is already verified');
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: 'User verified successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/resendVerificationEmail/:email', auth, async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        if (user.isVerified) {
            throw new Error('User is already verified');
        }

        await sendPasswordResetEmail(user);

        res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/forgotPasswordVerify/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new Error('User not found');
        }
        res.status(200).json({ message: 'User verified successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/resendForgotPassword/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        await sendPasswordResetEmail(user);
        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/forgotPassword', auth, async (req, res) => {
    try {
        const { password } = req.body;
        req.user.password = await bycrypt.hash(password, 10);
        await req.user.save();
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;