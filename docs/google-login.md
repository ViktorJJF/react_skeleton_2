# Google Login Implementation

This document provides a comprehensive guide to the Google Login functionality implemented in the application.

## Overview

The application now supports user authentication via Google, providing a secure and convenient way for users to sign in. This implementation uses the `@react-oauth/google` library to handle the OAuth 2.0 flow.

## Core Components

### 1. **Google OAuth Provider**
- **File**: `src/main.tsx`
- **Description**: The entire application is wrapped with the `GoogleOAuthProvider`, which provides the necessary context for Google authentication to work. It is configured with a `clientId` from the application's configuration.

### 2. **Google Login Button**
- **File**: `src/components/auth/GoogleLoginButton.tsx`
- **Description**: A dedicated, reusable component that encapsulates the entire Google login flow.
- **Functionality**:
    - Initiates the Google login process when clicked.
    - On success, it fetches the user's profile (name, email, picture) from Google.
    - It then updates the application's authentication state via the `authStore`.
    - Provides user feedback (success or error toasts) using the `useNotifications` hook.

### 3. **Authentication Store Integration**
- **File**: `src/store/authStore.ts`
- **Description**: The Zustand `authStore` has been updated to store a complete user object, including `name`, `email`, and `avatar`.
- **`login` Action**: The `login` action now accepts a user object, allowing it to handle richer user data from various authentication sources.

### 4. **Login View Integration**
- **File**: `src/views/LoginView.tsx`
- **Description**: The `GoogleLoginButton` has been added to the main login page, providing users with a clear option to sign in with Google.

## Configuration

To enable Google Login, you must configure your **Google Client ID**.

### **Step 1: Obtain a Google Client ID**

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project or select an existing one.
3.  Navigate to **APIs & Services > Credentials**.
4.  Click **Create Credentials > OAuth client ID**.
5.  Select **Web application** as the application type.
6.  Under **Authorized JavaScript origins**, add your application's domain (e.g., `http://localhost:4040` for development, `https://your-domain.com` for production).
7.  Under **Authorized redirect URIs**, add your application's domain with `/` at the end (e.g. `http://localhost:4040/`).
8.  Click **Create**. You will be provided with a **Client ID**.

### **Step 2: Configure the Client ID in Your Application**

1.  Open the `src/config.ts` file.
2.  Find the `GOOGLE_CLIENT_ID` variable.
3.  Replace the placeholder `"YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"` with the actual Client ID you obtained from the Google Cloud Console.

```typescript
// src/config.ts
const config = {
  // ...
  GOOGLE_CLIENT_ID: "YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com",
  // ...
};
```

## Important Notes

-   **Security**: In a production environment, the access token received from Google should be sent to your backend server. Your backend should then verify the token with Google, create a session, and return a secure, http-only cookie or a JWT to the client. The current implementation simulates this flow on the client side for demonstration purposes.
-   **Error Handling**: The `GoogleLoginButton` includes basic error handling and will display a toast notification if the login process fails.

This implementation provides a solid foundation for Google authentication in your application. Remember to follow best practices for security and user data handling in a production environment. 