# Altitude Task

The **Altitude Task** project is a job interview assignment that involves developing a web application for user management, including registration, profile management, and authentication features.

## Project Structure

- **Backend**: Located in `src/backend`, implemented in **Node.js**.
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
- **Speakeasy** and **QRCode**: For implementing two-factor authentication (2FA) using Google authenticator app.
- **Google Auth Library**: For Google OAuth integration.
- **Bcrypt.js**: For hashing user passwords to ensure secure storage.
- **Nodemailer**: For sending all types of emails, including verification, password reset, and 2FA codes.


For more details on the backend API endpoints, refer to the [BACKEND.md](docs/BACKEND.md) file in the repository.

---

## Frontend

The frontend, located in `src/frontend`, is built using ***React*** and **Vite**. The application provides an interface for users to register, log in, manage their profiles, and enable two-factor authentication (2FA). Admins also have access to a dashboard for managing users.

## Setup

1. Navigate to the frontend folder: `cd src/frontend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up `.env` file with following variables:
    ```bash
    VITE_BACKEND_URL='http://localhost:3000'
    VITE_GOOGLE_CLIENT_ID='your-google-client-id'
    ```
4. Run the server:
    ```bash
    npm run dev
    ```

### Key Features

1. **User Interface**: The frontend provides intuitive forms for:
    - **Registration**: Users can enter their first name, last name, email, date of birth, and password to create an account.
    - **Login**: Users can log in with their email and password. Google login integration is also supported.
    - **Profile Management**: Users can view and edit their profile details, including uploading a profile picture and changing their password.
    - **Two-Factor Authentication (2FA)**: Users can set up 2FA through an email code or an authenticator app.

2. **Authentication**: The frontend integrates with the backend to:
    - Handle login, registration, and profile management.
    - Support Google OAuth for login and account creation.

3. **2FA and Email Verification**:
    - Manages the two-factor authentication flow (email or authenticator app).
    - Handles email verification after user registration to ensure account validity.

4. **Admin Dashboard**: Admins have a special interface to manage user accounts, including:
    - Viewing user profiles.
    - Searching and filtering users by email, date of birth, and verification status.
    - Deleting user accounts.

- - -