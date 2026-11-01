export interface SanityExercise {
  _id: string
  name: string
  subName?: string
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
  return {
    id: doc._id.replace(/^(ex-|spine-ex-)/, ''),
    name: doc.name,
    subName: doc.subName,
    target: doc.subName,
    category: doc.category,
    mode: doc.mode ?? 'reps',
    duration: doc.duration,
    sets: doc.sets ?? 3,
    reps: doc.reps ?? null,
    rest: doc.rest ?? 30,
    guide: doc.guide,
    videoUrl: doc.videoUrl,
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
    _sanityId: doc._id,
  }
}