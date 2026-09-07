import axios from "axios";

const API_URL = "/api/room-allocations";

// Student: get my room allocation
export const getMyRoomAllocation = async (token) => {
  const response = await axios.get(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Admin: get all room allocations
export const getRoomAllocations = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Admin: create room allocation
export const createRoomAllocation = async (
  allocationData,
  token
) => {
  const response = await axios.post(
    API_URL,
    allocationData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// Admin: get allocation by ID
export const getRoomAllocationById = async (
  id,
  token
) => {
  const response = await axios.get(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Admin: get allocation for a specific student
export const getStudentRoomAllocation = async (
  studentId,
  token
) => {
  const response = await axios.get(
    `${API_URL}/student/${studentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Admin: vacate allocation
export const vacateRoomAllocation = async (
  id,
  token
) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};