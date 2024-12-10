describe("Create event", () => {
  const username = "jane.lane";
  const password = "password123";

  it("should login successfully", () => {
    cy.visit("/");
    cy.get('input[name="email"]').type(username);)
});
