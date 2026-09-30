const { BasePage } = require('./BasePage');
const { HeaderComponent } = require('../components/HeaderComponent');

class CheckoutCompletePage extends BasePage {
  path = '/checkout-complete.html';

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.completeHeader = page.getByTestId('complete-header');
    this.completeText = page.getByTestId('complete-text');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  async backHome() {
    await this.backHomeButton.click();
  }
}

module.exports = { CheckoutCompletePage };
