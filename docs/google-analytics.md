# Google Analytics Integration

This document outlines the Google Analytics (GA4) integration, enabling robust user engagement and application performance tracking.

## Overview

The application is integrated with Google Analytics 4 using the `react-ga4` library. This setup provides automatic page view tracking and a simple API for tracking custom events. Tracking is only active in the production environment to keep development data clean.

## Core Components

### 1. **Analytics Utility**
- **File**: `src/utils/analytics.ts`
- **Description**: This utility encapsulates all Google Analytics logic.
- **Functions**:
    - `initGA()`: Initializes the GA4 library with your Measurement ID.
    - `trackPageView(path)`: Sends a `page_view` event for the specified path.
    - `trackEvent(...)`: Sends a custom event with a category, action, label, and value.

### 2. **Root Layout for Tracking**
- **File**: `src/layouts/RootLayout.tsx`
- **Description**: A new top-level layout that wraps all other routes.
- **Functionality**: It contains a `useEffect` hook that listens for route changes via `useLocation` and calls `trackPageView` automatically. This ensures that all page navigations are tracked.

### 3. **Custom `useAnalytics` Hook**
- **File**: `src/hooks/useAnalytics.ts`
- **Description**: A simple hook that provides a consistent way to track custom events from any component.
- **Functionality**:
    - `trackCustomEvent(category, action, label, value)`: An easy-to-use wrapper around the `trackEvent` utility.

## Configuration

To enable Google Analytics, you must configure your **GA Measurement ID**.

### **Step 1: Obtain a GA Measurement ID**

1.  Go to the [Google Analytics](https://analytics.google.com/) dashboard.
2.  Create a new GA4 property or select an existing one.
3.  Navigate to **Admin > Data Streams** and select your web stream.
4.  You will find your **Measurement ID** (e.g., `G-XXXXXXXXXX`) in the stream details.

### **Step 2: Configure the Measurement ID in Your Application**

1.  Open the `src/config.ts` file.
2.  Find the `GA_MEASUREMENT_ID` variable.
3.  Replace the placeholder `"G-XXXXXXXXXX"` with the actual Measurement ID you obtained from Google Analytics.

```typescript
// src/config.ts
const config = {
  // ...
  GA_MEASUREMENT_ID: "G-YOUR_ACTUAL_ID",
  // ...
};
```

## How to Use

### **Automatic Page View Tracking**
Page view tracking is fully automatic. No further action is required. Every time a user navigates to a new page, a `page_view` event will be sent to Google Analytics.

### **Custom Event Tracking**
To track custom events, such as button clicks or form submissions, use the `useAnalytics` hook.

**Example: Tracking a button click**

```javascript
import { useAnalytics } from '@/hooks/useAnalytics';

const MyComponent = () => {
  const { trackCustomEvent } = useAnalytics();

  const handleClick = () => {
    trackCustomEvent(
      'User Interaction', // Category
      'Button Click',     // Action
      'Learn More Button' // Label (optional)
    );
    // ... other button logic
  };

  return <button onClick={handleClick}>Learn More</button>;
};
```

## Important Notes

- **Production Only**: All analytics tracking is disabled in the development environment to prevent your test data from polluting your production analytics.
- **Data Privacy**: Be mindful of the data you send to Google Analytics. Avoid sending any personally identifiable information (PII).

This integration provides a powerful and easy-to-use system for monitoring your application's usage and performance. 