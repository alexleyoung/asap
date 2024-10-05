export const signUp = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const response = await fetch("http://localhost:8000/users/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firstName, lastName, email, password }),
  });

  return response;
};
export const signIn = async (email: string, password: string) => {
  const response = await fetch("http://localhost:8000/users/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return response;
};
const getProtectedData = async (endpoint: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Unauthorized");
  }
  const response = await fetch(`http://localhost:8000/${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${endpoint}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response.json();
};
export { getProtectedData };
