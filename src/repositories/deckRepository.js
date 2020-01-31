import ApiClient from './apiClient'

export default {
  async createGame({ numberPlayers }) {
    const response = await ApiClient.post(`api/Games/shithead`, { NumberPlayers: numberPlayers });
    return response.data;
  },

  async joinGame({ gameId }) {
    const response = await ApiClient.post(`api/Games/shithead/${gameId}/join`);
    return response.data;
  },

  async getPlayerPiles({ gameId, playerId }) {
    const response = await ApiClient.get(`api/Games/shithead/${gameId}/piles`, { headers: { 'X-Player-Id': playerId } });
    return response.data;
  },
};