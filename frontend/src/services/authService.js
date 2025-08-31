import axios from "axios";

const API_URL = "/api/auth";

export const login = async (email, password, role) => {
  const res = await axios.post(`${API_URL}/login`, { email, password, role });
  return res.data;
};

export const register = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  return res.data;
};
