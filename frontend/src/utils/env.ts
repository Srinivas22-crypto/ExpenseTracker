/**
 * Environment utility functions
 * Helps determine the current environment for conditional logic
 */

/**
 * Check if the app is running in development mode
 */
export const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

/**
 * Check if the app is running in production mode
 */
export const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';



