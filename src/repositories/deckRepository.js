import ApiClient from './apiClient'

export default {
  createDeck({ deckCount, shuffled, includeJokers }) {
    return ApiClient
      .post(`api/Deck`, { deck_count: deckCount, shuffled: shuffled, include_jokers: includeJokers })
      .then(response => response.data)
  },
};