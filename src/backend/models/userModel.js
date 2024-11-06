const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String},
    dateOfBirth: { type: Date, required: true },
    profilePicture: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);
module.exports = User;