/// <reference types="cypress" />

// Login command
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit("/auth/login")
    cy.get('input[id="email"]').type(email)
    cy.get('input[id="password"]').type(password)
    cy.get('button[type="submit"]').click()
    cy.url().should("eq", Cypress.config().baseUrl + "/")
  })
})

// Admin login command
Cypress.Commands.add("adminLogin", () => {
  cy.fixture("user").then(({ adminUser }) => {
    cy.login(adminUser.email, adminUser.password)
    cy.visit("/admin")
    cy.url().should("include", "/admin")
  })
})

// Add product to cart
Cypress.Commands.add("addProductToCart", (productId: string, quantity = 1) => {
  cy.visit(`/product/${productId}`)

  // Set quantity if needed
  if (quantity > 1) {
    for (let i = 1; i < quantity; i++) {
      cy.get("button").contains("+").click()
    }
  }

  cy.get("button").contains("Add to Cart").click()
})

// Clear cart
Cypress.Commands.add("clearCart", () => {
  cy.visit("/cart")
  cy.get("body").then(($body) => {
    if ($body.find('button:contains("Remove")').length > 0) {
      cy.get('button:contains("Remove")').each(($el) => {
        cy.wrap($el).click()
        cy.wait(500)
      })
    }
  })
})

// Intercept API requests
Cypress.Commands.add("interceptApi", () => {
  cy.intercept("GET", "/api/products*").as("getProducts")
  cy.intercept("GET", "/api/product/*").as("getProduct")
  cy.intercept("POST", "/api/cart").as("addToCart")
  cy.intercept("GET", "/api/cart").as("getCart")
  cy.intercept("DELETE", "/api/cart/*").as("removeFromCart")
  cy.intercept("PUT", "/api/cart/*").as("updateCart")
  cy.intercept("POST", "/api/checkout").as("checkout")
  cy.intercept("POST", "/api/auth/login").as("login")
  cy.intercept("POST", "/api/auth/register").as("register")
  cy.intercept("POST", "/api/auth/logout").as("logout")
  cy.intercept("GET", "/api/auth/me").as("getMe")
  cy.intercept("GET", "/api/admin/products").as("getAdminProducts")
  cy.intercept("POST", "/api/admin/products").as("createProduct")
  cy.intercept("PUT", "/api/admin/products/*").as("updateProduct")
  cy.intercept("DELETE", "/api/admin/products/*").as("deleteProduct")
})

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      adminLogin(): Chainable<void>
      addProductToCart(productId: string, quantity?: number): Chainable<void>
      clearCart(): Chainable<void>
      interceptApi(): Chainable<void>
    }
  }
}

export {}
