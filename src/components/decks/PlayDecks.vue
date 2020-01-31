<script>
import PlayCard from './PlayCard.vue'
import PlayCardHidden from './PlayCardHidden.vue'

export default {
  inject: ['deckRepository'],

  components: {
    PlayCard,
    PlayCardHidden,
  },

  data() {
    let storedGameId = localStorage.getItem('temp-game-id')
    let storedPlayerId = localStorage.getItem('temp-player-id')

    return {
      hadStoredIds: !!storedGameId && !!storedPlayerId,

      busyCreating: false,
      busyJoining: false,
      busyGettingPiles: false,

      gameId: storedGameId || undefined,
      playerId: storedPlayerId || undefined,
      piles: undefined,
    }
  },

  watch: {
    playerId(to) {
      if (to) {
        localStorage.setItem('temp-game-id', this.gameId)
        localStorage.setItem('temp-player-id', to)
      }
    },
  },
}
</script>

<template>
  <div>
    <PromiseHeadless
      v-if="!hadStoredIds"
      :factory="deckRepository.createGame"
      :arg="{numberPlayers: 2}"
      :busy.sync="busyCreating"
      @then="gameId=$event.id" />

    <PromiseHeadless
      v-if="gameId && !hadStoredIds"
      :factory="deckRepository.joinGame"
      :arg="{gameId: gameId}"
      :busy.sync="busyJoining"
      @then="playerId = $event.playerId" />

    <PromiseHeadless
      v-if="playerId"
      :factory="deckRepository.getPlayerPiles"
      :arg="{gameId: gameId, playerId: playerId}"
      :busy.sync="busyGettingPiles"
      @then="piles = $event" />

    <v-container v-if="piles" class="grey lighten-5">

      <v-row no-gutters justify="center">

        <v-col
          v-for="card in piles.handCards"
          :key="card.id"
          cols="6"
          sm="4">

          <PlayCard
            v-bind="card"
            class="pa-2 ma-2" />

        </v-col>

      </v-row>

      <v-divider />

      <v-row no-gutters justify="center">

        <v-col
          v-for="card in piles.faceUpCards"
          :key="card.id"
          cols="6"
          sm="4">

          <PlayCard
            v-bind="card"
            class="pa-2 ma-2" />

        </v-col>

      </v-row>

      <v-divider />

      <v-row no-gutters justify="center">

        <v-col
          v-for="card in piles.faceDownCards"
          :key="card.id"
          cols="6"
          sm="4">

          <PlayCardHidden
            v-bind="card"
            class="pa-2 ma-2" />

        </v-col>

      </v-row>

    </v-container>

  </div>
</template>