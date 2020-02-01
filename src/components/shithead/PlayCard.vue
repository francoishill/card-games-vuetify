<script>
import PlayCardVisibleImage from './PlayCardVisibleImage.vue'
import PlayCardHiddenImage from './PlayCardHiddenImage.vue'

const images = {
  'clubs-1': 'https://i.ibb.co/X7nMKYz/AC.png',
  'diamonds-1': 'https://i.ibb.co/fMh2tZc/AD.png',
  'hearts-1': 'https://i.ibb.co/h2ZCzyG/AH.png',
  'spades-1': 'https://i.ibb.co/BqM7DWV/AS.png',
  'clubs-2': 'https://i.ibb.co/D5c4ntr/2C.png',
  'diamonds-2': 'https://i.ibb.co/87gHQNm/2D.png',
  'hearts-2': 'https://i.ibb.co/4gSGr4v/2H.png',
  'spades-2': 'https://i.ibb.co/64td43L/2S.png',
  'clubs-3': 'https://i.ibb.co/vcwFYyS/3C.png',
  'diamonds-3': 'https://i.ibb.co/sjLCQ4x/3D.png',
  'hearts-3': 'https://i.ibb.co/YpyHPyL/3H.png',
  'spades-3': 'https://i.ibb.co/5k4M1Y3/3S.png',
  'clubs-4': 'https://i.ibb.co/59HF2m7/4C.png',
  'diamonds-4': 'https://i.ibb.co/VVLHjYt/4D.png',
  'hearts-4': 'https://i.ibb.co/NWpmtmr/4H.png',
  'spades-4': 'https://i.ibb.co/LpfcmBm/4S.png',
  'clubs-5': 'https://i.ibb.co/nMhBXLG/5C.png',
  'diamonds-5': 'https://i.ibb.co/JdSn6S1/5D.png',
  'hearts-5': 'https://i.ibb.co/92f4cDz/5H.png',
  'spades-5': 'https://i.ibb.co/CsgX8DZ/5S.png',
  'clubs-6': 'https://i.ibb.co/jwJ0SGS/6C.png',
  'diamonds-6': 'https://i.ibb.co/2cQRhXC/6D.png',
  'hearts-6': 'https://i.ibb.co/BwVBmG1/6H.png',
  'spades-6': 'https://i.ibb.co/hVhnKPt/6S.png',
  'clubs-7': 'https://i.ibb.co/KL6ZHHs/7C.png',
  'diamonds-7': 'https://i.ibb.co/Lp3K8XH/7D.png',
  'hearts-7': 'https://i.ibb.co/nzWqw3G/7H.png',
  'spades-7': 'https://i.ibb.co/pZNLvbw/7S.png',
  'clubs-8': 'https://i.ibb.co/ZxgqksG/8C.png',
  'diamonds-8': 'https://i.ibb.co/89vKBpp/8D.png',
  'hearts-8': 'https://i.ibb.co/mDvq5MK/8H.png',
  'spades-8': 'https://i.ibb.co/0D30wVJ/8S.png',
  'clubs-9': 'https://i.ibb.co/P1LRq3K/9C.png',
  'diamonds-9': 'https://i.ibb.co/Mfvk25m/9D.png',
  'hearts-9': 'https://i.ibb.co/y69FMsc/9H.png',
  'spades-9': 'https://i.ibb.co/2MQXZPP/9S.png',
  'clubs-10': 'https://i.ibb.co/4NGZHBK/10C.png',
  'diamonds-10': 'https://i.ibb.co/5rXVXGh/10D.png',
  'hearts-10': 'https://i.ibb.co/q5SvNMH/10H.png',
  'spades-10': 'https://i.ibb.co/Vvx0vtn/10S.png',
  'clubs-11': 'https://i.ibb.co/b2FjcV0/JC.png',
  'diamonds-11': 'https://i.ibb.co/KVwRbNG/JD.png',
  'hearts-11': 'https://i.ibb.co/LNkgkPc/JH.png',
  'spades-11': 'https://i.ibb.co/zxr0CsB/JS.png',
  'clubs-12': 'https://i.ibb.co/pLjHnpJ/QC.png',
  'diamonds-12': 'https://i.ibb.co/xHzJKXK/QD.png',
  'hearts-12': 'https://i.ibb.co/Gkkkvfr/QH.png',
  'spades-12': 'https://i.ibb.co/85BcJjy/QS.png',
  'clubs-13': 'https://i.ibb.co/qgYSvr8/KC.png',
  'diamonds-13': 'https://i.ibb.co/QHhffym/KD.png',
  'hearts-13': 'https://i.ibb.co/9HjXrJy/KH.png',
  'spades-13': 'https://i.ibb.co/7VYj9Tm/KS.png',
}

function getCardImageUri(suit, value) {
  switch (suit.toLowerCase()) {
    case 'joker':
      // return 'https://i.ibb.co/q7cjskY/Joker-2.png'
      // return 'https://i.ibb.co/y6ygKRp/Joker-4.png'
      return 'https://i.ibb.co/wLSj539/Joker-1.png'
    default:
      return images[`${suit.toLowerCase()}-${value}`]
  }
}

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

  computed: {
    imageUrl() {
      return getCardImageUri(this.suit, this.value)
    },
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