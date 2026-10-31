// Hooks fetch data từ Sanity dùng TanStack Query (React Query)
import { useQuery } from '@tanstack/react-query'
import { sanityClient } from '../lib/sanity.client'
import { queries } from '../lib/sanity.queries'
import {
  mapSanityProgram,
  mapSanityExercise,
  mapSanitySettings,
  type AppProgram,
  type AppExercise,
  type AppSiteSettings,
} from '../lib/sanity.mappers'

// Query Keys
export const sanityKeys = {
  programs: ['sanity', 'programs'] as const,
  program: (slug: string) => ['sanity', 'program', slug] as const,
  exercise: (id: string) => ['sanity', 'exercise', id] as const,
  exercisesByCategory: (slug: string) => ['sanity', 'exercises', 'category', slug] as const,
  settings: ['sanity', 'settings'] as const,
}

// 1. Danh sách chương trình (Header, Menu)
export function usePrograms() {
  return useQuery({
    queryKey: sanityKeys.programs,
    queryFn: async () => {
      const data = await sanityClient.fetch(queries.programs)
      return data.map(mapSanityProgram) as AppProgram[]
    },
    staleTime: 1000 * 60 * 10, // 10 phút
    gcTime: 1000 * 60 * 30, // 30 phút
  })
}

// 2. Chi tiết 1 chương trình (Home, Spine, Karate)
export function useProgram(slug: string) {
  return useQuery({
    queryKey: sanityKeys.program(slug),
    queryFn: async () => {
      const query = queries.programBySlug(slug)
      const data = await sanityClient.fetch(query, { slug })
      return data ? mapSanityProgram(data) : null
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 phút
    gcTime: 1000 * 60 * 15,
  })
}

// 3. 1 bài tập cụ thể (Timer, Detail Modal)
export function useExercise(id: string) {
  return useQuery({
    queryKey: sanityKeys.exercise(id),
    queryFn: async () => {
      const query = queries.exerciseById(id)
      const data = await sanityClient.fetch(query, { id })
      return data ? mapSanityExercise(data) : null
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })
}

// 4. Bài tập theo Category (Spine Bar Filter)
export function useExercisesByCategory(categorySlug: string) {
  return useQuery({
    queryKey: sanityKeys.exercisesByCategory(categorySlug),
    queryFn: async () => {
      const query = queries.exercisesByCategory(categorySlug)
      const data = await sanityClient.fetch(query, { categorySlug })
      return data.map(mapSanityExercise) as AppExercise[]
    },
    enabled: !!categorySlug,
    staleTime: 1000 * 60 * 10,
  })
}

// 5. Site Settings (Achievements, Config)
export function useSiteSettings() {
  return useQuery({
    queryKey: sanityKeys.settings,
    queryFn: async () => {
      const data = await sanityClient.fetch(queries.siteSettings)
      return data ? mapSanitySettings(data) : null
    },
    staleTime: 1000 * 60 * 30, // 30 phút
    gcTime: 1000 * 60 * 60,
  })
}

// 6. Prefetch helpers (dùng cho navigation hover)
export function prefetchProgram(queryClient: any, slug: string) {
  queryClient.prefetchQuery({
    queryKey: sanityKeys.program(slug),
    queryFn: async () => {
      const query = queries.programBySlug(slug)
      const data = await sanityClient.fetch(query, { slug })
      return data ? mapSanityProgram(data) : null
    },
    staleTime: 1000 * 60 * 5,
  })
}