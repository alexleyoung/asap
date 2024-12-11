describe("Register", () => {
  const firstname = "John";
  const lastname = "Doe";
  const email = "cytest@test.com";
  const password = "1234567!";

  it("should register successfully", () => {
    cy.visit("/");
    cy.get("a").contains("Sign Up").click();
    cy.get('input[name="firstname"]').type(firstname);
    cy.get('input[name="lastname"]').type(lastname);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="confirmpassword"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/dashboard");
  });
});
