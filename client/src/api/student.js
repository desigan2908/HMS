import axios from "axios";

const API_URL = "/api/students";

// Get all students (Admin)
export const getStudents = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Get one student by ID (Admin)
export const getStudentById = async (id, token) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Create student (Admin)
export const createStudent = async (studentData, token) => {
  const response = await axios.post(API_URL, studentData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// Update student (Admin)
export const updateStudent = async (id, studentData, token) => {
  const response = await axios.put(`${API_URL}/${id}`, studentData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// Delete student (Admin)
export const deleteStudent = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Student login
export const loginStudent = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    username,
    password,
  });

  return response.data;
};