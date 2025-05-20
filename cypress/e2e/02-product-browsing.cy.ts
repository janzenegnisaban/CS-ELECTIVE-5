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
    cy.get('div[class*="product-grid"]').should("exist")
    cy.get('div[class*="product-grid"]').find("a").should("have.length.at.least", 1)
  })

  it("10. Should filter products by category", () => {
    cy.visit("/products")
    cy.get("label").contains("Cakes").click()
    cy.get("button").contains("Apply Filters").click()
    cy.url().should("include", "category=cakes")
    cy.get('div[class*="product-grid"]')
      .find("a")
      .each(($el) => {
        cy.wrap($el).should("contain", "Cake")
      })
  })

  it("11. Should filter products by price range", () => {
    cy.visit("/products")
    // Set price range (this is a simplified version, adjust based on your actual UI)
    cy.get("span")
      .contains("Price Range")
      .parent()
      .find('input[type="range"]')
      .first()
      .invoke("val", 20)
      .trigger("change")
    cy.get("span")
      .contains("Price Range")
      .parent()
      .find('input[type="range"]')
      .last()
      .invoke("val", 50)
      .trigger("change")
    cy.get("button").contains("Apply Filters").click()
    cy.url().should("include", "min=20")
    cy.url().should("include", "max=50")
  })

  it("12. Should search for products by name", () => {
    cy.visit("/products")
    cy.get('input[placeholder*="Search"]').type("Chocolate")
    cy.get("button").contains("Apply Filters").click()
    cy.url().should("include", "search=Chocolate")
    cy.get('div[class*="product-grid"]').find("a").should("contain", "Chocolate")
  })
})
