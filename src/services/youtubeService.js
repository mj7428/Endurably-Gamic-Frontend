import axios from 'axios';
import { API_BASE_URL } from '../config'; // Assuming you have this config file

/**
 * Searches for videos by calling our secure backend endpoint.
 * @param {string} query The search term (e.g., "TH14 Attack Strategy").
 * @returns {Promise<axios.AxiosResponse<string[]>>} A promise that resolves to a list of video IDs.
 */
const searchVideos = (query) => {
    const params = new URLSearchParams({ query });
    return axios.get(`${API_BASE_URL}/api/videos/search?${params.toString()}`);
};

/**
 * ✅ NEW: Fetches the most recent videos from the channel.
 * @returns {Promise<axios.AxiosResponse<string[]>>} A promise that resolves to a list of video IDs.
 */
const getRecentVideos = () => {
    return axios.get(`${API_BASE_URL}/api/videos/recent`);
};


const youtubeService = {
    searchVideos,
    getRecentVideos, // ✅ Export the new function
};

export default youtubeService;
