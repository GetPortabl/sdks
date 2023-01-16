export const toQueryParams = (query: Record<string, any>) => Object.keys(query)
  .map(key => `${key}=${encodeURIComponent(query[key])}`)
  .join('&')