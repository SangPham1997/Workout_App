// Type Definitions & Mappers: Sanity Raw Data -> App Internal Types
import type { PortableTextBlock } from '@portabletext/types'

// ===== APP INTERNAL TYPES (Giữ tương thích với code hiện tại) =====

export interface AppExercise {
  id: string
  name: string
  nameEn?: string
  videoUrl: string
  thumbnail?: string
  gifUrl?: string
  exerciseType: 'reps' | 'hold' | 'karate_technique' | 'karate_kata' | 'warmup'
  defaultSets: number
  defaultReps: string
  restSeconds: number
  prepareSeconds: number
  muscleGroups: string[]
  equipment: string[]
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  instructions: PortableTextBlock[]
  commonMistakes: PortableTextBlock[]
  tips: PortableTextBlock[]
  isTrackable: boolean
  progressionUnit: 'reps' | 'seconds' | 'kg' | 'level'
  category?: { id: string; title: string; slug: string }
}

export interface AppWeek {
  id: string
  weekNumber: number
  label: string
  focus?: string
  exercises: AppExercise[]
}

export interface AppCategory {
  id: string
  title: string
  slug: string
  icon?: string
  order: number
  exercises: AppExercise[]
}

export interface AppKarateTechnique {
  id: string
  name: string
  nameEn?: string
  videoUrl: string
  thumbnail?: string
  exerciseType: 'karate_technique' | 'karate_kata'
  instructions: PortableTextBlock[]
  commonMistakes: PortableTextBlock[]
  tips: PortableTextBlock[]
}

export interface AppKarateSession {
  id: string
  sessionId: string
  week: number
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  durationEstimate: number
  notes?: string
  techniques: AppKarateTechnique[]
  warmup?: AppExercise
  cooldown?: AppExercise
}

export interface AppKarateTrack {
  id: string
  trackId: string
  label: string
  description?: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  weekLabels?: Record<string, string>
  sessions: AppKarateSession[]
}

export interface AppProgram {
  id: string
  title: string
  slug: string
  icon: string
  colorTheme: string
  programType: 'weekly' | 'library' | 'karate'
  description?: string
  weeks?: AppWeek[]
  categories?: AppCategory[]
  tracks?: AppKarateTrack[]
}

export interface AppAchievement {
  id: string
  title: string
  description?: string
  icon: string
  category: 'habits' | 'workout' | 'karate' | 'spine' | 'special'
  condition: {
    type: 'streak' | 'count' | 'pr' | 'completion'
    target: number
    source: string
    filter?: string
  }
  xpReward: number
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary'
}

export interface AppSiteSettings {
  appName: string
  defaultTimerSound?: string
  achievements: AppAchievement[]
}

// ===== MAPPER FUNCTIONS =====

function mapPortableText(blocks: any[]): PortableTextBlock[] {
  if (!Array.isArray(blocks)) return []
  return blocks.map((block) => ({
    ...block,
    _key: block._key || Math.random().toString(36).slice(2),
    children: block.children?.map((child: any) => ({
      ...child,
      _key: child._key || Math.random().toString(36).slice(2),
    })) || [],
  }))
}

function getMuscleGroups(doc: any): string[] {
  return doc.muscleGroups?.map((m: any) => m.title) || []
}

function getEquipment(doc: any): string[] {
  return doc.equipment?.map((e: any) => e.title) || []
}

export function mapSanityExercise(doc: any): AppExercise {
  if (!doc) throw new Error('Cannot map null exercise')
  return {
    id: doc._id,
    name: doc.name,
    nameEn: doc.nameEn,
    videoUrl: doc.videoUrl,
    thumbnail: doc.thumbnail?.asset?._ref
      ? `https://cdn.sanity.io/images/${process.env.VITE_SANITY_PROJECT_ID || 'your-project-id'}/${process.env.VITE_SANITY_DATASET || 'production'}/${doc.thumbnail.asset._ref.replace('image-', '').replace('-', '/')}.${doc.thumbnail.asset._ref.split('.').pop()}`
      : undefined,
    gifUrl: doc.gifUrl,
    exerciseType: doc.exerciseType,
    defaultSets: doc.defaultSets ?? 3,
    defaultReps: doc.defaultReps ?? '10-12',
    restSeconds: doc.restSeconds ?? 60,
    prepareSeconds: doc.prepareSeconds ?? 10,
    muscleGroups: getMuscleGroups(doc),
    equipment: getEquipment(doc),
    difficulty: doc.difficulty,
    instructions: mapPortableText(doc.instructions),
    commonMistakes: mapPortableText(doc.commonMistakes),
    tips: mapPortableText(doc.tips),
    isTrackable: doc.isTrackable ?? true,
    progressionUnit: doc.progressionUnit ?? 'reps',
    category: doc.category ? { id: doc.category._id, title: doc.category.title, slug: doc.category.slug?.current } : undefined,
  }
}

