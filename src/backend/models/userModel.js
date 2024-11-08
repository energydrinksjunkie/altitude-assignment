const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String},
    dateOfBirth: { type: Date},
    profilePicture: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    twoFactorMethod: { type: String, enum: ['app', 'email', 'none'], default: 'none' },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
    registerSource: { type: String, enum: ['local', 'google'], default: 'local' },
});

const User = mongoose.model('User', userSchema);

module.exports = User;