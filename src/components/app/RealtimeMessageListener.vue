<script>
import { RealtimeState } from '../../state/RealtimeState';

export default {
  props: {
    method: { type: String, required: true },
    filterPayload: { type: Function },
  },

  computed: {
    connectCount: () => RealtimeState.connectCount,
  },

  watch: {
    connectCount(to) {
      if (to > 1) {
        console.debug('RealtimeMessageListener reconnected');
        this.$emit('reconnect')
      }
    },
  },

  created() {
    this.$realtimeHub.$on(this.method, this.onMethod)
  },

  destroyed() {
    this.$realtimeHub.$off(this.method)
  },

  methods: {
    onMethod(payload) {
      if (!this.filterPayload || this.filterPayload(payload)) {
        this.$emit('message', payload)
      }
    },
  },

  render: () => null,
}
</script>
