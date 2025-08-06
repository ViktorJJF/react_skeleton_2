# API Hooks Domain

This directory contains all API-related hooks for handling server communications.

## Structure

- `useApi.ts` - Generic API hook for consistent error handling and loading states
- `useApiClient.ts` - API client utilities with standardized error handling
- `useAnalytics.ts` - Analytics-specific API calls

## Usage

```typescript
// Generic API usage
import { useApi } from '@/hooks/api';

const { data, loading, execute } = useApi({
  showSuccessToast: true,
  successMessage: 'Operation completed successfully'
});

// Execute API call
await execute(() => myApiCall());
```

## Benefits

- ✅ Consistent error handling across all API calls
- ✅ Standardized loading states
- ✅ Automatic toast notifications
- ✅ Reusable across all domains
- ✅ Easy to test and maintain