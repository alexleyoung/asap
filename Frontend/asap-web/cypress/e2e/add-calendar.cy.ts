describe("Create event", () => {
  const email = "test@test.com";
  const password = "test1234!";

  beforeEach(() => {
    cy.request({
      method: "POST",
      url: "http://localhost:8000/auth/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `username=${email}&password=${password}`,
      failOnStatusCode: false,
    }).then((response) => {
      localStorage.setItem("token", response.body.access_token);
    });

    cy.request({
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      url: `http://localhost:8000/users/email/${email}`,
    }).then((response) => {
      localStorage.setItem("user", JSON.stringify(response.body));
    });
  });

  it("should login successfully", () => {
    cy.viewport(1920, 1080);
    cy.visit("/dashboard");
    cy.get("button").contains("Add Calendar").click();
    cy.get('input[placeholder="Calendar name"]').type("test calendar");
    cy.get('button[type="submit"]').click({ force: true }); // Forces the click even if the button is hidden
  });
});
