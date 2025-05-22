describe("Complete User Flow", () => {
  beforeEach(() => {
    cy.interceptApi()
  })

  it("Should complete a full user journey from login to checkout", () => {
    // 1. Login (from 01-authentication.cy.ts)
    cy.fixture("user").then(({ regularUser }) => {
      cy.visit("/auth/login")
      cy.get('input[id="email"]').type(regularUser.email)
      cy.get('input[id="password"]').type(regularUser.password)
      cy.get('button[type="submit"]').click()
      cy.wait("@login")
      cy.url().should("eq", Cypress.config().baseUrl + "/")
    })

    // 2. Browse products (from 02-product-browsing.cy.ts)
    cy.get("a").contains("Products").click()
    cy.url().should("include", "/products")
    cy.get("h1").contains("Our Products").should("be.visible")

    // 3. Filter products (from 02-product-browsing.cy.ts)
    cy.get("label").contains("Cakes")
      .should("be.visible")
      .click({ force: true })
    cy.get("button").contains("Apply Filters")
      .should("be.visible")
      .click({ force: true })
    cy.url().should("include", "category=cakes")


    // 4. Add product to cart (from 03-cart-functionality.cy.ts)
    cy.fixture("products").then(({ products }) => {
        const product = products[0]
    cy.visit(`/product/${product.id}`)
    cy.get('button.rounded-r-lg').click()
    cy.get('button.rounded-r-lg').click()
    cy.get("div.h-10").contains("3").should("be.visible")
    cy.get("button").contains("Add to Cart").click()

    // 5. Go to cart (from 03-cart-functionality.cy.ts)
    cy.visit("/cart")
    cy.get("body").should("contain", "3")

    // 6. Proceed to checkout (from 04-checkout-process.cy.ts)
    cy.get('a[href="/cart"]').click();
    cy.contains("Proceed to Checkout").click();
    cy.url().should("include", "/checkout")

    // 7. Fill shipping information (from 04-checkout-process.cy.ts)
    cy.get('input[id="name"]').type("John Doe")
    cy.get('input[id="address"]').type("123 Main St")
    cy.get('input[id="city"]').type("Manila")
    cy.get('input[id="state"]').type("Metro Manila")
    cy.get('input[id="zipCode"]').type("1000")
    cy.get('input[id="phone"]').type("09123456789")

    // 8. Select payment method and place order (from 04-checkout-process.cy.ts)
    cy.get('button[value="cash"]').click()
    cy.get("button").contains("Place Order").click()

    // 9. Verify order success
    cy.get("body").should("contain", "Your cart is empty")
  })
})
})