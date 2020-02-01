<script>
export default {
  props: {
    id: { type: Number, required: true },
  },

  data() {
    return {
      imageUrl: 'https://i.ibb.co/qxm0K0q/Emerald.png',
      // imageUrl: 'https://i.ibb.co/G0r9QLv/Peter-River.png',
      // imageUrl: 'https://i.ibb.co/zxnm6Ws/Pomegranate.png',
      // imageUrl: 'https://i.ibb.co/HzGnxwB/Sun-Flower.png',
    }
  },
}
</script>

<template>

  <img :src="imageUrl">

</template>