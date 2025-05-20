describe("Authentication", () => {
  beforeEach(() => {
    cy.interceptApi()
  })

  it("1. Should allow a user to login with valid credentials", () => {
    cy.fixture("user").then(({ regularUser }) => {
      cy.visit("/auth/login")
      cy.get('input[id="email"]').type(regularUser.email)
      cy.get('input[id="password"]').type(regularUser.password)
      cy.get('button[type="submit"]').click()
      cy.wait("@login")
      cy.url().should("eq", Cypress.config().baseUrl + "/")
      cy.get("body").should("contain", regularUser.name)
    })
  })

  it("2. Should show an error message with invalid credentials", () => {
    cy.visit("/auth/login")
    cy.get('input[id="email"]').type("wrong@example.com")
    cy.get('input[id="password"]').type("wrongpassword")
    cy.get('button[type="submit"]').click()
    cy.wait("@login")
    cy.get('div[role="alert"]').should("be.visible")
    cy.get('div[role="alert"]').should("contain", "Login failed")
  })

  it("3. Should allow a user to register with valid information", () => {
    const uniqueEmail = `test${Date.now()}@example.com`

    cy.visit("/auth/register")
    cy.get('input[id="name"]').type("New Test User")
    cy.get('input[id="email"]').type(uniqueEmail)
    cy.get('input[id="password"]').type("password123")
    cy.get('input[id="confirmPassword"]').type("password123")
    cy.get('button[type="submit"]').click()
    cy.wait("@register")
    cy.url().should("eq", Cypress.config().baseUrl + "/")
    cy.get('div[role="status"]').should("contain", "Registration successful")
  })

  it("4. Should validate password confirmation during registration", () => {
    cy.visit("/auth/register")
    cy.get('input[id="name"]').type("Test User")
    cy.get('input[id="email"]').type("test@example.com")
    cy.get('input[id="password"]').type("password123")
    cy.get('input[id="confirmPassword"]').type("differentpassword")
    cy.get('button[type="submit"]').click()
    cy.get('div[role="alert"]').should("contain", "Passwords don't match")
  })

  it("5. Should allow a user to logout", () => {
    cy.fixture("user").then(({ regularUser }) => {
      cy.login(regularUser.email, regularUser.password)
      cy.visit("/")
      cy.get('button[aria-haspopup="menu"]').click()
      cy.get('div[role="menu"]').contains("Logout").click()
      cy.wait("@logout")
      cy.get('div[role="status"]').should("contain", "Logout successful")
      cy.get("a").contains("Login").should("be.visible")
    })
  })
})
