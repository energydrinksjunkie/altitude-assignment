# API Endpoints - /api/users

## POST /register
- **Description**: Register a new user.
- **Request Body**:
  - `firstName`: User's first name
  - `lastName`: User's last name
  - `email`: User's email
  - `password`: User's password
  - `dateOfBirth`: User's date of birth
- **Response**: 
  - `201 Created`: User created successfully and verification email sent.
  - `400 Bad Request`: Validation or other errors.

## POST /login
- **Description**: User login with email, password, and an optional 2FA token.
- **Request Body**:
  - `email`: User's email
  - `password`: User's password
  - `token`: Optional 2FA token
- **Response**: 
  - `200 OK`: JWT token.
  - `400 Bad Request`: Invalid credentials or other errors.

## GET /google
- **Description**: Redirect to Google OAuth login.
- **Response**: Redirect to Google OAuth.

## GET /google/callback
- **Description**: Google OAuth callback to authenticate the user.
- **Response**: 
  - `200 OK`: JWT token.
  - `401 Unauthorized`: If authentication fails.

## POST /uploadProfilePicture
- **Description**: Upload a new profile picture.
- **Request Body**: Multipart file upload
- **Response**: 
  - `200 OK`: Profile picture uploaded successfully.
  - `400 Bad Request`: File upload error.

## POST /changePassword
- **Description**: Change the user's password.
- **Request Body**:
  - `oldPassword`: Current password
  - `newPassword`: New password
- **Response**: 
  - `200 OK`: Password changed successfully.
  - `400 Bad Request`: Incorrect current password or other errors.

## PUT /updateProfile
- **Description**: Update user's profile details.
- **Request Body**:
  - `firstName`: Updated first name
  - `lastName`: Updated last name
  - `dateOfBirth`: Updated date of birth
- **Response**: 
  - `200 OK`: Profile updated successfully.
  - `400 Bad Request`: Validation errors.

## GET /getProfile
- **Description**: Get the user's profile details.
- **Response**: 
  - `200 OK`: Profile details.
  - `400 Bad Request`: Error retrieving profile.

## GET /users
- **Description**: Get a list of users with optional filters.
- **Query Params**: 
  - `isVerified`: Optional filter (`true` or `false`)
- **Response**: 
  - `200 OK`: List of users.

## DELETE /deleteUser/:id
- **Description**: Delete a user by ID (admin only).
- **Response**: 
  - `200 OK`: User deleted successfully.
  - `400 Bad Request`: User not found or unauthorized action.

## GET /verify/:token
- **Description**: Verify user email with the provided token.
- **Response**: 
  - `200 OK`: User verified successfully.
  - `400 Bad Request`: Invalid or expired token.

## GET /resendVerificationEmail/:email
- **Description**: Resend verification email to the user.
- **Response**: 
  - `200 OK`: Verification email resent successfully.
  - `400 Bad Request`: User not found or already verified.

## GET /forgotPasswordVerify/:token
- **Description**: Verify the user's forgot password token.
- **Response**: 
  - `200 OK`: Token is valid.
  - `400 Bad Request`: Invalid or expired token.

## GET /resendForgotPassword/:email
- **Description**: Resend the forgot password reset email.
- **Response**: 
  - `200 OK`: Password reset email resent.
  - `400 Bad Request`: User not found.

## POST /forgotPassword
- **Description**: Reset the user's password.
- **Request Body**:
  - `password`: New password
- **Response**: 
  - `200 OK`: Password reset successfully.
  - `400 Bad Request`: Validation errors.

## GET /generateTwoFactorAuthApp
- **Description**: Generate a 2FA QR code for an authenticator app.
- **Response**: 
  - `200 OK`: QR code for 2FA setup.
  - `400 Bad Request`: Error generating QR code.

## GET /generateTwoFactorAuthEmail
- **Description**: Generate a 2FA code sent via email.
- **Response**: 
  - `200 OK`: 2FA code sent successfully.
  - `400 Bad Request`: Error generating 2FA code.

## POST /verifyTwoFactorAuth
- **Description**: Verify the 2FA token.
- **Request Body**:
  - `token`: 2FA token
- **Response**: 
  - `200 OK`: 2FA verified successfully.
  - `400 Bad Request`: Invalid token.

## GET /disableTwoFactorAuth
- **Description**: Disable two-factor authentication for the user.
- **Response**: 
  - `200 OK`: 2FA disabled successfully.
  - `400 Bad Request`: Error disabling 2FA.
