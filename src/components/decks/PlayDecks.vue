<script>
import PlayCard from './PlayCard.vue'

export default {
  inject: ['deckRepository'],

  components: {
    PlayCard,
  },

  data() {
    let storedGameId = localStorage.getItem('temp-game-id')
    let storedPlayerId = localStorage.getItem('temp-player-id')

    return {
      hadStoredIds: !!storedGameId && !!storedPlayerId,

      busyCreating: false,
      busyJoining: false,
      busyGettingPiles: false,
      busyPlayingCards: false,

      gameId: storedGameId || undefined,
      playerId: storedPlayerId || undefined,
      pilesResponse: undefined,

      playCardsPayload: undefined,
      triggerPlayCards: 0,
      triggerGetPlayerPiles: 0,
    }
  },

  computed: {
    canPlayFaceUp() { return this.pilesResponse.handCards.length === 0 },
    canPlayFaceDown() { return this.pilesResponse.handCards.length === 0 && this.pilesResponse.faceUpCards.length === 0 },
  },

  watch: {
    playerId(to) {
      if (to) {
        localStorage.setItem('temp-game-id', this.gameId)
        localStorage.setItem('temp-player-id', to)
      }
    },
  },

  methods: {
    onHandCardClick(card) {
      console.debug('onHandCardClick', card)
      this.playCards([card.id])
    },

    onFaceUpCardClick(card) {
      if (!this.canPlayFaceUp) {
        console.debug('Cannot play FaceUp cards currently')
        return
      }

      console.debug('onFaceUpCardClick', card)
      this.playCards([card.id])
    },

    onFaceDownCardClick(card) {
      if (!this.canPlayFaceDown) {
        console.debug('Cannot play FaceDown cards currently')
        return
      }

      console.debug('onFaceDownCardClick', card)
      this.playCards([card.id])
    },

    playCards(cardIds) {
      this.playCardsPayload = {
        gameId: this.gameId,
        playerId: this.playerId,
        cardIds: cardIds,
      }
      this.triggerPlayCards++
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
      :key="`get-piles-${triggerGetPlayerPiles}`"
      :factory="deckRepository.getPlayerPiles"
      :arg="{gameId: gameId, playerId: playerId}"
      :busy.sync="busyGettingPiles"
      @then="pilesResponse = $event" />

    <PromiseHeadless
      v-if="playCardsPayload"
      :key="`play-cards-${triggerPlayCards}`"
      :factory="deckRepository.playCards"
      :arg="playCardsPayload"
      :busy.sync="busyPlayingCards"
      @then="triggerGetPlayerPiles++" />

    <v-container v-if="pilesResponse" class="grey lighten-5">

      <v-row no-gutters justify="center">

        <v-col
          v-for="card in pilesResponse.handCards"
          :key="card.id"
          cols="3"
          sm="3">

          <PlayCard
            v-bind="card"
            :loading="busyPlayingCards"
            class="pa-2 ma-2"
            @click="onHandCardClick(card)" />

        </v-col>

      </v-row>

      <v-divider />

      <v-row no-gutters justify="center">

        <v-col
          v-for="card in pilesResponse.faceUpCards"
          :key="card.id"
          cols="3"
          sm="3">

          <PlayCard
            v-bind="card"
            :faded="!canPlayFaceUp"
            :loading="busyPlayingCards"
            class="pa-2 ma-2"
            @click="onFaceUpCardClick(card)" />

        </v-col>

      </v-row>

      <v-divider />

      <v-row no-gutters justify="center">

        <v-col
          v-for="card in pilesResponse.faceDownCards"
          :key="card.id"
          cols="3"
          sm="3">

          <PlayCard
            v-bind="card"
            :faded="!canPlayFaceDown"
            :loading="busyPlayingCards"
            class="pa-2 ma-2"
            @click="onFaceDownCardClick(card)" />

        </v-col>

      </v-row>

    </v-container>

  </div>
</template>