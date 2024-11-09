# Backend API Documentation

All API routes are prefixed with `/api/users/` except for `/upload/:fileName`, which is used to serve user profile pictures from the static folder.

## Table of Contents
- [Auth Routes](#auth-routes)
- [User Management Routes](#user-management-routes)
- [Two-Factor Authentication (2FA) Routes](#two-factor-authentication-2fa-routes)

---

## Auth Routes

### Register
**POST** `/register`  
**Request**:  
Creates a new user and sends a verification email.

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "dateOfBirth": "YYYY-MM-DD"
}
```

**Response**:  
```json
{
  "message": "User created successfully. Check your email."
}
```

---

### Login
**POST** `/login`  
**Request**:  
Authenticates the user with email and password.

```json
{
  "email": "string",
  "password": "string"
}
```

**Response**:  
```json
{
  "message": "Two factor authentication required",
  "twoFactorAuthRequired": true,
  "token": "temporaryToken"
}
```

```json
{
  "token": "jwtToken"
}
```

---

### Google Login
**POST** `/google`  
**Request**:  
Authenticates a user through Google.

```json
{
  "token": "googleIdToken"
}
```

**Response**:  
```json
{
  "token": "jwtToken"
}
```

---

## User Management Routes

### Upload Profile Picture
**POST** `/uploadProfilePicture`  
**Request**:  
Uploads a new profile picture.

```json
{
  "profilePicture": "file"
}
```

**Response**:  
```json
{
  "message": "Profile picture uploaded successfully"
}
```

---

### Change Password
**POST** `/changePassword`  
**Request**:  
Allows a user to change their password.

```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response**:  
```json
{
  "message": "Password changed successfully"
}
```

---

### Update Profile
**PUT** `/updateProfile`  
**Request**:  
Updates user's profile details.

```json
{
  "firstName": "string",
  "lastName": "string",
  "dateOfBirth": "YYYY-MM-DD"
}
```

**Response**:  
```json
{
  "message": "Profile updated successfully"
}
```

---

### Get Profile
**GET** `/getProfile`  
**Request**:  
Retrieves user's profile information.

**Response**:  
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "dateOfBirth": "YYYY-MM-DD",
  "profilePicture": "string",
  "twoFactorEnabled": "boolean"
}
```

---

### Get Users (Admin)
**GET** `/users`  
**Request**:  
Retrieves a list of non-admin users (admin access required).

Optional query parameters:
- `isVerified` (optional): Filter by verification status.
- `name` (optional): Search by name.
- `fromDate` and `toDate` (optional): Filter by date of birth range.

**Response**:  
```json
[
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "dateOfBirth": "YYYY-MM-DD"
  }
]
```

---

### Delete User (Admin)
**DELETE** `/deleteUser/:id`  
**Request**:  
Marks a user as blocked (admin access required).

**Response**:  
```json
{
  "message": "User deleted successfully"
}
```

---

## Profile Picture Retrieval

### Get Profile Picture
**GET** `/upload/:fileName`  
**Request**:  
Retrieves a user's profile picture from the static folder.

**Response**:  
```json
{
  "profilePicture": "image file"
}
```

---

## Two-Factor Authentication (2FA) Routes

### Enable 2FA
**POST** `/enable2FA`  
**Request**:  
Enables two-factor authentication for the user.

```json
{
  "message": "Two-factor authentication enabled successfully"
}
```

**Response**:  
```json
{
  "message": "Two-factor authentication enabled successfully"
}
```

---

### Verify 2FA
**POST** `/verify2FA`  
**Request**:  
Verifies the 2FA code sent to the user.

```json
{
  "code": "string"
}
```

**Response**:  
```json
{
  "message": "2FA verification successful"
}
```

---

### Disable 2FA
**POST** `/disable2FA`  
**Request**:  
Disables two-factor authentication for the user.

```json
{
  "message": "Two-factor authentication disabled successfully"
}
```

**Response**:  
```json
{
  "message": "Two-factor authentication disabled successfully"
}
```
