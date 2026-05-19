const fallbackApiUrl = 'http://localhost:5000/api';

export const env = {
  apiBaseUrl: (import.meta.env['VITE_API_BASE_URL'] as string | undefined) ?? fallbackApiUrl,
} as const;
