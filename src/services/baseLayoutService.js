import axios from 'axios';
import authService from './authService';
import { API_BASE_URL } from '../config'; 

const getAuthHeaders = () => {
  const token = authService.getCurrentUserToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

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


const getAll = (pageable, townhallLevel) => {
    const params = new URLSearchParams({
        page: pageable.page,
        size: pageable.size,
        sort: 'id,desc',
    });

    if (townhallLevel) {
        params.append('townhallLevel', townhallLevel);
    }

    return axios.get(`${API_BASE_URL}/bases?${params.toString()}`);
};

const baseLayoutService = {
  createBase,
  getMyBases, 
  getAll
};

export default baseLayoutService;
