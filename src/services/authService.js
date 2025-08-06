import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import { API_BASE_URL } from '../config'; 


const register = (name, email, password, role) => {
  return axios.post(`${API_BASE_URL}/users`, {
    name,
    email,
    password,
    role,
  });
};

const login = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  });
  if (response.data.token) {
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

const getCurrentUser = () => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    return null;
  }
  try {
    const decodedToken = jwtDecode(token);
    return {
      email: decodedToken.sub,
      roles: decodedToken.authorities || [],
    };
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};


const authService = {
  register,
  login,
  logout,
  getCurrentUserToken,
  getCurrentUser
};

export default authService;
