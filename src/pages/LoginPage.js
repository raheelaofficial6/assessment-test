const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  path = '/';

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
  }

  /** @param {import('../data/users').UserCredentials} credentials */
  async login({ username, password }) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
