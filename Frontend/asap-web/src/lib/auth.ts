export const signUp = async (
  firstname: string,
  lastname: string,
  email: string,
  password: string
) => {
  try {
    // Create user
    const response = await fetch("http://localhost:8000/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstname, lastname, email, password }),
    });

    if (!response.ok) {
      throw new Error("Error during sign-up");
    }

    const user = await response.json();

    // Get JWT
    const tokenRes = await fetch("http://localhost:8000/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // Required for OAuth2PasswordRequestForm
      },
      body: new URLSearchParams({
        username: email,
        password,
      }),
    });

    const token = (await tokenRes.json()).access_token;

    localStorage.setItem("token", token);
    localStorage.setItem("User", JSON.stringify(user));

    return response; // Return the raw response
  } catch (error) {
    console.error("Error during sign-up:", error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const response = await fetch("http://localhost:8000/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // Required for OAuth2PasswordRequestForm
      },
      body: new URLSearchParams({
        username: email,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error("Could not validate user");
    }

    const data = await response.json();
    return data;
    // Redirect or perform further actions after successful authentication
  } catch (error) {
    console.error("Error during sign-in:", error);
    throw error;
  }
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
