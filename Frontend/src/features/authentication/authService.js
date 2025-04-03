export const login = async (email, password) => {
  // Simulate an API call for user login
  try {
    // Replace with actual API call
    const response = await fakeApiCall({ email, password });
    return response.token; // Return the authentication token
  } catch (error) {
    throw new Error("Login failed");
  }
};

export const resetPassword = async (email) => {
  // Simulate an API call for password reset
  try {
    // Replace with actual API call
    await fakeApiCall({ email });
    return "Password reset email sent";
  } catch (error) {
    throw new Error("Password reset failed");
  }
};

// Simulated API call (replace with real API logic)
const fakeApiCall = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ token: "fake-token", ...data });
    }, 1000);
  });
};
