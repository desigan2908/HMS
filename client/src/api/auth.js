import axios from "axios";

const API_URL = "/api/auth";

// Register user
export const registerUser = async (userData, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/register`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Registration error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// Login user
export const loginUser = async (userData) => {
  try {
    console.log("Login data being sent:", userData);

    const response = await axios.post(
      `${API_URL}/login`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Login response:", response.data);

    return response.data;

  } catch (error) {
    console.error("Login error:", error);
    console.error("Server response:", error.response?.data);

    throw error;
  }
};