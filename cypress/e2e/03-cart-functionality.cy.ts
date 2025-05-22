describe("Cart Functionality", () => {
  beforeEach(() => {
    cy.interceptApi();
    cy.fixture("user").then(({ regularUser }) => {
      cy.login(regularUser.email, regularUser.password);
    });
    cy.clearCart();
  });
  
  

  describe("Adding Products to Cart", () => {
    it("Should add a product to the cart", () => {
      cy.fixture("products").then(({ products }) => {
        const product = products[0];
        cy.visit(`/product/${product.id}`);
        cy.get("button").contains("Add to Cart").click();
        
      })
    })

    it("2. Should increase product quantity on the product page", () => {
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
      })
    })

  
    describe("Cart Management", () => {
      it("3. Should navigate to the cart page and display added products", () => {
        cy.fixture("products").then(({ products }) => {
          const product = products[0]
          cy.addProductToCart(product.id)
          cy.visit("/cart")
          cy.get("body").should("contain", product.name)
          cy.get("body").should("contain", `₱${product.price.toFixed(2)}`)
        })
      })

    it("4. Should update product quantity in the cart", () => {
      cy.fixture("products").then(({ products }) => {
        const product = products[0]
        cy.addProductToCart(product.id)
        cy.visit("/cart")
        cy.get('button.border-input').first().click(); // Clicks the first matching button
        cy.wait("@updateCart")
        cy.get("span").contains("2").should("be.visible")
        const expectedSubtotal = (product.price * 2).toFixed(2)
        cy.get("body").should("contain", `₱${expectedSubtotal}`)
      })
    })

    it("5. Should remove a product from the cart", () => {
      cy.fixture("products").then(({ products }) => {
        const product = products[0]
        cy.addProductToCart(product.id)
        cy.visit("/cart")
        cy.get('button.text-red-500').click()
        cy.wait("@removeFromCart")
        cy.get("body").should("contain", "Your cart is empty")
      })
    })

  })


  })
})


