/**
 * In-memory cache cho Sanity fetch.
 *
 * - Dedup request: 2 component cùng query → 1 network call.
 * - TTL: data "fresh" trong 5 phút, hết hạn vẫn dùng nếu có request đang bay.
 * - Force refresh: truyền { force: true } để bỏ qua cache.
 * - Cache sống trong session của tab (không persist qua reload).
 */
type CacheEntry<T> = {
  data: T | undefined
  timestamp: number
  promise?: Promise<T>
}

const DEFAULT_TTL_MS = 5 * 60 * 1000 // 5 phút
const PROMISE_TIMEOUT_MS = 20 * 1000  // 20s
const cache = new Map<string, CacheEntry<unknown>>()

const makeKey = (query: string, params?: Record<string, unknown>) =>
  query + '::' + JSON.stringify(params ?? {})

export async function cachedFetch<T = unknown>(
  client: { fetch: <R>(q: string, p?: Record<string, unknown>) => Promise<R> },
  query: string,
  params?: Record<string, unknown>,
  options?: { ttl?: number; force?: boolean }
): Promise<T> {
  const key = makeKey(query, params)
  const ttl = options?.ttl ?? DEFAULT_TTL_MS
  const now = Date.now()
  const entry = cache.get(key) as CacheEntry<T> | undefined

  // 1) Có promise đang bay → trả về promise đó (dedup)
  if (entry?.promise) {
    if (import.meta.env.DEV) console.debug('[cache] hit (pending)', key.slice(0, 60))
    return entry.promise
  }

  // 2) Data còn fresh → trả về ngay
  if (!options?.force && entry?.data !== undefined && now - entry.timestamp < ttl) {
    if (import.meta.env.DEV) console.debug('[cache] hit (fresh)', key.slice(0, 60))
    return entry.data
  }

  // 3) Cache stale → vẫn trả về stale NGAY + revalidate ngầm (SWR pattern)
  const hasStale = entry?.data !== undefined
  const staleData = entry?.data as T | undefined

  const fetcher = Promise.race([
    client.fetch<T>(query, params),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Fetch timeout ${PROMISE_TIMEOUT_MS}ms`)), PROMISE_TIMEOUT_MS)
    ),
  ]).then((data) => {
    cache.set(key, { data, timestamp: Date.now() })
    if (import.meta.env.DEV) console.debug('[cache] fetched', key.slice(0, 60))
    return data
  }).catch((err) => {
    cache.delete(key) // Lỗi → xóa để retry sau
    throw err
  })

  // Lưu promise để dedup
  cache.set(key, {
    data: staleData,
    timestamp: entry?.timestamp ?? 0,
    promise: fetcher,
  })

  // SWR: có stale → trả về stale ngay, revalidate ngầm
  if (hasStale && staleData !== undefined) {
    if (import.meta.env.DEV) console.debug('[cache] hit (stale-while-revalidate)', key.slice(0, 60))
    return staleData
  }

  return fetcher
}

/** Xóa cache theo prefix query hoặc toàn bộ */
export function invalidateCache(queryPrefix?: string) {
  if (!queryPrefix) {
    cache.clear()
    return
  }
  for (const key of cache.keys()) {
    if (key.startsWith(queryPrefix)) cache.delete(key)
  }
}

/** Debug: xem cache stats */
export function getCacheStats() {
  return {
    size: cache.size,
    entries: [...cache.entries()].map(([k, v]) => ({
      key: k.slice(0, 80),
      age: Date.now() - v.timestamp,
      hasData: v.data !== undefined,
      pending: !!v.promise,
    })),
  }
}