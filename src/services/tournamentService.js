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

const getAllTournaments = (page = 0, size = 10) => {
  const params = new URLSearchParams({
    page,
    size,
    sort: 'startDate,asc',
  });
  return axios.get(`${API_BASE_URL}/tournaments?${params.toString()}`);
};

const createTournament = (tournamentData) => {
  return axios.post(`${API_BASE_URL}/tournaments`, tournamentData, {
    headers: getAuthHeaders(),
  });
};

const getTournamentById = (id) => {
  return axios.get(`${API_BASE_URL}/tournaments/${id}`, {
    headers: getAuthHeaders(),
  });
};

const registerTeam = (tournamentId, registrationData) => {
    return axios.post(`${API_BASE_URL}/tournaments/${tournamentId}/register`, registrationData, {
        headers: getAuthHeaders(),
    });
};

const getRegistrationsForTournament = (tournamentId) => {
    return axios.get(`${API_BASE_URL}/tournaments/${tournamentId}/registrations`, {
        headers: getAuthHeaders(),
    });
};

const tournamentService = {
  getAllTournaments,
  createTournament,
  getTournamentById, 
  registerTeam,     
  getRegistrationsForTournament 
};

export default tournamentService;
