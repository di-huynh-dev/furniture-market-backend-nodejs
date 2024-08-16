"use strict";

const development = {
  app: {
    port: process.env.DEV_APP_PORT || 3000,
  },
  db: {
    uri: process.env.MONGODB_URI || "",
    host: process.env.DEV_APP_HOST || "localhost",
    port: process.env.DEV_APP_PORT || 27017,
    name: process.env.DEV_DB_NAME || "shopDEV",
  },
};

const production = {
  app: {
    port: process.env.PRO_APP_PORT || 3050,
  },
  db: {
    host: process.env.PRO_DB_HOST || "localhost",
    port: process.env.PRO_DB_PORT || 27017,
    name: process.env.PRO_DB_NAME || "shopPRO",
  },
};

const config = {
  development,
  production,
};

const env = process.env.NODE_ENV || "development";

module.exports = config[env];
