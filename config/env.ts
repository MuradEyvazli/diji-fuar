// Environment Configuration
export const ENV = {
  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://murad:Wattson5484@nodeexpressprojects.csweoyl.mongodb.net/diji-fuar',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'diji-fuar-jwt-secret-key-2024-production-secure',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'diji-fuar-refresh-secret-key-2024-production-secure',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '24h',
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '7d',

  // API
  API_BASE_URL: process.env.API_BASE_URL || 'https://diji-fuar-api.vercel.app/api',
  LOCAL_API_URL: process.env.LOCAL_API_URL || 'http://localhost:3001/api',

  // App
  APP_NAME: process.env.APP_NAME || 'Diji Fuar',
  APP_VERSION: process.env.APP_VERSION || '1.0.0',
  APP_ENV: process.env.APP_ENV || 'development',

  // Security
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12'),

  // Database
  DB_NAME: process.env.DB_NAME || 'diji-fuar',
  DB_COLLECTION_USERS: process.env.DB_COLLECTION_USERS || 'users',

  // Default Users
  DEFAULT_DEMO_USERNAME: process.env.DEFAULT_DEMO_USERNAME || 'demo',
  DEFAULT_DEMO_PASSWORD: process.env.DEFAULT_DEMO_PASSWORD || '123456',
  DEFAULT_ADMIN_USERNAME: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
  DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',

  // Helpers
  isDevelopment: () => process.env.APP_ENV === 'development' || __DEV__,
  isProduction: () => process.env.APP_ENV === 'production',
  getApiUrl: () => __DEV__ ? (process.env.LOCAL_API_URL || 'http://localhost:3001/api') : (process.env.API_BASE_URL || 'https://diji-fuar-api.vercel.app/api')
};

export default ENV;