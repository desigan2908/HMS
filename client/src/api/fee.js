import axios from "axios";

const API_URL = "/api/fees";

// Student: get my fees
export const getMyFees = async (token) => {
  const response = await axios.get(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Admin: get all fees
export const getFees = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Admin: create fee
export const createFee = async (feeData, token) => {
  const response = await axios.post(API_URL, feeData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// Admin: update fee
export const updateFee = async (id, feeData, token) => {
  const response = await axios.put(`${API_URL}/${id}`, feeData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// Admin: delete fee
export const deleteFee = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

