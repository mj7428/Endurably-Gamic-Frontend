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

/**
 * NEW: Sends a request to start the tournament and generate matches.
 * @param {number} tournamentId The ID of the tournament to start.
 */
const startTournament = (tournamentId) => {
    return axios.post(`${API_BASE_URL}/tournaments/${tournamentId}/start`, {}, {
        headers: getAuthHeaders()
    });
};

/**
 * ✅ NEW: Declares a winner for a specific match.
 * @param {number} tournamentId The ID of the tournament.
 * @param {number} matchId The ID of the match to update.
 * @param {object} data The request body, containing { winnerTeamId }.
 */
const declareWinner = (tournamentId, roundNumber, matchNumber, data) => {
    return axios.post(`${API_BASE_URL}/tournaments/${tournamentId}/rounds/${roundNumber}/matches/${matchNumber}/winner`, data, {
        headers: getAuthHeaders()
    });
};

const tournamentService = {
  getAllTournaments,
  createTournament,
  getTournamentById, 
  registerTeam,     
  getRegistrationsForTournament,
  startTournament,
  declareWinner 
};

export default tournamentService;
