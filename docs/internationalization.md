# Internationalization (i18n)

This document outlines the internationalization (i18n) system implemented in the application, enabling support for multiple languages.

## Overview

The application uses `i18next` and `react-i18next` to manage translations. The system is configured to automatically detect the user's language from their browser settings and provides a language switcher for manual selection.

## Core Components

### 1. **i18n Configuration**
- **File**: `src/i18n.ts`
- **Description**: This is the central configuration file for `i18next`. It initializes the library, sets up the language detector, and loads the translation resources.

### 2. **Translation Files**
- **Location**: `src/locales/`
- **Structure**: Each language has its own folder (e.g., `en`, `es`) containing a `translation.json` file.
- **Example (`en/translation.json`)**:
    ```json
    {
      "dashboard": {
        "title": "Dashboard",
        "description": "Monitor your AI chatbot performance..."
      }
    }
    ```

### 3. **Language Switcher**
- **File**: `src/components/layout/LanguageSwitcher.tsx`
- **Description**: A dropdown component in the header that allows users to switch between supported languages.

## How to Use

To use translations in your components, use the `useTranslation` hook from `react-i18next`.

### **Using the `useTranslation` Hook**

```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.description')}</p>
    </div>
  );
};
```

The `t` function takes a key from your JSON translation files and returns the corresponding string for the currently active language.

## Adding a New Language

1.  **Create a New Language Folder**: In `src/locales/`, create a new folder with the two-letter language code (e.g., `fr` for French).
2.  **Add a `translation.json` File**: Inside the new folder, create a `translation.json` file. Copy the contents of an existing translation file (e.g., `src/locales/en/translation.json`) to use as a template.
3.  **Translate the Content**: Translate all the string values in the new `translation.json` file.
4.  **Update the i18n Configuration**:
    -   Open `src/i18n.ts`.
    -   Import your new translation file:
        ```javascript
        import fr from '@/locales/fr/translation.json';
        ```
    -   Add the new language to the `resources` object:
        ```javascript
        const resources = {
          en: { translation: en },
          es: { translation: es },
          fr: { translation: fr }, // Add this line
        };
        ```
5.  **Update the Language Switcher**:
    -   Open `src/components/layout/LanguageSwitcher.tsx`.
    -   Add the new language to the `languages` array:
        ```javascript
        const languages = [
          { code: 'en', name: 'English', flag: '🇺🇸' },
          { code: 'es', name: 'Español', flag: '🇪🇸' },
          { code: 'fr', name: 'Français', flag: '🇫🇷' }, // Add this line
        ];
        ```

Your application will now support the new language. 