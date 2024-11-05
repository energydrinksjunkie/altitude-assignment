const express = require('express');
const bycrypt = require('bcrypt');
const User = require('../models/userModel');
const router = express.Router();
const jwt = require('jsonwebtoken');
const upload = require('../middleware/uploadMiddleware');
const auth = require('../middleware/authMiddleware');

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, dateOfBirth } = req.body;
        const user = new User({
            firstName,
            lastName,
            email,
            password: await bycrypt.hash(password, 10),
            dateOfBirth,
        });
        await user.save();
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

module.exports = router;