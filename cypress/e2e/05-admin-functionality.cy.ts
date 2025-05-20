describe("Admin Functionality", () => {
  beforeEach(() => {
    cy.interceptApi()
    cy.adminLogin()
  })

  it("24. Should access admin dashboard", () => {
    cy.visit("/admin")
    cy.get("h1").contains("Admin Dashboard").should("be.visible")
    cy.get("div").contains("Total Products").should("be.visible")
    cy.get("div").contains("Total Users").should("be.visible")
    cy.get("div").contains("Total Orders").should("be.visible")
    cy.get("div").contains("Total Revenue").should("be.visible")
  })

  it("25. Should navigate to products management page", () => {
    cy.visit("/admin")
    cy.get("a").contains("Products").click()
    cy.url().should("include", "/admin/products")
    cy.get("h1").contains("Products").should("be.visible")
    cy.get("button").contains("Add Product").should("be.visible")
  })

  it("26. Should add a new product", () => {
    cy.visit("/admin/products")
    cy.get("button").contains("Add Product").click()
    cy.url().should("include", "/admin/products/new")

    cy.fixture("products").then(({ newProduct }) => {
      // Fill product form
      cy.get('input[id="name"]').type(newProduct.name)
      cy.get('textarea[id="description"]').type(newProduct.description)
      cy.get('textarea[id="details"]').type(newProduct.details)
      cy.get('textarea[id="ingredients"]').type(newProduct.ingredients)
      cy.get('input[id="price"]').type(newProduct.price.toString())
      cy.get('input[id="image"]').type(newProduct.image)

      // Select category
      cy.get('button[id="category"]').click()
      cy.get('div[role="option"]')
        .contains(newProduct.category.charAt(0).toUpperCase() + newProduct.category.slice(1))
        .click()

      // Set rating and reviews
      cy.get('input[id="rating"]').type("4.5")
      cy.get('input[id="reviews"]').type("0")

      // Set checkboxes
      if (newProduct.isNew) {
        cy.get('input[id="isNew"]').check()
      }
      if (newProduct.isFeatured) {
        cy.get('input[id="isFeatured"]').check()
      }

      // Submit form
      cy.get('button[type="submit"]').contains("Create Product").click()
      cy.wait("@createProduct")

      // Check success message and redirect
      cy.get('div[role="status"]').should("contain", "Product created")
      cy.url().should("include", "/admin/products")

      // Check product is in the list
      cy.get("table").should("contain", newProduct.name)
    })
  })

  it("27. Should edit an existing product", () => {
    cy.visit("/admin/products")

    // Click on edit button of first product
    cy.get("button").contains("More").first().click()
    cy.get("a").contains("Edit").click()

    // Update product name
    const updatedName = "Updated Product Name " + Date.now()
    cy.get('input[id="name"]').clear().type(updatedName)

    // Submit form
    cy.get('button[type="submit"]').contains("Update Product").click()
    cy.wait("@updateProduct")

    // Check success message and redirect
    cy.get('div[role="status"]').should("contain", "Product updated")
    cy.url().should("include", "/admin/products")

    // Check product name is updated
    cy.get("table").should("contain", updatedName)
  })

  it("28. Should delete a product", () => {
    cy.visit("/admin/products")

    // Get product name before deletion
    cy.get("table tbody tr").first().find("td").eq(1).invoke("text").as("productName")

    // Click on delete button of first product
    cy.get("button").contains("More").first().click()
    cy.get('div[role="menuitem"]').contains("Delete").click()

    // Confirm deletion
    cy.get("button").contains("Delete").click()
    cy.wait("@deleteProduct")

    // Check success message
    cy.get('div[role="status"]').should("contain", "Product deleted")

    // Check product is removed from the list
    cy.get("@productName").then((productName) => {
      cy.get("table").should("not.contain", productName)
    })
  })

  it("29. Should navigate to orders management page", () => {
    cy.visit("/admin")
    cy.get("a").contains("Orders").click()
    cy.url().should("include", "/admin/orders")
    cy.get("h1").contains("Orders").should("be.visible")
  })

  it("30. Should navigate to users management page", () => {
    cy.visit("/admin")
    cy.get("a").contains("Users").click()
    cy.url().should("include", "/admin/users")
    cy.get("h1").contains("Users").should("be.visible")

    // Check admin and regular users are listed
    cy.fixture("user").then(({ regularUser, adminUser }) => {
      cy.get("table").should("contain", regularUser.email)
      cy.get("table").should("contain", adminUser.email)
    })
  })
})
