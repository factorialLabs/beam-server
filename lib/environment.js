const NODE_ENV = process.env.NODE_ENV;

if (!NODE_ENV) {
  throw Error('NODE_ENV not set!');
}

const ENV = {
  DEVELOPMENT: 'development',
  TEST: 'test',
  STAGING: 'staging',
  PRODUCTION: 'production',
};

class Environment {
  static isDevelopment() {
    return ENV.DEVELOPMENT === NODE_ENV;
  }

  static isTest() {
    return ENV.TEST === NODE_ENV;
  }

  static isStaging() {
    return ENV.STAGING === NODE_ENV;
  }

  static isProduction() {
    return ENV.PRODUCTION === NODE_ENV;
  }
}

module.exports = {
  env: NODE_ENV,
  Environment,
};
