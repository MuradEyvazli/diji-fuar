const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for .env files
config.resolver.alias = {
  ...config.resolver.alias,
};

module.exports = config;