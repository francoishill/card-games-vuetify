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
      busyGettingPiles: false,
      busyPlayingCards: false,

      gameId: storedGameId || undefined,
      playerId: storedPlayerId || undefined,
      pilesResponse: undefined,

      playCardsPayload: undefined,
      triggerPlayCards: 0,

      triggerPickUpDiscardPile: 0,

      triggerGetPlayerPiles: 0,

      playCardsError: undefined,
    }
  },

  computed: {
    canPlayFaceUp() { return this.pilesResponse.handCards.length === 0 },
    canPlayFaceDown() { return this.pilesResponse.handCards.length === 0 && this.pilesResponse.faceUpCards.length === 0 },

    handCards() {
      if (!this.sortCards) return this.pilesResponse.handCards

      const clonedArray = this.pilesResponse.handCards.map(c => c)
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

    faceUpCards() { return this.pilesResponse.faceUpCards },

    faceDownCards() { return this.pilesResponse.faceDownCards },

    discardPileCards() { return this.pilesResponse.discardPileCards },
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
      :key="`get-piles-${triggerGetPlayerPiles}`"
      :factory="shitheadRepository.getPlayerPiles"
      :arg="{gameId: gameId, playerId: playerId}"
      :busy.sync="busyGettingPiles"
      @then="pilesResponse = $event" />

    <PromiseHeadless
      v-if="playCardsPayload"
      :key="`play-cards-${triggerPlayCards}`"
      :factory="shitheadRepository.playCards"
      :arg="playCardsPayload"
      :busy.sync="busyPlayingCards"
      @then="triggerGetPlayerPiles++; clearPlayCardsError()"
      @catch="onPlayCardsError" />

    <PromiseHeadless
      v-if="triggerPickUpDiscardPile > 0"
      :key="`pick-up-discard-pile-${triggerPickUpDiscardPile}`"
      :factory="shitheadRepository.pickUpDiscardPile"
      :arg="{gameId: gameId, playerId: playerId}"
      :busy.sync="busyPlayingCards"
      @then="triggerGetPlayerPiles++; clearPlayCardsError()"
      @catch="onPlayCardsError" />

    <RealtimeMessageListener
      method="GameMove"
      @message="triggerGetPlayerPiles++"
      @reconnect="triggerGetPlayerPiles++" />

    <v-container v-if="pilesResponse" class="grey lighten-5">

      <v-snackbar
        v-if="playCardsError"
        :value="true"
        @input="playCardsError=undefined"
        color="error">
        {{playCardsError.message}}
      </v-snackbar>

      <v-card class="py-1 px-2">
        <v-switch
          label="Sort cards"
          v-model="sortCards"
          hide-details
          class="py-0 my-0" />
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

      <v-divider v-if="pilesResponse.discardPileCards.length > 0" />

      <v-row v-if="pilesResponse.discardPileCards.length > 0" no-gutters justify="center">

        <v-col
          cols="3"
          sm="3">

          <PlayCard
            v-bind="pilesResponse.discardPileCards[pilesResponse.discardPileCards.length - 1]"
            :loading="busyPlayingCards"
            class="pa-2 ma-2"
            @click="onDiscardCardClick(pilesResponse.discardPileCards[pilesResponse.discardPileCards.length - 1])" />

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