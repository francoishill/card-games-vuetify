import Vue from 'vue'
import config from '../config'
import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr'
import { RealtimeState } from '../state/RealtimeState';

const reconnectInterval = 5000;

function registerEvents(connection, realtimeHub) {
  connection.on('GameMove', (gameId, playerId) => {
    realtimeHub.$emit('GameMove', { gameId, playerId })
  })
}

const realtimePlugin = {
  install(Vue) {
    const connection = new HubConnectionBuilder()
      .withUrl(`${config.ApiBaseUrl}/api/realtime/gameHub`, {
        //accessTokenFactory: () => AuthService.getAccessToken()
      })
      .configureLogging(LogLevel.Warning) // LogLevel.Information)
      .build()

    // use new Vue instance as an event bus
    const realtimeHub = new Vue()
    // every component will use this.$realtimeHub to access the event bus
    Vue.prototype.$realtimeHub = realtimeHub

    registerEvents(connection, realtimeHub)

    let startedPromise = null
    function start() {
      startedPromise = connection.start()
        .then(() => {
          RealtimeState.isConnected = true
          RealtimeState.connectCount++;
          RealtimeState.connectionError = undefined
        })
        .catch(err => {
          console.error('Failed to connect with hub', err)

          RealtimeState.isConnected = false
          RealtimeState.connectionError = err

          return new Promise((resolve, reject) =>
            setTimeout(() => start().then(resolve).catch(reject), reconnectInterval))
        })
      return startedPromise
    }
    connection.onclose(() => {
      RealtimeState.isConnected = false
      RealtimeState.connectionError = Error('Connection closed')
      start()
    })

    start()
  }
}

Vue.use(realtimePlugin)