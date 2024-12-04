describe("<YourName> System Test", () => {
  beforeEach(() => {
    // Ensure each test starts from a clean slate
    cy.visit("http://localhost:3000"); // Replace with your local dev server URL
  });

  it("should successfully navigate to the login page and display the login form", () => {
    cy.url().should("include", "/"); // Check if URL is correct
    cy.get("form").should("be.visible"); // Check if login form is visible
  });

  it("should fail login with invalid credentials and return 401", () => {
    // Intercept the login API request to capture the response
    cy.intercept("POST", "/auth/token").as("loginRequest");

    cy.visit("http://localhost:3000");
    cy.get('input[name="email"]').type("invalid@example.com");
    cy.get('input[name="password"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();

    // Wait for the intercepted request and assert the status
    cy.wait("@loginRequest").its("response.statusCode").should("eq", 401);
  });

  it("should allow navigation to the dashboard after successful login", () => {
    cy.visit("http://localhost:3000");
    cy.get('input[name="email"]').type("test@test.com");
    cy.get('input[name="password"]').type("1234567!");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/dashboard");
  });

  it("should handle add event functionality successfully", () => {
    cy.visit("http://localhost:3000");
    cy.get('input[name="email"]').type("test@test.com");
    cy.get('input[name="password"]').type("1234567!");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/dashboard");

    // Intercept the POST request for adding a calendar
    cy.intercept("POST", "/events", {
      statusCode: 201,
      body: { success: true, message: "Event added successfully" },
    }).as("addEvent");

    cy.contains("button", "Create").click();
    cy.get('input[placeholder="Event title"]').type("New Event");
    cy.get('input[placeholder="Event location"]').type("Location");

    cy.get('button[type="submit"]').click({ force: true }); // Forces the click even if the button is hidden
    cy.wait("@addEvent").its("response.statusCode").should("eq", 201);
  });
});
