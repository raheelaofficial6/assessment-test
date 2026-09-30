const { BasePage } = require('./BasePage');
const { HeaderComponent } = require('../components/HeaderComponent');
const { parsePrice } = require('../utils/price');

class CartPage extends BasePage {
  path = '/cart.html';

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.cartItems = page.getByTestId('inventory-item');
    this.itemNames = this.cartItems.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  /** @param {string} name */
  cartItem(name) {
    return this.cartItems.filter({
      has: this.page.getByTestId('inventory-item-name').getByText(name, { exact: true }),
    });
  }

  /** @param {string} name */
  async getItemPrice(name) {
    return parsePrice(await this.cartItem(name).getByTestId('inventory-item-price').textContent());
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };
