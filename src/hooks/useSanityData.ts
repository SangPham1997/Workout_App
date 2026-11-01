import { useEffect, useState } from 'react'
import { sanityClient } from '../lib/sanity.client'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

interface Options<T> {
  query: string
  params?: Record<string, unknown>
  enabled?: boolean
  mockData?: T
}

export function useSanityData<T = unknown>({
  query,
  params = {},
  enabled = true,
  mockData,
}: Options<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!enabled) { setLoading(false); return }

    if (USE_MOCK && mockData) {
      setData(mockData)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    sanityClient
      .fetch<T>(query, params)
      .then((r) => { if (!cancelled) setData(r) })
      .catch((e) => { if (!cancelled) setError(e) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [query, JSON.stringify(params), enabled, mockData])

  return { data, loading, error }
}