const express = require('express');
const bycrypt = require('bcrypt');
const User = require('../models/userModel');
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const upload = require('../middleware/uploadMiddleware');
const passport = require('passport');
const { auth, authAdmin } = require('../middleware/authMiddleware');
const {sendVerificationEmail, sendPasswordResetEmail, sendTwoFactorCodeEmail} = require('../services/emailService');

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
        const { email, password, token } = req.body;
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
        if(user.twoFactorAuthEnabled) {
            if (!token) {
                return res.status(200).json({ message: 'Two factor authentication required', twoFactorAuthRequired: true });
            }
            const isVerified = speakeasy.totp.verify({
                secret: user.twoFactorAuthSecret,
                encoding: 'base32',
                token: token
            });

            if (!isVerified) {
                throw new Error('Invalid token');
            }
        }

        const jwtToken = jwt.sign( { id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token: jwtToken });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), (req, res) => {
    if(req.user.twoFactorEnabled) {
        return res.status(200).json({ message: 'Two factor authentication required', twoFactorAuthRequired: true });
    }
    const token = jwt.sign( { id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token: token });
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
    const { isVerified, name, fromDate, toDate } = req.query;
    
    try {
        let query = {};

        if (isVerified === 'true') {
            query.isVerified = isVerified;
        } else if (isVerified === 'false') {
            query.isVerified = false;
        }

        if (name) {
            query.$or = [
                { firstName: { $regex: name, $options: 'i' } },
                { lastName: { $regex: name, $options: 'i' } }
            ];
        }

        if (fromDate || toDate) {
            query.dateOfBirth = {};
            if (fromDate) {
                query.dateOfBirth.$gte = new Date(fromDate);
            }
            if (toDate) {
                query.dateOfBirth.$lte = new Date(toDate);
            }
        }

        const users = await User.find(query).select('-password -twoFactorSecret');

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

router.get('/generateTwoFactorAuthApp', auth, async (req, res) => {
    try {
        const secret = speakeasy.generateSecret({ length: 20 });

        req.user.twoFactorSecret = secret.base32;
        req.user.twoFactorMethod = 'app';
        await req.user.save();

        QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
            if (err) return res.status(400).json({ error: err.message });
            res.status(200).json({ qrCode: data_url });
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/generateTwoFactorAuthEmail', auth, async (req, res) => {
    try {
        const code = Math.floor(100000 + Math.random() * 900000);
        req.user.twoFactorSecret = code.toString();
        req.user.twoFactorMethod = 'email';

        sendTwoFactorCodeEmail(req.user, code);

        await req.user.save();
        res.status(200).json({ message: '2FA code sent successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/verifyTwoFactorAuth', auth, async (req, res) => {
    try {
        const { token } = req.body;

        if(req.user.twoFactorMethod === 'app') {
            const isVerified = speakeasy.totp.verify({
                secret: req.user.twoFactorSecret,
                encoding: 'base32',
                token: token
            });
            if (!isVerified) {
                throw new Error('Invalid token');
            }
        } else if (req.user.twoFactorMethod === 'email') {
            if (token !== req.user.twoFactorSecret) {
                throw new Error('Invalid token');
            }
        }
        if(!req.user.twoFactorEnabled) {
            req.user.twoFactorEnabled = true;
            await req.user.save();
            res.status(200).json({ message: 'Two factor authentication enabled successfully' });
        }
        res.status(200).json({ message: 'Two factor authentication verified successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/disableTwoFactorAuth', auth, async (req, res) => {
    try {
        req.user.twoFactorEnabled = false;
        req.user.twoFactorMethod = 'none';
        await req.user.save();
        res.status(200).json({ message: 'Two factor authentication disabled successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;