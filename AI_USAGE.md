# AI Usage, Review and Limitations

This file explains how AI was used to build this test suite, what I found wrong or weak in its output, what I changed myself, and the risks that remain.

## 1. What AI generated or helped with

I used an AI coding assistant (Claude Code) to build the project, giving it the site, the credentials and the brief. It generated:

- **Project setup:** `package.json`, `playwright.config.js`, `.gitignore`, `.env.example`.
- **Page Object Model structure:**
  - `src/pages/`: a `BasePage` plus one class per page (Login, Inventory, Cart, Checkout Information, Checkout Overview, Checkout Complete).
  - `src/components/HeaderComponent.js`: the cart link and badge shared across pages.
  - `src/fixtures/test-fixtures.js`: passes the page objects into tests as Playwright fixtures.
  - `src/data/`: users, customer details and product names.
  - `src/utils/price.js`: price parsing and comparison in cents.
- **The spec** `tests/e2e/checkout.spec.js`: the full checkout flow broken into `test.step` blocks. It runs twice, with one product and with three.
- **The README** with setup and run instructions.

The AI first wrote the project in **TypeScript**. I told it to use **JavaScript**, and it rewrote every file as CommonJS JavaScript, using JSDoc comments for editor type hints.

The AI also ran the tests: 2 of 2 passed on Chromium, and 10 of 10 passed with `--repeat-each=5`.

## 2. Problems I found in the AI output

| # | Issue | Type | Where |
|---|---|---|---|
| 1 | By default the config ran **Chromium, Firefox and WebKit** with parallel workers. That was more than the brief needed and slower to run. | Scope | `playwright.config.js` |
| 2 | The overview step checks `expect(tax).toBeGreaterThan(0)`. That is weak: a wrong tax amount still passes. SauceDemo charges 8%, so the test should check the actual amount. | Weak assertion | `checkout.spec.js` |
| 3 | After clicking Continue, the test checks that the checkout form's error message is hidden. This can pass **before** an error has had time to appear, so it proves little. The URL check in the next step is what really confirms the form was submitted. | Weak assertion | `checkout.spec.js` |
| 4 | The overview step expects items in the order they were added (`toEqual([...expectedPrices.values()])`). That is an assumption about the app, not a stated requirement. If the site sorts differently, the test fails even though nothing is broken. | Brittle | `checkout.spec.js` |
| 5 | Some assertions check exact wording ("Thank you for your order!", "Checkout: Overview"), so a copy change breaks the test. This is acceptable for a smoke test, but it is still a maintenance cost. | Brittle | `checkout.spec.js` |
| 6 | `.env.example` suggests a `.env` file will be loaded, but nothing loads it (there is no `dotenv`). The variables only work if they are set in the shell. | Misleading | `.env.example` |
| 7 | After I narrowed the browsers, the README still said `npm test` runs all three. | Docs out of date | `README.md` (now fixed) |
| 8 | The AI's first attempt to create files with a shell heredoc failed with a syntax error, and it switched to another method. The generated code wasn't affected, but it shows AI tool output still needs checking. | Process | — |

## 3. What I changed myself and why

- **Chose JavaScript over TypeScript.** It matches the stack the assessment expected, and it keeps setup simple: no `tsconfig` and no type-checking step.
- **Limited the run to Chromium only.** I removed the Firefox and WebKit projects from `playwright.config.js`. The brief asks for one important flow, not cross-browser coverage. This makes runs faster and failures easier to read, and it saves reviewers from installing three browsers.
- **Set workers to 1 on CI** (`workers: isCI ? 1 : undefined`). One worker on CI keeps runs predictable against a shared public demo site and makes logs easier to follow. Locally, Playwright still decides the worker count itself.
- **Reviewed the selectors and assertions** against the live site and kept the `data-test` selectors plus role-based button lookups. Where assertions were weak or brittle, I recorded them in section 2 rather than silently accepting them.

## 4. Limitations and risks

- **Depends on a live third-party site.** saucedemo.com is a public demo. If it's down, slow or changed, the tests fail for reasons outside our code, and we have no control over its data or releases.
- **Only one browser and one user.** Only Chromium and `standard_user` are covered. The known-faulty users (`problem_user`, `performance_glitch_user`, `error_user`) and the locked-out user are not tested, and neither are Firefox or Safari.
- **Only the happy path.** There are no tests for missing checkout fields, removing items from the cart, cancelling checkout, or sorting.
- **Login goes through the UI every time.** That is correct for this flow test, but a larger suite should log in once and reuse the saved session (`storageState`) to save time.
- **Money checks rely on reading text.** Prices are pulled out of the displayed text with a regex. A change to the currency format (for example `USD 29.99`) would break the parsing.
- **Credentials have defaults in code.** This is fine for public demo credentials. For a real system they must come only from CI secrets.
- **No CI pipeline, linting or formatting yet.** There is no GitHub Actions workflow, no ESLint and no Prettier, so code-style consistency isn't enforced.
- **Limited stability evidence.** Stability was checked with only 10 runs on one machine. That doesn't prove the tests are stable on CI or under network latency.

### Suggested next steps
1. Check the exact 8% tax amount, and replace the weak "error message hidden" check with a URL check.
2. Compare the overview items as a sorted set unless order is a stated requirement.
3. Add negative-path tests and tests for the other SauceDemo users.
4. Add a GitHub Actions workflow that uploads the HTML report and traces.
5. Either add `dotenv` or reword `.env.example` so it's clear the variables must be set in the shell.
