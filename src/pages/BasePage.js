/** @typedef {import('@playwright/test').Page} Page */

class BasePage {
  /** Path of this page, resolved against `baseURL`. Overridden by subclasses. */
  path = '/';

  /** @param {Page} page */
  constructor(page) {
    this.page = page;
    /** Secondary header title, e.g. "Products", "Your Cart". */
    this.title = page.getByTestId('title');
  }

  async goto() {
    await this.page.goto(this.path);
  }
}

module.exports = { BasePage };
