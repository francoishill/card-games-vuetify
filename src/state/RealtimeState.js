import Vue from 'vue';

export const RealtimeState = Vue.observable({
  isConnected: false,
  connectCount: 0,
  connectionError: undefined,
});
