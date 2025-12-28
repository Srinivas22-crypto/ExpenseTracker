import { configureStore } from '@reduxjs/toolkit';

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

// Configure Redux store with proper middleware settings
// This suppresses performance warnings in development while maintaining production safety
export const store = configureStore({
  reducer: {
    // Add your reducers here when you start using Redux
    // Example: auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable immutability checks in development to suppress performance warnings
      // These checks are expensive and can cause "took more than 32ms" warnings
      immutableCheck: isDevelopment
        ? false // Disabled in development for performance
        : {
            // Enabled in production with strict settings
            warnAfter: 32,
            ignoredActions: [],
            ignoredActionPaths: [],
            ignoredPaths: [],
          },
      // Disable serializable checks in development to suppress performance warnings
      serializableCheck: isDevelopment
        ? false // Disabled in development for performance
        : {
            // Enabled in production with strict settings
            warnAfter: 32,
            ignoredActions: [],
            ignoredActionPaths: [],
            ignoredPaths: [],
          },
    }),
  devTools: isDevelopment, // Enable Redux DevTools only in development
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

