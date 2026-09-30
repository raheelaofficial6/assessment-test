/**
 * @typedef {{ username: string, password: string }} UserCredentials
 */

/** Credentials can be overridden through environment variables. */
const users = Object.freeze({
  standard: {
    username: process.env.SAUCE_USERNAME ?? 'standard_user',
    password: process.env.SAUCE_PASSWORD ?? 'secret_sauce',
  },
});

module.exports = { users };
