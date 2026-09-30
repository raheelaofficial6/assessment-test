const { BasePage } = require('./BasePage');
const { HeaderComponent } = require('../components/HeaderComponent');
const { parsePrice } = require('../utils/price');

class InventoryPage extends BasePage {
  path = '/inventory.html';

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.inventoryItems = page.getByTestId('inventory-item');
  }

  /**
   * Product card located by its visible name, so tests don't depend on list order.
   * @param {string} name
   */
  productCard(name) {
    return this.inventoryItems.filter({
      has: this.page.getByTestId('inventory-item-name').getByText(name, { exact: true }),
    });
  }

  /** @param {string} name */
  addToCartButton(name) {
    return this.productCard(name).getByRole('button', { name: 'Add to cart' });
  }

  /** @param {string} name */
  removeButton(name) {
    return this.productCard(name).getByRole('button', { name: 'Remove' });
  }

  /** @param {string} name */
  async getProductPrice(name) {
    return parsePrice(await this.productCard(name).getByTestId('inventory-item-price').textContent());
  }

  /** @param {string} name */
  async addToCart(name) {
    await this.addToCartButton(name).click();
  }
}

module.exports = { InventoryPage };
