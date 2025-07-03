export const DEV_PROCESS = process.env.REACT_APP_DEV_PROCESS === '1';
export const DEV_MODE = `${process.env?.REACT_APP_DEV_MODE ?? 'DEV'}`.toUpperCase();

export const APP_YEAR = Number(process.env.REACT_APP_YEAR? process.env.REACT_APP_YEAR: 2022);

export const APP_URL = `${process.env.REACT_APP_URL}`;
export const API_URL = `${process.env.REACT_APP_API_URL}`;

export const APP_PREFIX = `${process.env.REACT_APP_PREFIX}`;

export const TOKEN_KEY = `${process.env.REACT_APP_TOKEN_KEY}`;
export const REFRESH_KEY = `${process.env.REACT_APP_REFRESH_KEY}`;
