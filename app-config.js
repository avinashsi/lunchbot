const tokens = require('./secrets.json');

const appConfig = {
  get basicAuthUser() {
    return process.env.BASIC_AUTH_USER || tokens.basicAuthUser
  },
  get basicAuthPassword() {
    return process.env.BASIC_AUTH_PASSWORD || tokens.basicAuthPassword
  },
  get oAuthToken() {
    return process.env.O_AUTH_TOKEN || tokens.oAuthToken
  },
  get botUserOAuthTokenToken() {
    return process.env.BOT_USER_OAUTH_TOKEN || tokens.botUserOAuthToken
  },
  get signingSecret() {
    return process.env.SIGNING_SECRET || tokens.signingSecret
  },
  get googleMapsKey() {
    return process.env.GOOGLE_MAPS_KEY || tokens.googleMapsKey
  }
};

module.exports = appConfig;