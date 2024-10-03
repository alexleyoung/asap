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
    body: JSON.stringify({firstName, lastName, email, password}),
  });
  //   const data = await response.json();
  //   if (!response.ok) {
  //     throw new Error(data.error || "Something went wrong");
  //   }
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
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
};
