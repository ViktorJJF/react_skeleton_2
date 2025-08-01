# PWA Support

This document describes the Progressive Web App (PWA) support implemented in the application.

## Overview

The application is configured as a PWA, which provides:
- Offline support
- Installability on various devices
- App-like user experience
- Automatic updates

## Features

- **Service Worker**: The application uses a service worker to cache assets and enable offline functionality.
- **Web App Manifest**: The `manifest.json` file provides metadata about the app, such as its name, icons, and theme color.
- **PWA Update Notifications**: Users are notified when a new version of the app is available and can reload to update.

## Configuration

PWA support is configured in `vite.config.ts` using the `vite-plugin-pwa` plugin. The configuration includes:
- `registerType`: 'autoUpdate' - The service worker updates automatically.
- `includeAssets`: A list of assets to be cached.
- `manifest`: The web app manifest configuration.

## Icons

The application includes a set of PWA icons in the `public` directory:
- `pwa-192x192.png`: 192x192 icon
- `pwa-512x512.png`: 512x512 icon
- `apple-touch-icon.png`: Apple touch icon
- `masked-icon.svg`: Maskable icon

## Update Handling

The `PWAUpdateHandler` component (`src/components/PWAUpdateHandler.tsx`) handles PWA updates:
- Notifies users when the app is ready for offline use.
- Notifies users when a new version is available with a reload option.

## Offline Support

The service worker caches all necessary assets, allowing the application to be used offline. The offline experience includes:
- Access to previously visited pages
- Cached API responses (if configured)
- Static assets (JS, CSS, images)

## Testing PWA Features

To test the PWA features:
1. **Build the application**: `pnpm build`
2. **Serve the build output**: `pnpm preview`
3. **Open the application in a browser** and look for the install icon in the address bar.
4. **Use browser developer tools** to test offline mode and service worker functionality.

## Best Practices

- **Provide a good offline experience**: Ensure that the application is usable offline and provides clear feedback to the user.
- **Keep the service worker up to date**: The `autoUpdate` configuration helps with this.
- **Use appropriate icons**: Provide high-quality icons for a good user experience.
- **Test on multiple devices**: Test the PWA on different devices and platforms.
- **Optimize for performance**: Ensure that the service worker does not negatively impact performance. 