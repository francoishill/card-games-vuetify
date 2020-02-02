<script>
import PlayCard from './PlayCard.vue'

export default {
  inject: ['shitheadRepository'],

  components: {
    PlayCard,
  },

  data() {
    let storedGameId = localStorage.getItem('temp-game-id')
    let storedPlayerId = localStorage.getItem('temp-player-id')

    return {
      hadStoredIds: !!storedGameId && !!storedPlayerId,

      sortCards: false,

      busyCreating: false,
      busyJoining: false,
      busyGettingState: false,
      busyPlayingCards: false,

      gameId: storedGameId || undefined,
      playerId: storedPlayerId || undefined,
      gameState: undefined,

      playCardsPayload: undefined,
      triggerPlayCards: 0,

      triggerPickUpDiscardPile: 0,

      triggerGetGameState: 0,

      playCardsError: undefined,
    }
  },

  computed: {
    canPlayFaceUp() { return this.gameState.handCards.length === 0 },
    canPlayFaceDown() { return this.gameState.handCards.length === 0 && this.gameState.faceUpCards.length === 0 },

    isMyTurn() { return this.gameState.isMyTurn },

    handCards() {
      if (!this.sortCards) return this.gameState.handCards

      const clonedArray = this.gameState.handCards.map(c => c)
      clonedArray.sort(function (card1, card2) {
        if (card1.value > card2.value) {
          return 1;
        }
        if (card2.value > card1.value) {
          return -1;
        }
        return 0;
      })
      return clonedArray
    },

    faceUpCards() { return this.gameState.faceUpCards },

    faceDownCards() { return this.gameState.faceDownCards },

    discardPileCards() { return this.gameState.discardPileCards },
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
        this.onPlayCardsError('Cannot play FaceUp cards currently')
        return
      }

      console.debug('onFaceUpCardClick', card)
      this.playCards([card.id])
    },

    onFaceDownCardClick(card) {
      if (!this.canPlayFaceDown) {
        this.onPlayCardsError('Cannot play FaceDown cards currently')
        return
      }

      console.debug('onFaceDownCardClick', card)
      this.playCards([card.id])
    },

    onDiscardCardClick() {
      this.triggerPickUpDiscardPile++
    },

    playCards(cardIds) {
      this.playCardsPayload = {
        gameId: this.gameId,
        playerId: this.playerId,
        cardIds: cardIds,
      }
      this.triggerPlayCards++
    },

    onPlayCardsError(err) {
      console.debug('onPlayCardsError', err)
      const wrappedErr = { message: err }
      this.playCardsError = wrappedErr

      setTimeout(() => {
        if (this.playCardsError === wrappedErr) {
          this.playCardsError = undefined
        }
      }, 5 * 1000)
    },

    clearPlayCardsError() {
      this.playCardsError = undefined
    },
  },
}
</script>

<template>
  <div>
    <PromiseHeadless
      v-if="!hadStoredIds"
      :factory="shitheadRepository.createGame"
      :arg="{numberPlayers: 2}"
      :busy.sync="busyCreating"
      @then="gameId=$event.id" />

    <PromiseHeadless
      v-if="gameId && !hadStoredIds"
      :factory="shitheadRepository.joinGame"
      :arg="{gameId: gameId}"
      :busy.sync="busyJoining"
      @then="playerId = $event.playerId" />

    <PromiseHeadless
      v-if="playerId"
      :key="`get-piles-${triggerGetGameState}`"
      :factory="shitheadRepository.getGameState"
      :arg="{gameId: gameId, playerId: playerId}"
      :busy.sync="busyGettingState"
      @then="gameState = $event" />

    <PromiseHeadless
      v-if="playCardsPayload"
      :key="`play-cards-${triggerPlayCards}`"
      :factory="shitheadRepository.playCards"
      :arg="playCardsPayload"
      :busy.sync="busyPlayingCards"
      @then="triggerGetGameState++; clearPlayCardsError()"
      @catch="onPlayCardsError" />

    <PromiseHeadless
      v-if="triggerPickUpDiscardPile > 0"
      :key="`pick-up-discard-pile-${triggerPickUpDiscardPile}`"
      :factory="shitheadRepository.pickUpDiscardPile"
      :arg="{gameId: gameId, playerId: playerId}"
      :busy.sync="busyPlayingCards"
      @then="triggerGetGameState++; clearPlayCardsError()"
      @catch="onPlayCardsError" />

    <RealtimeMessageListener
      method="GameMove"
      @message="triggerGetGameState++"
      @reconnect="triggerGetGameState++" />

    <v-container v-if="gameState" class="grey lighten-5">

      <v-snackbar
        v-if="playCardsError"
        :value="true"
        @input="playCardsError=undefined"
        color="error">
        {{playCardsError.message}}
      </v-snackbar>

      <v-card class="py-1 px-2">

        <div class="d-flex align-center">
          <div>
            <v-switch
              label="Sort cards"
              v-model="sortCards"
              hide-details
              class="py-0 my-0" />

            <v-fade-transition>
              <v-alert
                v-if="!isMyTurn"
                :value="true"
                color="warning"
                outlined
                dark
                class="mt-3">
                Waiting on another player
              </v-alert>
            </v-fade-transition>
          </div>

          <v-spacer />

          <div v-if="gameState.discardPileCards.length > 0" class="d-flex flex-column align-center">
            <small class="grey--text">Discarded</small>
            <PlayCard
              v-bind="gameState.discardPileCards[gameState.discardPileCards.length - 1]"
              :loading="busyPlayingCards"
              class="pa-2 ma-2"
              :image-width="40"
              @click="onDiscardCardClick(gameState.discardPileCards[gameState.discardPileCards.length - 1])" />
          </div>
        </div>
      </v-card>

      <v-row no-gutters justify="center">

        <v-col
          v-for="card in handCards"
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
          v-for="card in faceUpCards"
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
          v-for="card in faceDownCards"
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

      <v-divider />

      <v-row no-gutters justify="center">

        <v-col
          v-for="card in discardPileCards"
          :key="card.id"
          cols="3"
          sm="3">

          <PlayCard
            v-bind="card"
            faded
            :loading="busyPlayingCards"
            class="pa-2 ma-2"
            @click="onDiscardCardClick(card)" />

        </v-col>

      </v-row>

    </v-container>

  </div>
</template>