import axios from "axios";

const API_URL = "/api/complaints";

// Student: submit a complaint
export const createComplaint = async (complaintData, token) => {
  const response = await axios.post(API_URL, complaintData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// Student: get my complaints
export const getMyComplaints = async (token) => {
  const response = await axios.get(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Admin: get all complaints
export const getComplaints = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Admin: update complaint status
export const updateComplaint = async (id, complaintData, token) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    complaintData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};