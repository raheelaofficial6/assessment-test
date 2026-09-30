# SauceDemo E2E Tests (Playwright + JavaScript)

Automated end-to-end test for the main purchase flow of [saucedemo.com](https://www.saucedemo.com/), written with Playwright Test and the Page Object Model.

## Flow under test

**Login → add product(s) to cart → review cart → enter customer info → verify order overview → finish → verify confirmation → return to products**

The test runs twice, once with a single product and once with three products.

| Step | What is asserted |
|---|---|
| Login | Lands on `/inventory.html`, the page title is "Products", and the cart is empty |
| Add to cart | Each card's button changes to "Remove" and the cart badge goes up by one each time |
| Cart | The cart lists exactly the chosen products, in order, at the prices shown on the inventory page |
| Customer info | The form submits with no validation error |
| Overview | Items and prices match. **Item total = sum of prices**, tax > 0, and **Total = item total + tax** (compared in cents) |
| Complete | Shows "Thank you for your order!" and the dispatch message, and the cart badge is gone |
| Back home | Every purchased product shows "Add to cart" again |

## Project structure

```
├── playwright.config.js          # baseURL, testIdAttribute, browsers, reporters, trace/screenshot/video
├── src/
│   ├── pages/                    # Page objects (one class per page)
│   │   ├── BasePage.js
│   │   ├── LoginPage.js
│   │   ├── InventoryPage.js
│   │   ├── CartPage.js
│   │   ├── CheckoutInformationPage.js
│   │   ├── CheckoutOverviewPage.js
│   │   └── CheckoutCompletePage.js
│   ├── components/
│   │   └── HeaderComponent.js    # Cart link/badge shared across pages
│   ├── fixtures/
│   │   └── test-fixtures.js      # Injects page objects into tests as fixtures
│   ├── data/                     # Test data: users, customers, product names
│   └── utils/price.js            # Price parsing and money comparison helpers
└── tests/e2e/checkout.spec.js    # The E2E spec
```

## Design decisions

- **Page Object Model with fixtures.** Page classes hold the locators and actions, and the spec holds the assertions. Page objects are passed in as Playwright fixtures, so tests never create them by hand.
- **Stable selectors.** The site has `data-test` attributes. `testIdAttribute: 'data-test'` is set in the config so `getByTestId()` finds them. Products are found by their **visible name** (`filter({ has: ... })`), not by position or generated IDs. Buttons are found by role and accessible name.
- **No hard-coded waits.** There is no `waitForTimeout`. Web-first assertions (`toHaveURL`, `toHaveText`, `toBeVisible`) retry automatically until they pass.
- **Test isolation.** Each test gets a fresh browser context, so no cookies, localStorage or cart state carry over. Tests don't depend on each other and run in parallel (`fullyParallel: true`).
- **Readable reports.** Each part of the flow is wrapped in `test.step`, so the HTML report and trace show it as a named step. Custom assertion messages explain what failed.
- **Data kept out of the tests.** Credentials, customer details and product names live in `src/data/`. Credentials can be overridden with environment variables.
- **Debugging on failure.** When a test fails, its trace, screenshot and video are kept. On CI there are 2 retries and `test.only` is not allowed.

## Setup

Requirements: **Node.js 18 or later**

```bash
npm install
npx playwright install chromium
```

## Run

```bash
npm test                          # Chromium (the only configured project), headless
npm run test:chromium             # Chromium only
npm run test:headed               # Chromium with a visible browser window
npm run test:ui                   # Playwright UI mode (interactive)
npx playwright test --grep @smoke # filter by tag
npm run report                    # open the last HTML report
```

Optional environment overrides (see `.env.example`):

```bash
# bash
BASE_URL=https://www.saucedemo.com SAUCE_USERNAME=standard_user SAUCE_PASSWORD=secret_sauce npm test
```

```powershell
# PowerShell
$env:SAUCE_USERNAME="standard_user"; $env:SAUCE_PASSWORD="secret_sauce"; npm test
```

To open a trace from a failed run:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```
