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

// Fetches all base layouts with a 'PENDING' status
const getPendingBases = (page = 0, size = 5) => {
    return axios.get(`${API_BASE_URL}/bases/pending?page=${page}&size=${size}`, {
        headers: getAuthHeaders(),
    });
};

// Approves a specific base layout
const approveBase = (baseId) => {
    return axios.post(`${API_BASE_URL}/bases/${baseId}/approve`, {}, {
        headers: getAuthHeaders()
    });
};

// Rejects a specific base layout
const rejectBase = (baseId) => {
    return axios.post(`${API_BASE_URL}/bases/${baseId}/reject`, {}, {
        headers: getAuthHeaders()
    });
};

const patchBaseLayout = (baseId, updateData) => {
    return axios.patch(`${API_BASE_URL}/bases/${baseId}`, updateData, {
        headers: getAuthHeaders()
    });
};

const getRecentOrders = (page = 0, size = 5) => {
    const params = new URLSearchParams({ page, size });
    return axios.get(`${API_BASE_URL}/api/orders/recent?${params.toString()}`, {
        headers: getAuthHeaders()
    });
};

const updateOrderStatus = (orderId, newStatus) => {
    return axios.patch(`${API_BASE_URL}/api/orders/${orderId}/status`, { newStatus }, {
        headers: getAuthHeaders()
    });
};

const adminService = {
    getPendingBases,
    approveBase,
    rejectBase,
    patchBaseLayout,
    getRecentOrders,      
    updateOrderStatus 
};

export default adminService;
