import { getVideoEmbedUrl } from '../../utils/getVideoEmbedUrl'

export interface SanityExercise {
  _id: string
  _type?: 'homeExercise' | 'spineExercise' | 'exercise'
  name: string
  subName?: string
  target?: string
  category?: string
  mode?: 'time' | 'reps'
  duration?: number
  sets?: number
  reps?: number | null
  rest?: number
  guide?: string
  videoUrl?: string
  week?: number
  level?: number
  equipment?: string
  bar?: string
  spineFocus?: string[]
  deskIssues?: string[]
  safety?: string
  regression?: string
  progression?: string
  groupId?: string
  type?: string
  svg?: string
}

export function adaptExercise(doc: SanityExercise) {
  // Safe: nếu _id undefined (defensive) → fallback về name/unknown
  const rawId = doc._id ?? (doc.name ? `name-${doc.name}` : 'unknown')
  // Strip prefix nếu có; nếu UUID (không prefix) → giữ nguyên
  const id = rawId.replace(/^(ex-|spine-ex-)/, '')

  return {
    id,
    name: doc.name,
    subName: doc.subName,
    target: doc.target ?? doc.subName ?? doc.name,
    category: doc.category,
    mode: doc.mode ?? 'reps',
    duration: doc.duration,
    sets: doc.sets ?? 3,
    reps: doc.reps ?? null,
    rest: doc.rest ?? 30,
    guide: doc.guide,
    videoUrl: doc.videoUrl,
    videoEmbedUrl: getVideoEmbedUrl(doc.videoUrl),
    week: doc.week,
    level: doc.level,
    equipment: doc.equipment,
    bar: doc.bar,
    spineFocus: doc.spineFocus,
    deskIssues: doc.deskIssues,
    safety: doc.safety,
    regression: doc.regression,
    progression: doc.progression,
    groupId: doc.groupId,
    type: doc.type,
    svg: doc.svg,
    _sanityId: rawId,
    _type: doc._type,
  }
}

export default adaptExercise