describe("Checkout Process", () => {
  beforeEach(() => {
    cy.interceptApi()
    cy.fixture("user").then(({ regularUser }) => {
      cy.login(regularUser.email, regularUser.password)
    })
    cy.clearCart()
  })

  it("19. Should navigate to checkout from cart", () => {
    cy.fixture("products").then(({ products }) => {
      const product = products[0]
      cy.addProductToCart(product.id)
      cy.visit("/cart")
      cy.get("button").contains("Proceed to Checkout").click()
      cy.url().should("include", "/checkout")
    })
  })

  it("20. Should require login to access checkout", () => {
    cy.fixture("products").then(({ products }) => {
      const product = products[0]

      // Logout first
      cy.visit("/")
      cy.get('button[aria-haspopup="menu"]').click()
      cy.get('div[role="menu"]').contains("Logout").click()
      cy.wait("@logout")

      // Try to add product and checkout
      cy.visit(`/product/${product.id}`)
      cy.get("button").contains("Add to Cart").click()
      cy.get('div[role="status"]').should("contain", "Authentication required")
      cy.url().should("include", "/auth/login")
    })
  })

  it("21. Should fill out shipping information and proceed", () => {
    cy.fixture("products").then(({ products }) => {
      const product = products[0]
      cy.addProductToCart(product.id)
      cy.visit("/checkout")

      // Fill shipping info
      cy.fixture("checkout").then(({ shippingInfo }) => {
        cy.get('input[id="name"]').clear().type(shippingInfo.name)
        cy.get('input[id="email"]').clear().type(shippingInfo.email)
        cy.get('input[id="address"]').type(shippingInfo.address)
        cy.get('input[id="city"]').type(shippingInfo.city)
        cy.get('input[id="state"]').type(shippingInfo.state)
        cy.get('input[id="zipCode"]').type(shippingInfo.zipCode)
        cy.get('input[id="phone"]').type(shippingInfo.phone)

        // Select payment method
        cy.get('input[id="credit-card"]').check()

        // Place order
        cy.get("button").contains("Place Order").click()
        cy.wait("@checkout")

        // Check success message
        cy.get('div[role="status"]').should("contain", "Order placed successfully")
        cy.url().should("include", "/checkout/success")
      })
    })
  })

  it("22. Should validate required fields in checkout form", () => {
    cy.fixture("products").then(({ products }) => {
      const product = products[0]
      cy.addProductToCart(product.id)
      cy.visit("/checkout")

      // Submit form without filling required fields
      cy.get("button").contains("Place Order").click()

      // Check validation messages
      cy.get("form").should("contain", "required")
    })
  })

  it("23. Should display order summary on checkout page", () => {
    cy.fixture("products").then(({ products }) => {
      const product = products[0]
      cy.addProductToCart(product.id, 2) // Add 2 of the same product
      cy.visit("/checkout")

      // Check order summary
      cy.get("h2").contains("Order Summary").should("be.visible")
      cy.get("div").contains(product.name).should("be.visible")
      cy.get("div").contains(`Qty: 2`).should("be.visible")

      // Calculate expected values
      const subtotal = product.price * 2
      const shipping = subtotal > 50 ? 0 : 10
      const tax = subtotal * 0.08
      const total = subtotal + shipping + tax

      // Check values are displayed correctly
      cy.get("body").should("contain", `₱${subtotal.toFixed(2)}`)
      cy.get("body").should("contain", shipping === 0 ? "Free" : `₱${shipping.toFixed(2)}`)
      cy.get("body").should("contain", `₱${tax.toFixed(2)}`)
      cy.get("body").should("contain", `₱${total.toFixed(2)}`)
    })
  })
})
