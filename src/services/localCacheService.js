class Service {
  setCacheValue(key, val) {
    const wrappedData = {
      time: new Date().toISOString(),
      data: val,
    }
    localStorage.setItem(key, JSON.stringify(wrappedData))
  }

  getCacheValue(key) {
    const rawWrappedData = localStorage.getItem(key)
    return rawWrappedData ? JSON.parse(rawWrappedData).data : undefined
  }

  clearValue() {
    localStorage.removeItem(this.cacheKey)
  }
}

export const LocalCacheService = new Service();
