# Altitude Task

The **Altitude Task** project is a job interview assignment that involves developing a web application for user management, including registration, profile management, and authentication features.

## Project Structure

- **Backend**: Located in `src/backend`, implemented in Node.js.
- **Frontend**: Located in `src/frontend`, implemented in both **React+Vite**.

## Required Features

1. **User Registration and Login**: Users can register and log in with their email and password. Registration requires input of first name, last name, and date of birth.

2. **Profile Management**: 
   - Users can view and edit their profile information, including profile picture and password (with current password validation).
   - Admins have access to all user profiles but cannot create their own accounts (must be added manually).
   
3. **User Roles**:
   - **Admin**: Can view and delete user accounts, and can filter or search users by email, date of birth, and verification status.
   - **Regular User**: Has access to only their profile data.

4. **Notification for Deleted Users**: Users whose accounts are deleted are notified upon their next login attempt.

5. **Bonus Features**:
   - **Google Login** integration.
   - **Email Verification**: After registration, users receive an email to verify their account.
   - **Two-Factor Authentication (2FA)**: Option for 2FA using either email or an authenticator app.

---

## Backend

The backend API, implemented in Node.js, handles user management and security features.

### Setup

1. Navigate to the backend folder: `cd src/backend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up `.env` file with following variables:
    ```bash
    PORT=3000
    JWT_SECRET='secret'
    MONGO_URI='mongodb://localhost:27017/altitude'
    EMAIL_HOST='smtp.gmail.com'
    EMAIL_PORT=587
    EMAIL_USER='your-email@example.com'
    EMAIL_PASSWORD='your-email-password'
    BASE_URL='http://localhost:3000'
    GOOGLE_CLIENT_ID='your-google-client-id'
    GOOGLE_CLIENT_SECRET='your-google-client-secret'
    GOOGLE_CALLBACK_URL='/api/users/google/callback'
    ```
4. Run the server:
    ```bash
    npm start
    ```

### Dependencies

The backend uses the following dependencies:

- **Express.js**: For API routing and handling HTTP requests.
- **Mongoose**: For MongoDB object modeling and database operations.
- **JWT**: For secure token-based authentication.
- **Speakeasy** and **QRCode**: For implementing two-factor authentication (2FA) using either an authenticator app or email.
- **Passport.js**: For Google OAuth integration.
- **Bcrypt.js**: For hashing user passwords to ensure secure storage.
- **Nodemailer**: For sending verification and password reset emails.

---

## Frontend

The frontend, built using **React**, is located in `src/frontend` and fully integrated with the backend to handle user management and administrative tasks. The key features implemented include:

1. **User Interface**: Provides intuitive forms for registration, login, profile management, and 2FA setup.
2. **Authentication**: Seamlessly integrates with backend endpoints to support login, registration, and Google OAuth for a smooth user experience.
3. **2FA and Email Verification**: Manages two-factor authentication and email verification flows, ensuring secure user access.
4. **Admin Dashboard**: Includes an interface for admins to manage users efficiently, featuring filters, search options, and user account deletion controls.

- - -