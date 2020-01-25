<script>
export default {
  inject: ['LocalCacheService', 'ErrorService'],

  props: {
    factory: { type: Function, required: true },
    arg: {},
    manualTrigger: { type: Boolean },
    refresh: {},
    doNotAlertError: { type: Boolean },
    doNotHandleError: { type: Boolean },
    cacheKey: { type: String },

    busy: { type: Boolean },
  },

  data: () => ({
    result: undefined,
    localBusy: false,
    error: undefined,
  }),

  computed: {
    fullCacheKey() { return this.cacheKey ? `cached-promise-${this.cacheKey}` : undefined }
  },

  watch: {
    cacheKey: {
      handler(to) {
        if (!to) return
        const cachedResult = this.LocalCacheService.getCacheValue(this.fullCacheKey)
        if (cachedResult) {
          this.result = cachedResult
          this.$emit('loaded', this.result)
        } else {
          this.$emit('loaded-no-cache')
        }
      },
      immediate: true,
    },

    refresh: {
      handler() { this.trigger() },
    },

    localBusy(to) {
      this.$emit('update:busy', to)
    },
  },

  mounted() {
    if (!this.manualTrigger) {
      this.trigger()
    }
  },

  methods: {
    clearError() {
      this.error = undefined
    },

    async trigger() {
      this.error = undefined

      try {
        this.localBusy = true

        this.$emit('before-execute')

        const result = await this.factory(this.arg)

        this.error = undefined
        this.result = result
        this.$emit('then', this.result)

        if (this.fullCacheKey) {
          this.LocalCacheService.setCacheValue(this.fullCacheKey, result)
        }
      } catch (err) {
        if (!this.doNotAlertError) {
          this.ErrorService.add(err)
        }

        if (this.doNotHandleError) {
          throw err;
        }

        if (err instanceof Error && err.is_warnings) {
          this.$emit('warnings', err.warnings)
        } else if (err instanceof Error && err.is_warning) {
          this.$emit('warnings', [err.message])
        } else {
          this.error = String(err)
          this.$emit('catch', err)
        }
      } finally {
        this.localBusy = false
        this.$emit('finally')
      }
    },
  },

  render() {
    if (!this.$scopedSlots.default) {
      return null
    }

    return this.$scopedSlots.default({
      trigger: this.trigger,
      busy: this.localBusy,
      error: this.error,
      result: this.result,
      clearError: this.clearError,
    })
  },
}
</script>
