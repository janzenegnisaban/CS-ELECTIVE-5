describe("Complete User Flow", () => {
  beforeEach(() => {
    cy.interceptApi()
  })

  it("Should complete a full user journey from login to checkout", () => {
    // 1. Login
    cy.fixture("user").then(({ regularUser }) => {
      cy.visit("/auth/login")
      cy.get('input[id="email"]').type(regularUser.email)
      cy.get('input[id="password"]').type(regularUser.password)
      cy.get('button[type="submit"]').click()
      cy.wait("@login")
      cy.url().should("eq", Cypress.config().baseUrl + "/")
    })

    // 2. Browse products
    cy.get("a").contains("Products").click()
    cy.url().should("include", "/products")

    // 3. Filter products
    cy.get("label").contains("Cakes").click()
    cy.get("button").contains("Apply Filters").click()
    cy.url().should("include", "category=cakes")

    // 4. View product details
    cy.get('div[class*="product-grid"]').find("a").first().click()
    cy.url().should("include", "/product/")

    // 5. Add product to cart
    cy.get("button").contains("Add to Cart").click()
    cy.get('div[role="status"]').should("contain", "Added to cart")

    // 6. Go to cart
    cy.get('a[href="/cart"]').click()
    cy.url().should("include", "/cart")

    // 7. Proceed to checkout
    cy.get("button").contains("Proceed to Checkout").click()
    cy.url().should("include", "/checkout")

    // 8. Fill shipping information
    cy.fixture("checkout").then(({ shippingInfo }) => {
      cy.get('input[id="name"]').clear().type(shippingInfo.name)
      cy.get('input[id="email"]').clear().type(shippingInfo.email)
      cy.get('input[id="address"]').type(shippingInfo.address)
      cy.get('input[id="city"]').type(shippingInfo.city)
      cy.get('input[id="state"]').type(shippingInfo.state)
      cy.get('input[id="zipCode"]').type(shippingInfo.zipCode)
      cy.get('input[id="phone"]').type(shippingInfo.phone)
    })

    // 9. Select payment method and place order
    cy.get('input[id="credit-card"]').check()
    cy.get("button").contains("Place Order").click()
    cy.wait("@checkout")

    // 10. Verify order success
    cy.get('div[role="status"]').should("contain", "Order placed successfully")
    cy.url().should("include", "/checkout/success")
  })
})
