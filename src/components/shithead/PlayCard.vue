<script>
import PlayCardVisibleImage from './PlayCardVisibleImage.vue'
import PlayCardHiddenImage from './PlayCardHiddenImage.vue'

export default {
  components: {
    PlayCardVisibleImage,
    PlayCardHiddenImage,
  },

  props: {
    id: { type: Number, required: true },
    suit: { type: String },
    value: { type: Number },
    isVisible: { type: Boolean, required: true },

    faded: { type: Boolean },
  },

  data() {
    const imageWidth = 50
    return {
      cardWidth: imageWidth + 20,
      imageWidth: imageWidth,
    }
  },
}
</script>

<template>

  <v-card
    :width="cardWidth"
    :style="{opacity: faded ? 0.5 : undefined}"
    @click="$emit('click')">

    <PlayCardVisibleImage
      v-if="isVisible"
      :id="id"
      :suit="suit"
      :value="value"
      :width="imageWidth" />

    <PlayCardHiddenImage
      v-else
      :id="id"
      :width="imageWidth" />

  </v-card>

</template>