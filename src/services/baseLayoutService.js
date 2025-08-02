import axios from 'axios';
import authService from './authService';

// Replace with your EC2 instance's current Public IP address.
const API_BASE_URL = 'http://localhost:8080';

// Helper function to get the authentication headers with the JWT
const getAuthHeaders = () => {
  const token = authService.getCurrentUserToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

// Function for submitting a new base with an image
const createBase = (title, townhallLevel, baseLink, imageFile) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('townhallLevel', townhallLevel);
  formData.append('baseLink', baseLink);
  formData.append('image', imageFile);

  return axios.post(`${API_BASE_URL}/bases`, formData, {
    headers: {
      ...getAuthHeaders(),
    },
  });
};

const getMyBases = (page = 0, size = 4) => {
  const params = new URLSearchParams({
    page,
    size,
    sort: 'id,desc',
  });

  return axios.get(`${API_BASE_URL}/bases/my-bases?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
};

const baseLayoutService = {
  createBase,
  getMyBases, 
};

export default baseLayoutService;
