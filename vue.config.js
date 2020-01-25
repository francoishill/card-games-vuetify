process.env.VUE_APP_API_BASE_URL = 'https://localhost:5001'

module.exports = {
  "devServer": {
    "overlay": {
      "warnings": true,
      "errors": true
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}