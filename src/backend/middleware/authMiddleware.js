const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async (req, res, next) => {
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;

    if (!token) {
        return res.status(401).json({ error: 'Authentication failed' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.id });
        
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};

const authAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(401).json({ error: 'Authorization failed' });
        }
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authorization failed' });
    }
};

module.exports = { auth, authAdmin };
