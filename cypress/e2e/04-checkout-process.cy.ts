describe("Checkout Process", () => {
  beforeEach(() => {
    cy.interceptApi()
    cy.fixture("user").then(({ regularUser }) => {
      cy.login(regularUser.email, regularUser.password)
    })
  })

  afterEach(() => {
    // Clean up after each test
    cy.clearCart()
  })

  describe("Checkout Navigation", () => {
    it("1. Should navigate to checkout from cart", () => {
       cy.fixture("products").then(({ products }) => {
        const product = products[0]
        cy.visit(`/product/${product.id}`)
        cy.get('button.rounded-r-lg').click();
        cy.get('button.rounded-r-lg').click();
        cy.get("div.h-10").contains("3").should("be.visible")
        cy.get("button").contains("Add to Cart").click()
        cy.visit("/cart")
        cy.get("body").should("contain", product.name)
        cy.get("span").contains("3").should("be.visible")
        
        cy.get('button.bg-primary').first().click();
        cy.url().should("include", "/checkout");
      })
    })
  })

  describe("Shipping Information", () => {
    it("2. Should fill out shipping information and proceed", () => {
      cy.fixture("products").then(({ products }) => {
        const product = products[0]
        cy.visit(`/product/${product.id}`)
        cy.get('button.rounded-r-lg').click();
        cy.get('button.rounded-r-lg').click();
        cy.get("div.h-10").contains("3").should("be.visible")
        cy.get("button").contains("Add to Cart").click()
        cy.visit("/cart")
        cy.get("body").should("contain", product.name)
        cy.get("span").contains("3").should("be.visible")
        
        cy.get('button.bg-primary').first().click();
        
        // Fill shipping info
        cy.get('input[id="name"]').type("John Doe")
        cy.get('input[id="address"]').type("123 Main St")
        cy.get('input[id="city"]').type("Manila")
        cy.get('input[id="state"]').type("Metro Manila")
        cy.get('input[id="zipCode"]').type("1000")
        cy.get('input[id="phone"]').type("09123456789")
        
        // Select payment method  
        cy.get('button[value="cash"]').click();
        // Place order
        cy.get("button").contains("Place Order").click()
        
        cy.get("body").should("contain", "Your cart is empty")
      })
    })

    it("3. Should validate required fields in checkout form", () => {
      cy.fixture("products").then(({ products }) => {
        const product = products[0]
        cy.visit(`/product/${product.id}`)
        cy.get('button.rounded-r-lg').click();
        cy.get('button.rounded-r-lg').click();
        cy.get("div.h-10").contains("3").should("be.visible")
        cy.get("button").contains("Add to Cart").click()
        cy.visit("/cart")
        cy.get("body").should("contain", product.name)
        cy.get("span").contains("3").should("be.visible")
        
        cy.get('button.bg-primary').first().click();
        
        // Submit form without filling required fields
        cy.get("button").contains("Place Order").click()
        
        // Check for validation messages
        // Verify the built-in validation
        cy.get('input[id="address"]').should('have.attr', 'required')

      })
    })
  })

  })

