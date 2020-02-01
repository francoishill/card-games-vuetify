<script>
import PlayDecks from './components/decks/PlayDecks.vue'

export default {
  name: 'App',

  components: {
    PlayDecks,
  },
};
</script>

<template>
  <v-app>

    <v-content>
      <PlayDecks />
    </v-content>

  </v-app>
</template>
