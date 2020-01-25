<script>
import PlayCard from './PlayCard.vue'

export default {
  inject: ['deckRepository'],

  components: {
    PlayCard,
  },

  data() {
    return {
      busy: false,
      decks: undefined,
    }
  },
}
</script>

<template>
  <div>
    <PromiseHeadless
      :factory="deckRepository.createDeck"
      :arg="{shuffled:true}"
      :busy.sync="busy"
      @then="decks=$event" />

    <v-container class="grey lighten-5">

      <v-row no-gutters
        v-for="deck in decks"
        :key="deck.id"
        justify="center">

        <v-col
          v-for="card in deck.cards"
          :key="card.id"
          cols="6"
          sm="4">

          <PlayCard
            v-bind="card"
            class="pa-2 ma-2" />

        </v-col>

      </v-row>
    </v-container>

  </div>
</template>