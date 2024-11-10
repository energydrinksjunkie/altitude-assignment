const express = require('express');
const bycrypt = require('bcrypt');
const User = require('../models/userModel');
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const upload = require('../middleware/uploadMiddleware');
const { auth, authAdmin } = require('../middleware/authMiddleware');
const {sendVerificationEmail, sendPasswordResetEmail, sendTwoFactorCodeEmail} = require('../services/emailService');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

        res.status(201).json({ message: 'User created successfully. Check your email.' });
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
        if (user.registerSource === 'google' && !user.password) {
            throw new Error('Please login with Google');
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

        if (user.twoFactorEnabled) {
            const tempJwtToken = jwt.sign({ id: user._id, twoFactorAuthRequired: true }, process.env.JWT_SECRET, { expiresIn: '10m' });

            if (user.twoFactorMethod === 'email') {
                const code = Math.floor(100000 + Math.random() * 900000); // Generating 6-digit code
                user.twoFactorSecret = code.toString();
                await sendTwoFactorCodeEmail(user, code);
                await user.save();
            }

            return res.status(200).json({ 
                message: 'Two factor authentication required', 
                twoFactorAuthRequired: true, 
                token: tempJwtToken });
        }

        const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token: jwtToken });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log(payload);

        let user = await User.findOne({ email: payload.email });

        if (!user) {
            user = await User.create({
                firstName: payload.given_name,
                lastName: payload.family_name,
                email: payload.email,
                profilePicture: payload.picture,
                isVerified: true,
                password: null,
                registerSource: 'google',
                twoFactorEnabled: false,
            });
            await user.save();

            const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ token: jwtToken });
        }

        if (user.isBlocked) {
            return res.status(200).json({ error: 'User is blocked' });
        }

        if (user.twoFactorEnabled) {
            const tempJwtToken = jwt.sign({ id: user._id, twoFactorAuthRequired: true }, process.env.JWT_SECRET, { expiresIn: '10m' });

            if (user.twoFactorMethod === 'email') {
                const code = Math.floor(100000 + Math.random() * 900000);
                user.twoFactorSecret = code.toString();
                await sendTwoFactorCodeEmail(user, code);
                await user.save();
            }

            return res.status(200).json({ 
                message: 'Two factor authentication required', 
                twoFactorAuthRequired: true, 
                token: tempJwtToken
            });
        }

        
        const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.status(200).json({ token: jwtToken });
    } catch (error) {
        console.error("Error during Google login:", error);
        res.status(400).json({ error: 'Google authentication failed' });
    }
});

router.post('/uploadProfilePicture', auth, upload, async (req, res) => {
    try {
        req.user.profilePicture = `/uploads/${req.file.filename}`;
        await req.user.save();
        res.status(200).json({ message: 'Profile picture uploaded successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/changePassword', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const isMatch = await bycrypt.compare(currentPassword, req.user.password);
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
        const profilePicture = req.user.profilePicture.startsWith("https")
    ? req.user.profilePicture
    : process.env.BASE_URL + req.user.profilePicture;
        res.status(200).json({ firstName: req.user.firstName, lastName: req.user.lastName, email: req.user.email, dateOfBirth: req.user.dateOfBirth, profilePicture: profilePicture, twoFactorEnabled: req.user.twoFactorEnabled });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/users', auth, authAdmin, async (req, res) => {
    const { isVerified, name, fromDate, toDate } = req.query;
    
    try {
        let query = [{ $match: { isBlocked: false, role: { $ne: 'admin' } } }];
    
        if (isVerified === 'true') {
            query[0].$match.isVerified = true;
        } else if (isVerified === 'false') {
            query[0].$match.isVerified = false;
        }

        if (name) {
            query.push({
                $match: {
                    $or: [
                        {
                            $expr: {
                                $regexMatch: {
                                    input: { $concat: ["$firstName", " ", "$lastName"] },
                                    regex: name,
                                    options: 'i'
                                }
                            }
                        }
                    ]
                }
            });
        }

        if (fromDate || toDate) {
            query.push({
                $match: {
                    dateOfBirth: {}
                }
            });
            if (fromDate) {
                query[query.length - 1].$match.dateOfBirth.$gte = new Date(fromDate);
            }
            if (toDate) {
                query[query.length - 1].$match.dateOfBirth.$lte = new Date(toDate);
            }
        }

        query.push({
            $project: {
                password: 0, 
                twoFactorSecret: 0, 
                __v: 0, 
            }
        });

        const users = await User.aggregate(query);

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


router.post('/verify', async (req, res) => {
    try {
        const { token } = req.body;
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

router.post('/resendVerificationEmail/', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        if (user.isVerified) {
            throw new Error('User is already verified');
        }

        await sendVerificationEmail(user);

        res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/forgotPasswordVerify', async (req, res) => {
    try {
        const { token } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new Error('User not found');
        }
        const tempToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5m' });
        res.status(200).json({ message: 'User verified successfully', token: tempToken });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/resendForgotPassword/', async (req, res) => {
    try {
        const { email } = req.body;
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
        const tempJwtToken = jwt.sign({ id: req.user._id, twoFactorAuthRequired: true }, process.env.JWT_SECRET, { expiresIn: '10m' });

        QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
            if (err) return res.status(400).json({ error: err.message });
            res.status(200).json({ qrCode: data_url, token: tempJwtToken });
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

        await sendTwoFactorCodeEmail(req.user, code);

        await req.user.save();

        const tempJwtToken = jwt.sign({ id: req.user._id, twoFactorAuthRequired: true }, process.env.JWT_SECRET, { expiresIn: '10m' });
        res.status(200).json({ message: '2FA code sent successfully', token: tempJwtToken });
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

        if (!req.user.twoFactorEnabled) {
            req.user.twoFactorEnabled = true;
            await req.user.save();
            return res.status(200).json({ message: 'Two factor authentication enabled successfully' });
        }

        const tokenJwt = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Two factor authentication verified successfully', token: tokenJwt });

    } catch (error) {
        return res.status(400).json({ error: error.message });
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