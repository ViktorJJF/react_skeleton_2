# Authentication Redirect Implementation

## Overview

This document describes the implementation of automatic login redirect when the `/me` endpoint returns unauthorized (401) responses.

## Features Implemented

### 1. API Client Interceptor Enhancement (`src/services/api/apiClient.ts`)

- **Special handling for `/me` endpoint**: When the `/me` endpoint returns 401, it immediately redirects to login without attempting token refresh
- **Improved error handling**: Different handling for different types of 401 responses
- **Session cleanup**: Automatically clears auth store and redirects with appropriate reason codes

### 2. Enhanced Auth Store (`src/store/authStore.ts`)

- **Comprehensive logout**: Clears all auth state including localStorage and sessionStorage
- **Better error handling**: Improved error handling in `autoLogin` function with proper typing
- **Session cleanup**: Removes all auth-related data from browser storage

### 3. Login View Enhancements (`src/views/LoginView.tsx`)

- **Redirect handling**: Processes URL parameters to show appropriate error messages
- **Return navigation**: Redirects users back to their original destination after login
- **User feedback**: Shows contextual error messages based on redirect reason

### 4. Translation Support

Added new translation keys for auth error messages:
- `auth.sessionExpired` / `auth.sessionExpiredMessage`
- `auth.tokenExpired` / `auth.tokenExpiredMessage`  
- `auth.accessDenied` / `auth.loginRequired`
- `auth.loginFailed`

### 5. Auth Redirect Hook (`src/hooks/auth/useAuthRedirect.ts`)

- **Reusable utility**: Hook for handling auth redirects throughout the app
- **Configurable options**: Support for different redirect reasons and custom messages
- **Toast notifications**: Automatic user feedback with appropriate messages

## Flow Diagram

```
User Request → API Call → 401 Response → Check Endpoint Type
                                              ↓
                                         Is /me endpoint?
                                              ↓
                                            YES → Immediate Redirect
                                              ↓
                                         Clear Auth Store
                                              ↓
                                         Redirect to Login
                                              ↓
                                         Show Error Message
                                              ↓
                                         User Logs In
                                              ↓
                                         Redirect to Original Page
```

## Error Handling Types

1. **Session Expired** (`session_expired`): When `/me` endpoint returns 401
2. **Token Expired** (`token_expired`): When refresh token fails
3. **Unauthorized** (`unauthorized`): General access denied

## URL Parameters

- `reason`: The type of auth error (session_expired, token_expired, unauthorized)
- `redirect`: The URL to redirect to after successful login

## Testing

To test the implementation:

1. **Manual Testing**:
   - Log in to the application
   - Manually expire the session in backend/database
   - Navigate to any protected route
   - Verify automatic redirect to login with appropriate message

2. **Browser Developer Tools**:
   - Intercept `/api/me` requests and return 401
   - Verify immediate redirect without refresh token attempt

3. **Storage Cleanup**:
   - Check that localStorage and sessionStorage are cleared
   - Verify no auth tokens remain after logout

## Security Considerations

- **Immediate cleanup**: Session data is cleared immediately on 401 from `/me`
- **No token leakage**: All auth-related storage is cleared comprehensively
- **Secure redirect**: Original URLs are properly encoded in redirect parameters
- **User feedback**: Clear messaging helps users understand why they were redirected

## Browser Compatibility

- Uses `window.location.href` for reliable cross-browser redirects
- Checks for `window` object availability for SSR compatibility
- Compatible with all modern browsers

## Future Enhancements

1. **Configurable redirect delays**: Add option for delayed redirects with countdown
2. **Session warning**: Warn users before session expires
3. **Multiple tab handling**: Coordinate auth state across browser tabs
4. **Offline handling**: Better handling of auth when offline
