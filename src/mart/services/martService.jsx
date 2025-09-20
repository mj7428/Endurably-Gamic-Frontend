import axios from 'axios';
import { API_BASE_URL } from '../../config'; 
import authService from '../../services/authService';

const getAuthHeaders = () => {
    const token = authService.getCurrentUserToken();
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};

const getAllCategories = () => {
    return axios.get(`${API_BASE_URL}/api/mart/categories`);
};

const createCategory = (categoryData) => {
    return axios.post(`${API_BASE_URL}/api/mart/categories`, categoryData, {
        headers: getAuthHeaders(),
    });
};

const uploadImage = (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile); 
    
    const IMAGE_UPLOAD_API_URL = "https://0wfcf7x5t9.execute-api.ap-south-1.amazonaws.com/prod/upload";

    return axios.post(IMAGE_UPLOAD_API_URL, formData, {
        headers: {
            ...getAuthHeaders()
        },
    });
};

const getItemById = (itemId) => {
    return axios.get(`${API_BASE_URL}/api/mart/items/${itemId}`);
};

// This function now only handles creating the item with final data
const createItem = (itemData) => {
    return axios.post(`${API_BASE_URL}/api/mart/items`, itemData, {
        headers: getAuthHeaders(),
    });
};

const getItemsByCategory = (categoryId, pageable) => {
    const params = new URLSearchParams({
        page: pageable.page,
        size: pageable.size,
    });
    return axios.get(`${API_BASE_URL}/api/mart/categories/${categoryId}/items?${params.toString()}`);
};

const getAllItems = (pageable) => {
    const params = new URLSearchParams({
        page: pageable.page,
        size: pageable.size,
    });
    return axios.get(`${API_BASE_URL}/api/mart/items?${params.toString()}`);
};

const getCart = () => {
    return axios.get(`${API_BASE_URL}/api/cart`, { headers: getAuthHeaders() });
};

const addItemToCart = (itemId, quantity) => {
    return axios.post(`${API_BASE_URL}/api/cart/items`, { itemId, quantity }, { headers: getAuthHeaders() });
};

const removeItemFromCart = (itemId) => {
    return axios.delete(`${API_BASE_URL}/api/cart/items/${itemId}`, { headers: getAuthHeaders() });
};

const updateItemQuantityFromCart = (itemId, quantity) => {
    return axios.patch(`${API_BASE_URL}/api/cart/items`, { itemId, quantity }, { headers: getAuthHeaders() });
};

const applyCoupon = (code) => {
    return axios.post(`${API_BASE_URL}/api/cart/apply-coupon`, { code }, { headers: getAuthHeaders() });
};

// ✅ NEW: Function to get all available offers for the current cart
const discoverCoupons = () => {
    return axios.get(`${API_BASE_URL}/api/cart/discover-coupons`, { headers: getAuthHeaders() });
};

// ✅ NEW: Function to remove a manually applied coupon
const removeCoupon = () => {
    return axios.delete(`${API_BASE_URL}/api/cart/apply-coupon`, { headers: getAuthHeaders() });
};

const createOrderFromCart = () => {
    return axios.post(`${API_BASE_URL}/api/orders`, {}, { headers: getAuthHeaders() });
};

const getOrderHistory = () => {
    return axios.get(`${API_BASE_URL}/api/orders`, { headers: getAuthHeaders() });
};

// ✅ NEW: Address Functions
const getAddresses = () => {
    return axios.get(`${API_BASE_URL}/api/addresses`, { headers: getAuthHeaders() });
};

const addAddress = (addressData) => {
    return axios.post(`${API_BASE_URL}/api/addresses`, addressData, { headers: getAuthHeaders() });
};

// ✅ UPDATED: Order Function
const createOrder = (orderData) => {
    return axios.post(`${API_BASE_URL}/api/orders`, orderData, { headers: getAuthHeaders() });
};


const martService = {
    getAllCategories,
    getItemsByCategory,
    createCategory,
    createItem,
    uploadImage,
    getItemById,
    getAllItems,
    getCart,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantityFromCart,
    applyCoupon,
    removeCoupon,
    discoverCoupons,
    createOrderFromCart,
    getOrderHistory,
    getAddresses,
    addAddress,
    createOrder
};

export default martService;

