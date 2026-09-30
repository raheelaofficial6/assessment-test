const { BasePage } = require('./BasePage');

/** Checkout step one: customer information. */
class CheckoutInformationPage extends BasePage {
  path = '/checkout-step-one.html';

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.errorMessage = page.getByTestId('error');
  }

  /** @param {import('../data/checkout').CustomerInfo} customer */
  async fillCustomerInfo({ firstName, lastName, postalCode }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }
}

module.exports = { CheckoutInformationPage };
