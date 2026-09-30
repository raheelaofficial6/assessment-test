/** Primary header shared by all authenticated pages. */
class HeaderComponent {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async openCart() {
    await this.cartLink.click();
  }
}

module.exports = { HeaderComponent };
