export const DEV_PROCESS = import.meta.env.VITE_DEV_PROCESS === '1';
export const DEV_MODE = `${import.meta.env.VITE_DEV_MODE ?? 'DEV'}`.toUpperCase();

export const APP_YEAR = Number(import.meta.env.VITE_YEAR || 2025);

export const APP_URL = `${import.meta.env.VITE_URL}`;
export const API_URL = `${import.meta.env.VITE_API_URL}`;

export const APP_PREFIX = `${import.meta.env.VITE_PREFIX}`;

export const TOKEN_KEY = `${import.meta.env.VITE_TOKEN_KEY}`;
export const REFRESH_KEY = `${import.meta.env.VITE_REFRESH_KEY}`;
