const config = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  TOKEN_KEY: 'accessToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  AUTH_ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VALIDATE: '/auth/validate',
    REFRESH: '/auth/refresh'
  }
};

export default config; 