export function mapSanityWeek(doc: any): AppWeek {
  return {
    id: doc._id,
    weekNumber: doc.weekNumber,
    label: doc.label || `Tuần ${doc.weekNumber}`,
    focus: doc.focus,
    exercises: doc.exercises?.map(mapSanityExercise) || [],
  }
}

export function mapSanityCategory(doc: any): AppCategory {
  return {
    id: doc._id,
    title: doc.title,
    slug: doc.slug?.current,
    icon: doc.icon,
    order: doc.order ?? 0,
    exercises: doc.exercises?.map(mapSanityExercise) || [],
  }
}

export function mapSanityKarateTechnique(doc: any): AppKarateTechnique {
  return {
    id: doc._id,
    name: doc.name,
    nameEn: doc.nameEn,
    videoUrl: doc.videoUrl,
    thumbnail: doc.thumbnail?.asset?._ref
      ? `https://cdn.sanity.io/images/${process.env.VITE_SANITY_PROJECT_ID || 'your-project-id'}/${process.env.VITE_SANITY_DATASET || 'production'}/${doc.thumbnail.asset._ref.replace('image-', '').replace('-', '/')}.${doc.thumbnail.asset._ref.split('.').pop()}`
      : undefined,
    exerciseType: doc.exerciseType,
    instructions: mapPortableText(doc.instructions),
    commonMistakes: mapPortableText(doc.commonMistakes),
    tips: mapPortableText(doc.tips),
  }
}

export function mapSanityKarateSession(doc: any): AppKarateSession {
  return {
    id: doc._id,
    sessionId: doc.sessionId,
    week: doc.week,
    name: doc.name,
    level: doc.level,
    durationEstimate: doc.durationEstimate ?? 45,
    notes: doc.notes,
    techniques: doc.techniques?.map(mapSanityKarateTechnique) || [],
    warmup: doc.warmup ? mapSanityExercise(doc.warmup) : undefined,
    cooldown: doc.cooldown ? mapSanityExercise(doc.cooldown) : undefined,
  }
}

export function mapSanityKarateTrack(doc: any): AppKarateTrack {
  let weekLabels: Record<string, string> = {}
  try {
    if (doc.weekLabels) {
      weekLabels = typeof doc.weekLabels === 'string' ? JSON.parse(doc.weekLabels) : doc.weekLabels
    }
  } catch {}
  return {
    id: doc._id,
    trackId: doc.id,
    label: doc.label,
    description: doc.description,
    level: doc.level,
    weekLabels,
    sessions: doc.sessions?.map(mapSanityKarateSession) || [],
  }
}

export function mapSanityProgram(doc: any): AppProgram {
  return {
    id: doc._id,
    title: doc.title,
    slug: doc.slug?.current,
    icon: doc.icon,
    colorTheme: doc.colorTheme,
    programType: doc.programType,
    description: doc.description,
    weeks: doc.weeks?.map(mapSanityWeek),
    categories: doc.categories?.map(mapSanityCategory),
    tracks: doc.tracks?.map(mapSanityKarateTrack),
  }
}

export function mapSanityAchievement(doc: any): AppAchievement {
  return {
    id: doc.id,
    title: doc.title,
    description: doc.description,
    icon: doc.icon || '🏆',
    category: doc.category,
    condition: doc.condition || { type: 'count', target: 1, source: 'workout' },
    xpReward: doc.xpReward ?? 100,
    rarity: doc.rarity ?? 'Common',
  }
}

export function mapSanitySettings(doc: any): AppSiteSettings {
  return {
    appName: doc.appName || 'Home Workout Pro',
    defaultTimerSound: doc.defaultTimerSound,
    achievements: doc.achievements?.map(mapSanityAchievement) || [],
  }
}