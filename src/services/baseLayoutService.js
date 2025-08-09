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

const createBase = async (title, townhallLevel, baseLink, imageFile) => {
  const IMAGE_UPLOAD_API_URL = "https://0wfcf7x5t9.execute-api.ap-south-1.amazonaws.com/prod/upload";

  
   try {
    const imageFormData = new FormData();
    imageFormData.append('file', imageFile);

    const uploadResponse = await axios.post(IMAGE_UPLOAD_API_URL, imageFormData, {
      headers: {
        ...getAuthHeaders(),
      },
    });


    const imageUrl = uploadResponse.data.imageUrl;

    const baseData = {
      title,
      townhallLevel,
      baseLink,
      imageUrl,
    };

    const createResponse = await axios.post(`${API_BASE_URL}/bases`, baseData, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    
    return createResponse;

  } catch (error) {
    throw error;
  }
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
