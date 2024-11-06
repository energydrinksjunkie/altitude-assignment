const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

async function sendVerificationEmail(user) {
    try {
        const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5m' });
    
        // const verificationLink = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;
        const verificationLink = `${process.env.BASE_URL}/api/users/verify/${verificationToken}`;
        const resend = `${process.env.BASE_URL}/api/users/resendVerificationEmail/${user.email}`;

        const emailTemplate = await ejs.renderFile(
        path.join(__dirname, '../templates/verificationEmail.ejs'), 
        { firstName: user.firstName, verificationLink: verificationLink, resend: resend });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Verify your email',
            html: emailTemplate,
        };

        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:' + user.email);
    }
    catch (error) {
        console.error(error);
    }
}

async function sendPasswordResetEmail(user) {
    try {
        const passwordResetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5m' });
    
        // const passwordResetLink = `${process.env.FRONTEND_URL}/resetPassword/${passwordResetToken}`;
        const passwordResetLink = `${process.env.BASE_URL}/api//users/forgotPasswordVerify/${passwordResetToken}`;
        const resend = `${process.env.BASE_URL}/api//users/resendForgotPassword/${user.email}`;

        const emailTemplate = await ejs.renderFile(
        path.join(__dirname, '../templates/passwordEmail.ejs'), 
        { firstName: user.firstName, passwordResetLink: passwordResetLink, resend: resend });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Reset your password',
            html: emailTemplate,
        };

        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:' + user.email);
    }
    catch (error) {
        console.error(error);
    }
}

module.exports = { sendVerificationEmail };