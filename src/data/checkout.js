/**
 * @typedef {{ firstName: string, lastName: string, postalCode: string }} CustomerInfo
 */

const customers = Object.freeze({
  default: {
    firstName: 'Jane',
    lastName: 'Doe',
    postalCode: '10001',
  },
});

const Products = Object.freeze({
  BACKPACK: 'Sauce Labs Backpack',
  BIKE_LIGHT: 'Sauce Labs Bike Light',
  BOLT_TSHIRT: 'Sauce Labs Bolt T-Shirt',
  FLEECE_JACKET: 'Sauce Labs Fleece Jacket',
});

module.exports = { customers, Products };
