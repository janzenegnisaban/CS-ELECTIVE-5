# QuiCake E2E Testing with Cypress

This directory contains end-to-end tests for the QuiCake ecommerce application using Cypress.

## Test Structure

The tests are organized into several files:

1. `01-authentication.cy.ts` - Tests for user authentication (login, register, logout)
2. `02-product-browsing.cy.ts` - Tests for browsing and filtering products
3. `03-cart-functionality.cy.ts` - Tests for cart operations
4. `04-checkout-process.cy.ts` - Tests for the checkout process
5. `05-admin-functionality.cy.ts` - Tests for admin functionality
6. `06-user-flow.cy.ts` - Tests for complete user journeys

## Running Tests

To run the tests, you can use the following commands:

\`\`\`bash
# Open Cypress in interactive mode
npm run cypress:open

# Run all tests in headless mode
npm run cypress:run

# Run tests with the application running
npm run test:e2e
\`\`\`

## Test Data

Test data is stored in the `fixtures` directory:

- `user.json` - User credentials for testing
- `products.json` - Product data for testing
- `checkout.json` - Checkout information for testing

## Custom Commands

Custom Cypress commands are defined in `support/commands.ts`:

- `login(email, password)` - Login with the specified credentials
- `adminLogin()` - Login as an admin user
- `addProductToCart(productId, quantity)` - Add a product to the cart
- `clearCart()` - Clear all items from the cart
- `interceptApi()` - Set up API request interceptions

## Notes

- The tests assume that the database has been seeded with the test data
- Some tests may fail if the database state is not as expected
- Make sure to run `npm run seed` before running the tests
