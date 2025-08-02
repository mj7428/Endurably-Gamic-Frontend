import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const register = (name, email, password, role) => {
  return axios.post(`${API_BASE_URL}/user`, {
    name,
    email,
    password,
    role,
  });
};

const login = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/user/login`, {
    email,
    password,
  });
  if (response.data.token) {
    // Store the token in the browser's local storage for persistence
    localStorage.setItem('userToken', response.data.token);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('userToken');
};

const getCurrentUserToken = () => {
  return localStorage.getItem('userToken');
};

const authService = {
  register,
  login,
  logout,
  getCurrentUserToken,
};

export default authService;
