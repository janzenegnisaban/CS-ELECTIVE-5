describe("Admin Functionality", () => {
  beforeEach(() => {
    cy.interceptApi()
    cy.adminLogin()
  })

  it("1. Should access admin dashboard", () => {
    cy.visit("/admin")
    cy.get("h1").contains("Admin Dashboard").should("be.visible")
    cy.get("div").contains("Total Products").should("be.visible")
    cy.get("div").contains("Total Users").should("be.visible")
    cy.get("div").contains("Total Orders").should("be.visible")
    cy.get("div").contains("Total Revenue").should("be.visible")
  })

  it("2. Should navigate to admin products page", () => {
      cy.visit("/admin/products")
      cy.get("h1").contains("Products").should("be.visible")
      cy.get('a[href="/admin/products/new"]').click();
      cy.url().should("include", "/admin/products/new")

    })


  it("3. Should add a new product", () => {
    cy.visit("/admin/products")
    cy.get('a[href="/admin/products/new"]').click();
    cy.url().should("include", "/admin/products/new")
  
    cy.fixture("products").then(({ newProduct }) => {
      // Fill product form
      cy.get('input[name="name"]').type("Wedding Cake");
      cy.get('input[name="price"]').clear().type("100");
      cy.get('textarea[name="description"]').type("A rich and creamy chocolate cake, perfect for celebrations.");
      cy.get('textarea[name="details"]').type("This wedding cake features layers of rich vanilla sponge, filled with buttercream and raspberry jam, covered in fondant.");
      cy.get('textarea[name="ingredients"]').type("Flour, Sugar, Eggs, Cocoa Powder, Butter, Vanilla Extract.");
      cy.get('input[name="image"]').clear().type("https://example.com/my-wedding-cake.jpg");
      cy.get('button[role="combobox"]').click();
      cy.get('div[role="option"]').contains("Cakes").click();
      cy.get('input[name="rating"]').clear().type("4.5");
      cy.get('input[name="reviews"]').clear().type("150");
      cy.contains("Mark as New").click();
      cy.contains("Feature on Homepage").click();
      cy.get('button[type="submit"]').contains("Create Product").click();

      // Verify the new product appears in the list
      cy.get("table").should("contain", "Wedding Cake");
      cy.url().should("include", "/admin/products")

      // Check product is in the list
      cy.get("table").should("contain", "Wedding Cake")
    })
  })

  it("4. Should edit an existing product", () => {
    cy.visit("/admin/products")

    // Click on edit button of first product
    cy.get('button[aria-haspopup="menu"]').first().click();
    cy.get("a").contains("Edit").click()

    
    // Fill product form with a new entry
    cy.get('input[name="name"]').type("White Chocolate Cake for Edit");
    cy.get('input[name="price"]').clear().type("250");
    cy.get('textarea[name="description"]').clear().type("This is a temporary test product for editing.");
    cy.get('textarea[name="details"]').clear().type("A placeholder cake used for Cypress testing.");
    cy.get('textarea[name="ingredients"]').clear().type("Flour, Eggs, Sugar, Butter, Vanilla Extract.");
    cy.get('input[name="image"]').clear().clear().type("https://example.com/test-cake.jpg");

    // Select category
    cy.get('button[role="combobox"]').click();
    cy.get('div[role="option"]').contains("Cakes").click();

    // Set rating and reviews
    cy.get('input[name="rating"]').clear().type("4.0");
    cy.get('input[name="reviews"]').clear().type("10");

    // Mark as new and feature it
    cy.contains("Mark as New").click();
    cy.contains("Feature on Homepage").click();

    // Submit the new product
    cy.get('button[type="submit"]').contains("Update Product").click();

    // Validate the new product appears in the list
    cy.get("table").should("contain", "White Chocolate Cake for Edit");
    cy.url().should("include", "/admin/products");
  })

  it("5. Should delete a product", () => {
  cy.visit("/admin/products");

  // Get the first product's name before deletion
  cy.get("table tbody tr").first().find("td").eq(1).invoke("text").as("productName");

  // Open product actions menu
  cy.get('button[aria-haspopup="menu"]').first().click();
  cy.contains("Delete").should("be.visible").click();

  // Confirm deletion if modal appears
  cy.get('button.bg-red-600').click();
  cy.wait("@deleteProduct"); 
});



  it("6. Should navigate to orders management page", () => {
    cy.visit("/admin")
    cy.get("a").contains("Orders").click()
    cy.url().should("include", "/admin/orders")
    cy.get("h1").contains("Orders").should("be.visible")
  })

})
