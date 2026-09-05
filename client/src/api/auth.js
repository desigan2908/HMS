import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Register user (Admin creates another admin)
export const registerUser = async (userData, token) => {
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
};

// Login user
export const loginUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}/login`,
    userData
  );

  return response.data;
};