# API Documentation

## Register User
- **Endpoint**: `POST /api/users/register`
- **Description**: Registers a new user with the provided information.
- **Request Body**:
    ```json
    {
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "password": "string",
      "dateOfBirth": "date"
    }
    ```
- **Response**:
    - **201 Created**: 
    ```json
    {
      "message": "User created successfully"
    }
    ```
    - **400 Bad Request**:
    ```json
    {
      "error": "Error message"
    }
    ```

---

## Login User
- **Endpoint**: `POST /api/users/login`
- **Description**: Logs the user in with email and password, and optionally a 2FA token.
- **Request Body**:
    ```json
    {
      "email": "string",
      "password": "string",
      "token": "string (optional)"
    }
    ```
- **Response**:
    - **200 OK**:
    ```json
    {
      "token": "JWT token"
    }
    ```
    - **400 Bad Request**:
    ```json
    {
      "error": "Error message"
    }
    ```

---

## Upload Profile Picture
- **Endpoint**: `POST /api/users/uploadProfilePicture`
- **Description**: Allows the user to upload a profile picture.
- **Request Body**: `multipart/form-data` (file)
- **Response**:
    - **200 OK**:
    ```json
    {
      "message": "Profile picture uploaded successfully"
    }
    ```
    - **400 Bad Request**:
    ```json
    {
      "error": "Error message"
    }
    ```

---

## Change Password
- **Endpoint**: `POST /api/users/changePassword`
- **Description**: Allows the user to change their password.
- **Request Body**:
    ```json
    {
      "oldPassword": "string",
      "newPassword": "string"
    }
    ```
- **Response**:
    - **200 OK**:
    ```json
    {
      "message": "Password changed successfully"
    }
    ```
    - **400 Bad Request**:
    ```json
    {
      "error": "Error message"
    }
    ```

---

## Update Profile
- **Endpoint**: `PUT /api/users/updateProfile`
- **Description**: Updates the user's profile information.
- **Request Body**:
    ```json
    {
      "firstName": "string",
      "lastName": "string",
      "dateOfBirth": "date"
    }
    ```
- **Response**:
    - **200 OK**:
    ```json
    {
      "message": "Profile updated successfully"
    }
    ```
    - **400 Bad Request**:
    ```json
    {
      "error": "Error message"
    }
    ```

---

## Get Profile
- **Endpoint**: `GET /api/users/getProfile`
- **Description**: Retrieves the user's profile information.
- **Response**:
    - **200 OK**:
    ```json
    {
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "dateOfBirth": "date",
      "profilePicture": "string (URL)"
    }
    ```
    - **400 Bad Request**:
    ```json
    {
      "error": "Error message"
    }
    ```

---

## Users List (Admin)
- **Endpoint**: `GET /api/users/users`
- **Description**: Retrieves a list of users (Admin-only endpoint).
- **Query Parameters**:
    - `isVerified` (optional): Filter by verification status. Accepts `true` or `false`.
- **Response**:
    - **200 OK**:
    ```json
    [
      {
        "_id": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "isVerified": "boolean"
      }
    ]
    ```
    - **400 Bad Request**:
    ```json
    {
      "error": "Error message"
    }
    ```

---

## Delete User (Admin)
- **Endpoint**: `DELETE /api/users/deleteUser/:id`
- **Description**: Marks a user as deleted (Admin-only endpoint).
- **Parameters**:
    - `id` (URL parameter): The ID of the user to be deleted.
- **Response**:
    - **200 OK**:
    ```json
    {
      "message": "User deleted successfully"
    }
    ```
    - **400 Bad Request**:
    ```json
    {
      "error": "Error message"
    }
    ```

---

## Verify User Email
- **Endpoint**: `GET /api/users/verify/:token`
- **Description**: Verifies the user's email using the provided token.
- **Parameters**:
    - `token` (URL parameter): The token to verify the email.
- **Response**:
    - **200 OK**:
    ```json
    {
      "message": "User verified successfully"
    }
    ```
    - **400 Bad Request**:
    ```json
    {
      "error": "Error message"
    }
    ```

---

## Resend Verification Email
- **Endpoint**: `GET /api/users/resendVerificationEmail/:email`
- **Description**: Resends the verification email if the user hasn't verified their email yet.
- **Parameters**:
    - `email` (URL parameter): The email of the user.
- **Response**:
    - **200 OK**:
    ```json
    {
      "message": "Verification email sent successfully"
    }
    ```
    - **400 Bad Request**:
    ```json
    {
      "error": "Error message"
    }
    ```

---

## Forgot Password
- **Endpoint**: `POST /api/users/forgotPassword`
- **Description**: Allows the user to reset their password.
- **Request Body**:
    ```json
    {
      "password": "string"
    }
    ```
- **Response**:
    - **200 OK**:
    ```json
    {
      "message": "Password reset successfully"
    }
    ```
    - **400 Bad Request**:
    ```json
    {
      "error": "Error message"
    }
    ```

---

## Generate Two Factor Authentication (2FA)
- **Endpoint**: `GET /api/users/generateTwoFactorAuth`
- **Description**: Generates a 2FA secret and returns a QR code for the user to scan with their authenticator app.
- **Response**:
    - **200 OK**:
    ```json
    {
      "qrCode": "string (QR Code URL)"
    }
    ```
    - **400 Bad Request**:
    ```json
    {
      "error": "Error message"
    }
    ```

---

## Verify Two Factor Authentication (2FA)
- **Endpoint**: `POST /api/users/verifyTwoFactorAuth`
- **Description**: Verifies the user's 2FA token and enables 2FA on their account.
- **Request Body**:
    ```json
    {
      "token": "string"
    }
    ```
- **Response**:
    - **200 OK**:
    ```json
    {
      "message": "Two factor authentication enabled successfully"
    }
    ```
    - **400 Bad Request**:
    ```json
    {
      "error": "Error message"
    }
    ```
