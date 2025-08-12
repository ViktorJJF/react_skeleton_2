import packageJson from '../package.json';

const config = {
  APP_VERSION: packageJson.version,
  GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  GA_MEASUREMENT_ID: 'G-XXXXXXXXXX',
  BACKEND_BASE_URL:
    import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:3333',
};

export default config;
