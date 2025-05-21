describe("Product Browsing", () => {
  beforeEach(() => {
    cy.interceptApi()
    cy.visit("/")
  })

  it("6. Should display featured products on the homepage", () => {
    cy.get("h2").contains("Featured Products").should("be.visible")
    cy.get("div").contains("Featured Products").next().find("a").should("have.length.at.least", 1)
  })

  it("7. Should navigate to product details page when clicking on a product", () => {
    cy.get("div").contains("Featured Products").next().find("a").first().click()
    cy.url().should("include", "/product/")
    cy.get("h1").should("be.visible")
    cy.get("p").contains("₱").should("be.visible")
  })

  it("8. Should display product details correctly", () => {
    cy.fixture("products").then(({ products }) => {
      const product = products[0]
      cy.visit(`/product/${product.id}`)
      cy.get("h1").should("contain", product.name)
      cy.get("p").contains("₱").should("be.visible")
      cy.get("p").contains(product.description).should("be.visible")
    })
  })

  it("9. Should navigate to products page and show all products", () => {
    cy.get("a").contains("Products").click()
    cy.url().should("include", "/products")
    cy.get("h1").contains("Our Products").should("be.visible")
  })

  it("10. Should filter products by category", () => {
    // Navigate to products page
    cy.get("a").contains("Products").click()
    cy.url().should("include", "/products")
  

    // Select a category filter
    cy.get("label").contains("Cakes")
      .should("be.visible")
      .click({ force: true })

    // Apply filters
    cy.get("button").contains("Apply Filters")
      .should("be.visible")
      .click({ force: true })

    // Verify URL includes category parameter
    cy.url().should("include", "category=cakes")
    
  })

  it("11. Should filter products can be reset", () => {
    // Navigate to products page
    cy.get("a").contains("Products").click()
    cy.url().should("include", "/products")

    // Select a category filter
    cy.get("label").contains("Cakes")
      .should("be.visible")
      .click({ force: true })

    // Apply filters
    cy.get("button").contains("Apply Filters")
      .should("be.visible")
      .click({ force: true })

    // Verify URL includes category parameter
    cy.url().should("include", "category=cakes")

    cy.get("button").contains("Reset")
      .should("be.visible")
      .click();

    cy.get("div").contains("Showing 5 products")
      .should("exist"); // Ensures the correct message appears after resetting

  })

  

  it("12. Should search for products", () => {
    // Navigate to products page
    cy.get("a").contains("Products").click()
    cy.url().should("include", "/products")

    // Type in search box
    cy.get('input[id="search"]')
      .should("be.visible")
      .type("Chocolate", { force: true })

    // Click Apply Filters button
    cy.get("button").contains("Apply Filters")
      .should("be.visible")
      .click({ force: true })

    // Verify URL includes search parameter
    cy.url().should("include", "search=Chocolate")


    // Click Apply Filters button for no results case
    cy.get("button").contains("Apply Filters")
      .should("be.visible")
      .click({ force: true })


  })
})

  
