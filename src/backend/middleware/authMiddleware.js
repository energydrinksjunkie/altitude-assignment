const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    try {
        if (!token) {
            throw new Error('Authentication failed');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.id});
        
        if (!user) {
            throw new Error('Authentication failed');
        }

        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
};

const authAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            throw new Error('Authentication failed');
        }
        next();
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
};

module.exports = { auth, authAdmin };