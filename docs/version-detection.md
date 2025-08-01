# Automatic Version Detection

This document describes the automatic version detection system implemented in the application, designed to notify users when a new version is available.

## Overview

The system automatically checks for new application versions and notifies the user with a banner, prompting them to refresh the page. This ensures users are always on the latest version, reducing support issues and improving stability.

The core components of this system are:
1.  **A build-time version file (`version.json`)**
2.  **A custom hook (`useVersionCheck`)** for client-side checking
3.  **A banner notification** to alert the user

## Versioning Strategy

The application's version is managed in `package.json`. This version is considered the single source of truth.

-   **`src/config.ts`**: The version from `package.json` is imported and exposed as `APP_VERSION`.
-   **`public/version.json`**: A file containing the latest deployed version, generated at build time.

## Build Process

A `prebuild` script has been added to `package.json` to automate the generation of `version.json`.

-   **`scripts/generate-version.js`**: This Node.js script reads the version from `package.json` and writes it into `public/version.json` along with the build timestamp.
-   **`package.json`**:
    ```json
    "scripts": {
      "prebuild": "node scripts/generate-version.js",
      "build": "tsc -b && vite build",
    }
    ```
    This ensures that `version.json` is always up-to-date with each production build.

## Client-Side Checking

The `useVersionCheck` hook is the heart of the client-side detection mechanism.

### `useVersionCheck.ts`
- **Location**: `src/hooks/useVersionCheck.ts`
- **Functionality**:
    1.  Fetches `public/version.json` from the server periodically (every 5 minutes).
    2.  Compares the fetched `latestVersion` with the `currentVersion` (embedded in the app via `config.ts`).
    3.  If the versions do not match, it uses the `useNotifications` hook to dispatch an informational banner.

## Integration

The `useVersionCheck` hook is integrated into the `AdminLayout.tsx` component. This ensures that the version check is active on all authenticated pages of the application, running continuously in the background.

```javascript
// src/layouts/AdminLayout.tsx
import { useVersionCheck } from '@/hooks/useVersionCheck';

const AdminLayout = () => {
  useVersionCheck();

  return (
    // ... layout JSX
  );
};
```

## User Experience

When a new version is detected, a banner appears at the top of the page with a message like:
> "A new version (1.0.1) is available. Please refresh the page to update."

This provides a clear, non-intrusive way to inform users of available updates.

## How to Test

1.  Increment the `version` in `package.json`.
2.  Run `pnpm build` to generate the new `version.json` file.
3.  Serve the `dist` folder.
4.  Load the application in your browser. The version check should trigger, and you should see the update banner. 