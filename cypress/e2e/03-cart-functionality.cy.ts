describe("Cart Functionality", () => {
  beforeEach(() => {
    cy.interceptApi()
    cy.fixture("user").then(({ regularUser }) => {
      cy.login(regularUser.email, regularUser.password)
    })
    cy.clearCart()
  })

it("13. Should add a product to the cart and require login", () => {
  cy.fixture("products").then(({ products }) => {
    const product = products[0];

    // Navigate to product page
    cy.visit(`/product/${product.id}`);
    cy.url().should("include", `/product/${product.id}`);

    // Add product to cart
    cy.get("button").contains("Add to Cart").should("be.visible").click();
    cy.get('a[href="/cart"]').find("span").should("contain", "1");

    // Navigate to login page
    cy.visit("/login");
    cy.url().should("include", "/login");

    // Enter login credentials
    cy.get("input[name='email']").should("be.visible").type("user@example.com");
    cy.get("input[name='password']").should("be.visible").type("password123");

    // Submit login form
    cy.get("button").contains("Login").should("be.visible").click();

    // Verify login success
    cy.url().should("include", "/dashboard"); // Update if needed
    cy.get("nav").contains("Welcome, User").should("exist"); // Adjust based on UI
  });
});



  it("14. Should increase product quantity on the product page", () => {
    cy.fixture("products").then(({ products }) => {
      const product = products[0]
      cy.visit(`/product/${product.id}`)

      // Click + button twice to set quantity to 3
      cy.get("button").contains("+").click()
      cy.get("button").contains("+").click()

      // Check quantity is 3
      cy.get("div.h-10").contains("3").should("be.visible")

      cy.get("button").contains("Add to Cart").click()
      cy.get('div[role="status"]').should("contain", "Added to cart")

      // Go to cart and verify quantity
      cy.visit("/cart")
      cy.get("body").should("contain", product.name)
      cy.get("span").contains("3").should("be.visible")
    })
  })

  it("15. Should navigate to the cart page and display added products", () => {
    cy.fixture("products").then(({ products }) => {
      const product = products[0]
      cy.addProductToCart(product.id)
      cy.visit("/cart")
      cy.get("body").should("contain", product.name)
      cy.get("body").should("contain", `₱${product.price.toFixed(2)}`)
    })
  })

  it("16. Should update product quantity in the cart", () => {
    cy.fixture("products").then(({ products }) => {
      const product = products[0]
      cy.addProductToCart(product.id)
      cy.visit("/cart")

      // Increase quantity
      cy.get("button").contains("+").click()
      cy.wait("@updateCart")

      // Check quantity is 2
      cy.get("span").contains("2").should("be.visible")

      // Check subtotal is updated
      const expectedSubtotal = (product.price * 2).toFixed(2)
      cy.get("body").should("contain", `₱${expectedSubtotal}`)
    })
  })

  it("17. Should remove a product from the cart", () => {
    cy.fixture("products").then(({ products }) => {
      const product = products[0]
      cy.addProductToCart(product.id)
      cy.visit("/cart")

      // Remove product
      cy.get('button[aria-label="Remove item"]').click()
      cy.wait("@removeFromCart")

      // Check cart is empty
      cy.get("body").should("contain", "Your cart is empty")
    })
  })

  it("18. Should calculate correct subtotal, tax, and total", () => {
    cy.fixture("products").then(({ products }) => {
      const product1 = products[0]
      const product2 = products[1]

      // Add two different products
      cy.addProductToCart(product1.id)
      cy.addProductToCart(product2.id)

      cy.visit("/cart")

      // Calculate expected values
      const subtotal = product1.price + product2.price
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
