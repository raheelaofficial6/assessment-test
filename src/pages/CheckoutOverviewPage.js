const { BasePage } = require('./BasePage');
const { parsePrice } = require('../utils/price');

/** Checkout step two: order overview. */
class CheckoutOverviewPage extends BasePage {
  path = '/checkout-step-two.html';

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.cartItems = page.getByTestId('inventory-item');
    this.itemNames = this.cartItems.getByTestId('inventory-item-name');
    this.itemPrices = this.cartItems.getByTestId('inventory-item-price');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
  }

  /** @returns {Promise<number[]>} */
  async getItemPrices() {
    return (await this.itemPrices.allTextContents()).map(parsePrice);
  }

  /** @returns {Promise<{ subtotal: number, tax: number, total: number }>} */
  async getOrderSummary() {
    const [subtotal, tax, total] = await Promise.all(
      [this.subtotalLabel, this.taxLabel, this.totalLabel].map(async (label) =>
        parsePrice(await label.textContent()),
      ),
    );
    return { subtotal, tax, total };
  }

  async finish() {
    await this.finishButton.click();
  }
}

module.exports = { CheckoutOverviewPage };
