export const signUp = async (
  firstname: string,
  lastname: string,
  email: string,
  password: string
) => {
  try {
    const response = await fetch("http://localhost:8000/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstname, lastname, email, password }),
    });

    const data = await response.json();
    console.log("Data:", data);

    if (!response.ok) {
      throw new Error("Error during sign-up");
    }

    // localStorage.setItem("token", data.token);
    console.log("User data before storing in localStorage:", data);
    localStorage.setItem("User", JSON.stringify(data));
    console.log("User data after storing in localStorage:", data);

    return response; // Return the raw response
  } catch (error) {
    console.error("Error during sign-up:", error);
    throw error;
  }
};

export const signIn = async (email: string) => {
  try {
    const response = await fetch(`http://localhost:8000/users/email/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("User not found or error during sign-in");
    }

    const user = await response.json();

    // Store user details in localStorage
    localStorage.setItem("User", JSON.stringify(user));

    return user;
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