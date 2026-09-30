const { test, expect } = require('../../src/fixtures/test-fixtures');
const { users } = require('../../src/data/users');
const { customers, Products } = require('../../src/data/checkout');
const { toCents } = require('../../src/utils/price');

const scenarios = [
  { title: 'a single product', products: [Products.BACKPACK] },
  { title: 'multiple products', products: [Products.BACKPACK, Products.BOLT_TSHIRT, Products.FLEECE_JACKET] },
];

test.describe('Checkout flow', () => {
  for (const { title, products } of scenarios) {
    test(`standard user can purchase ${title} end to end`, { tag: ['@e2e', '@smoke'] }, async ({
      page,
      loginPage,
      inventoryPage,
      cartPage,
      checkoutInformationPage,
      checkoutOverviewPage,
      checkoutCompletePage,
    }) => {
      /** @type {Map<string, number>} product name -> price shown on the inventory page */
      const expectedPrices = new Map();

      await test.step('Log in as standard user', async () => {
        await loginPage.goto();
        await loginPage.login(users.standard);

        await expect(page).toHaveURL(/\/inventory\.html$/);
        await expect(inventoryPage.title).toHaveText('Products');
        await expect(inventoryPage.header.cartBadge).toBeHidden();
      });

      await test.step('Add products to cart', async () => {
        for (const [index, product] of products.entries()) {
          expectedPrices.set(product, await inventoryPage.getProductPrice(product));
          await inventoryPage.addToCart(product);

          await expect(inventoryPage.removeButton(product)).toBeVisible();
          await expect(inventoryPage.header.cartBadge).toHaveText(String(index + 1));
        }
      });

      await test.step('Verify cart contents', async () => {
        await inventoryPage.header.openCart();

        await expect(page).toHaveURL(/\/cart\.html$/);
        await expect(cartPage.title).toHaveText('Your Cart');
        await expect(cartPage.itemNames).toHaveText(products);
        for (const product of products) {
          expect(await cartPage.getItemPrice(product), `cart price of "${product}"`).toBe(
            expectedPrices.get(product),
          );
        }
      });

      await test.step('Enter customer information', async () => {
        await cartPage.checkout();
        await expect(checkoutInformationPage.title).toHaveText('Checkout: Your Information');

        await checkoutInformationPage.fillCustomerInfo(customers.default);
        await checkoutInformationPage.continue();

        await expect(checkoutInformationPage.errorMessage).toBeHidden();
      });

      await test.step('Verify order overview and totals', async () => {
        await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
        await expect(checkoutOverviewPage.title).toHaveText('Checkout: Overview');
        await expect(checkoutOverviewPage.itemNames).toHaveText(products);

        const itemPrices = await checkoutOverviewPage.getItemPrices();
        expect(itemPrices).toEqual([...expectedPrices.values()]);

        const { subtotal, tax, total } = await checkoutOverviewPage.getOrderSummary();
        const expectedSubtotal = itemPrices.reduce((sum, price) => sum + price, 0);
        expect(toCents(subtotal), 'item total equals sum of item prices').toBe(toCents(expectedSubtotal));
        expect(tax, 'tax is applied').toBeGreaterThan(0);
        expect(toCents(total), 'total equals item total + tax').toBe(toCents(subtotal + tax));
      });

      await test.step('Finish order and verify confirmation', async () => {
        await checkoutOverviewPage.finish();

        await expect(page).toHaveURL(/\/checkout-complete\.html$/);
        await expect(checkoutCompletePage.title).toHaveText('Checkout: Complete!');
        await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
        await expect(checkoutCompletePage.completeText).toContainText('Your order has been dispatched');
        await expect(checkoutCompletePage.header.cartBadge, 'cart is emptied after purchase').toBeHidden();
      });

      await test.step('Return to products', async () => {
        await checkoutCompletePage.backHome();

        await expect(page).toHaveURL(/\/inventory\.html$/);
        for (const product of products) {
          await expect(inventoryPage.addToCartButton(product)).toBeVisible();
        }
      });
    });
  }
});
