// sanity-studio/scripts/migrateData.ts
// Chạy: npx tsx scripts/migrateData.ts

import { sanityWriteClient } from './sanity.script'
import { exercises } from '../../src/data/exercises'
import { homeWorkoutProgram } from '../../src/data/programs/homeWorkout'
import { karateSessions, KARATE_TRACKS } from '../../src/data/karate'
import { spineBarProgram } from '../../src/data/programs/spineBar'
// import { habitTemplates } from '../../src/data/habitTemplates' // chưa dùng, bỏ để tránh warning

// ===== Helpers =====

const slugify = (s: string) =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const makeId = (prefix: string, key: string) => `${prefix}-${slugify(key)}`

const randKey = () => Math.random().toString(36).slice(2, 12)

/** Tạo Portable Text block từ string (nếu có) */
const block = (text?: string | null) =>
  text
    ? [{
        _type: 'block',
        _key: randKey(),
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: randKey(), text: String(text) }],
      }]
    : []

/** Lấy array bất kể cấu trúc gốc là gì: array trực tiếp, hoặc { items }, hoặc { key khác } */
function asArray<T = any>(v: any, ...fallbackKeys: string[]): T[] {
  if (Array.isArray(v)) return v as T[]
  for (const key of fallbackKeys) {
    if (Array.isArray(v?.[key])) return v[key] as T[]
  }
  return []
}

async function upsert(doc: any) {
  try {
    await sanityWriteClient.createOrReplace(doc)
    console.log(`✅ Upserted: ${doc._type} - ${doc._id}`)
  } catch (err: any) {
    console.error(`❌ Failed: ${doc._type} - ${doc._id}:`, err?.message || err)
  }
}

// ===== Main =====

async function migrate() {
  console.log('🚀 Bắt đầu migration dữ liệu lên Sanity...\n')

  // ===== GUARD: kiểm tra cấu trúc import =====
  console.log('🔍 Kiểm tra cấu trúc dữ liệu import:')
  console.log('   exercises               :', Array.isArray(exercises) ? `✅ array(${exercises.length})` : '❌ NOT array')
  console.log('   homeWorkoutProgram.keys :', Object.keys(homeWorkoutProgram || {}))
  console.log('   homeWorkoutProgram.items?', Array.isArray(homeWorkoutProgram?.items))
  console.log('   KARATE_TRACKS           :', Array.isArray(KARATE_TRACKS) ? `✅ array(${KARATE_TRACKS.length})` : '❌ NOT array')
  console.log('   karateSessions          :', Array.isArray(karateSessions) ? `✅ array(${karateSessions.length})` : '❌ NOT array')
  console.log('   spineBarProgram.keys    :', Object.keys(spineBarProgram || {}))
  console.log('   spineBarProgram.groups? :', Array.isArray(spineBarProgram?.groups))
  console.log('   spineBarProgram.items?  :', Array.isArray(spineBarProgram?.items))
  console.log('')

  // ===== 1. Categories / Muscles / Equipment =====
  const categoryMap = new Map<string, string>()
  const muscleMap = new Map<string, string>()
  const equipmentMap = new Map<string, string>()

  // Từ exercises chính
  for (const ex of exercises) {
    if (ex?.category) categoryMap.set(ex.category, makeId('cat', ex.category))
    if (Array.isArray(ex?.muscles)) ex.muscles.forEach((m: string) => muscleMap.set(m, makeId('muscle', m)))
    if (Array.isArray(ex?.equipment)) ex.equipment.forEach((e: string) => equipmentMap.set(e, makeId('equip', e)))
  }

  // Bổ sung từ spineBar (equipment là string, spineFocus là array string)
  const spineItems = asArray(spineBarProgram?.items)
  for (const ex of spineItems) {
    if (ex?.equipment && typeof ex.equipment === 'string') {
      equipmentMap.set(ex.equipment, makeId('equip', ex.equipment))
    }
    if (Array.isArray(ex?.spineFocus)) {
      ex.spineFocus.forEach((m: string) => muscleMap.set(m, makeId('muscle', m)))
    }
  }

  console.log(`📦 Tạo ${categoryMap.size} categories, ${muscleMap.size} muscles, ${equipmentMap.size} equipment...`)

  for (const [title, id] of categoryMap) {
    await upsert({
      _type: 'exerciseCategory',
      _id: id,
      title,
      slug: { _type: 'slug', current: slugify(title) },
    })
  }
  for (const [title, id] of muscleMap) {
    await upsert({
      _type: 'muscleGroup',
      _id: id,
      title,
      slug: { _type: 'slug', current: slugify(title) },
    })
  }
  for (const [title, id] of equipmentMap) {
    await upsert({
      _type: 'equipment',
      _id: id,
      title,
      slug: { _type: 'slug', current: slugify(title) },
      isBodyweight: /bodyweight|none|thể trọng|không/i.test(title),
    })
  }

  // ===== 2. Exercises chính =====
  console.log(`\n📦 Migrating ${exercises.length} exercises...`)
  for (const ex of exercises) {
    await upsert({
      _type: 'exercise',
      _id: makeId('ex', ex.id),
      name: ex.name,
      nameEn: ex.nameEn,
      slug: { _type: 'slug', current: slugify(ex.id) },
      videoUrl: ex.videoUrl || undefined,
      gifUrl: ex.gifUrl || undefined,
      // thumbnail: bỏ — cần upload asset thật trước
      category: ex.category
        ? { _type: 'reference', _ref: makeId('cat', ex.category), _weak: true }
        : undefined,
      muscleGroups: Array.isArray(ex.muscles)
        ? ex.muscles.map((m: string) => ({ _type: 'reference', _ref: makeId('muscle', m), _weak: true }))
        : [],
      equipment: Array.isArray(ex.equipment)
        ? ex.equipment.map((e: string) => ({ _type: 'reference', _ref: makeId('equip', e), _weak: true }))
        : [],
      difficulty: ex.difficulty || 'Beginner',
      exerciseType: ex.exerciseType || 'reps',
      defaultSets: ex.defaultSets ?? 3,
      defaultReps: ex.defaultReps ?? '10-12',
      restSeconds: ex.restSeconds ?? 60,
      prepareSeconds: ex.prepareSeconds ?? 10,
      instructions: block(ex.instructions),
      commonMistakes: block(ex.commonMistakes),
      tips: block(ex.tips),
      isTrackable: ex.isTrackable !== false,
      progressionUnit: ex.progressionUnit || 'reps',
    })
  }

  // ===== 3. Home Workout Program (Weekly) =====
  console.log('\n📦 Migrating Home Workout Program...')
  const homeWeeks = asArray(homeWorkoutProgram?.items, 'weeks', 'data')

  if (homeWeeks.length === 0) {
    console.warn('⚠️ homeWorkoutProgram.items rỗng/không tồn tại — bỏ qua phần Home Workout')
  } else {
    const weekDocs: any[] = []
    for (const week of homeWeeks) {
      const weekNum = week.week ?? week.weekNumber ?? week.id ?? ''
      const weekDoc = {
        _type: 'workoutWeek',
        _id: makeId('week', `home-w${weekNum}`),
        weekNumber: Number(weekNum) || 0,
        label: week.label || `Tuần ${weekNum}`,
        focus: week.focus,
        exercises: asArray(week?.items, 'exercises').map((item: any) => ({
          _type: 'reference',
          _ref: makeId('ex', item.id),
          _weak: true,
        })),
      }
      weekDocs.push(weekDoc)
      await upsert(weekDoc)
    }

    await upsert({
      _type: 'workoutProgram',
      _id: 'program-home-workout',
      title: 'Home Workout Pro',
      slug: { _type: 'slug', current: 'home-workout-pro' },
      description: 'Chương trình tập luyện tại nhà 4 tuần, không cần dụng cụ, phù hợp mọi trình độ.',
      icon: 'fa-dumbbell',
      colorTheme: 'rose',
      programType: 'weekly',
      weeks: weekDocs.map((w) => ({ _type: 'reference', _ref: w._id, _weak: true })),
      order: 1,
      isActive: true,
    })
  }

  // ===== 4. Spine Bar Program (Library) =====
  console.log('\n📦 Migrating Spine Bar Program...')
  const spineGroups = asArray(spineBarProgram?.groups)

  if (spineItems.length === 0) {
    console.warn('⚠️ spineBarProgram.items rỗng — bỏ qua phần Spine Bar')
  } else {
    // 4.1. groups → exerciseCategory (prefix riêng để không đụng category của exercises chính)
    const spineCatDocs: any[] = []
    for (const [idx, g] of spineGroups.entries()) {
      const catDoc = {
        _type: 'exerciseCategory',
        _id: makeId('spine-cat', g.id),
        title: g.label || g.short || g.id,
        slug: { _type: 'slug', current: slugify(g.id) },
        description: g.description,
        order: idx,
      }
      spineCatDocs.push(catDoc)
      await upsert(catDoc)
    }

    // 4.2. items → exercise
    //  Prefix "spine-ex-" để không ghi đè exercise chính nếu trùng id
    const difficultyMap: Record<number, string> = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' }
    for (const ex of spineItems) {
      const equipRefs = ex.equipment
        ? [{ _type: 'reference', _ref: makeId('equip', ex.equipment), _weak: true }]
        : []
      const muscleRefs = Array.isArray(ex.spineFocus)
        ? ex.spineFocus.map((m: string) => ({
            _type: 'reference',
            _ref: makeId('muscle', m),
            _weak: true,
          }))
        : []

      await upsert({
        _type: 'exercise',
        _id: makeId('spine-ex', ex.id),
        name: ex.name,
        nameEn: ex.subName || ex.name,
        slug: { _type: 'slug', current: slugify(ex.id) },
        videoUrl: ex.videoUrl || undefined,
        category: ex.groupId
          ? { _type: 'reference', _ref: makeId('spine-cat', ex.groupId), _weak: true }
          : undefined,
        muscleGroups: muscleRefs,
        equipment: equipRefs,
        difficulty: difficultyMap[ex.level] || 'Beginner',
        exerciseType: ex.mode === 'time' ? 'time' : 'reps',
        defaultSets: ex.sets ?? 3,
        defaultReps:
          ex.reps != null
            ? String(ex.reps)
            : ex.duration != null
            ? `${ex.duration}s`
            : '10-12',
        restSeconds: ex.rest ?? 60,
        prepareSeconds: 10,
        instructions: block(ex.guide),
        commonMistakes: block(ex.safety),
        tips: block(ex.progression),
        isTrackable: true,
        progressionUnit: ex.mode === 'time' ? 'seconds' : 'reps',
      })
    }

    // 4.3. workoutProgram
    await upsert({
      _type: 'workoutProgram',
      _id: 'program-spine-bar',
      title: 'Spine Bar - Cột sống khỏe',
      slug: { _type: 'slug', current: 'spine-bar' },
      description: 'Chương trình bảo vệ cột sống, giảm đau lưng, vai gáy qua xà đơn và thể trọng.',
      icon: 'fa-spine',
      colorTheme: 'emerald',
      programType: 'library',
      categories: spineCatDocs.map((c) => ({ _type: 'reference', _ref: c._id, _weak: true })),
      order: 2,
      isActive: true,
    })
  }

  // ===== 5. Karate Program =====
  console.log('\n📦 Migrating Karate Program...')
  const tracks = asArray(KARATE_TRACKS)
  const sessionsAll = asArray(karateSessions)

  if (tracks.length === 0) {
    console.warn('⚠️ KARATE_TRACKS rỗng — bỏ qua phần Karate')
  } else {
    const trackDocs: any[] = []
    for (const track of tracks) {
      const trackId = makeId('track', track.id)
      const trackSessions = sessionsAll.filter((s) => s.track === track.id)

      // Upsert sessions TRƯỚC (chúng reference tới trackId, có _weak nên không cần track tồn tại trước)
      const sessionRefs: any[] = []
      for (const session of trackSessions) {
        const sessionId = makeId('session', session.id)
        await upsert({
          _type: 'karateSession',
          _id: sessionId,
          sessionId: session.id,
          week: session.week,
          name: session.name,
          track: { _type: 'reference', _ref: trackId, _weak: true },
          level: session.level,
          techniques: Array.isArray(session.techniques)
            ? session.techniques.map((t: string) => ({
                _type: 'reference',
                _ref: makeId('ex', t),
                _weak: true,
              }))
            : [],
          warmup: session.warmup
            ? { _type: 'reference', _ref: makeId('ex', session.warmup), _weak: true }
            : undefined,
          cooldown: session.cooldown
            ? { _type: 'reference', _ref: makeId('ex', session.cooldown), _weak: true }
            : undefined,
          durationEstimate: session.durationEstimate ?? 45,
          notes: session.notes,
        })
        sessionRefs.push({ _type: 'reference', _ref: sessionId, _weak: true })
      }

      // Rồi upsert track (reference tới sessions đã tồn tại)
      const trackDoc = {
        _type: 'karateTrack',
        _id: trackId,
        id: track.id,
        label: track.label,
        description: track.description,
        level: track.level,
        sessions: sessionRefs,
        weekLabels: Array.isArray(track.weekLabels) ? track.weekLabels : undefined,
      }
      trackDocs.push(trackDoc)
      await upsert(trackDoc)
    }

    await upsert({
      _type: 'workoutProgram',
      _id: 'program-karate',
      title: 'Karate Training',
      slug: { _type: 'slug', current: 'karate-training' },
      description: 'Hệ thống đào tạo Karate từ cơ bản đến nâng cao: Kihon, Kata, Kumite.',
      icon: 'fa-hand-fist',
      colorTheme: 'amber',
      programType: 'karate',
      tracks: trackDocs.map((t) => ({ _type: 'reference', _ref: t._id, _weak: true })),
      order: 3,
      isActive: true,
    })
  }

  // ===== 6. Site Settings & Achievements =====
  console.log('\n📦 Migrating Site Settings & Achievements...')
  const defaultAchievements = [
    { id: 'first_workout', title: 'Bước đầu tiên',       description: 'Hoàn thành buổi tập đầu tiên',              icon: '🎯', category: 'workout', condition: { type: 'count',      target: 1,  source: 'workout' },                    xpReward: 50,   rarity: 'Common' },
    { id: 'streak_7',      title: 'Kiên trì 7 ngày',     description: 'Duy trì thói quen 7 ngày liên tiếp',       icon: '🔥', category: 'habits',  condition: { type: 'streak',     target: 7,  source: 'habits' },                     xpReward: 200,  rarity: 'Rare' },
    { id: 'streak_30',     title: 'Thép không gió',      description: 'Duy trì thói quen 30 ngày liên tiếp',      icon: '🛡️', category: 'habits',  condition: { type: 'streak',     target: 30, source: 'habits' },                     xpReward: 1000, rarity: 'Epic' },
    { id: 'karate_white',  title: 'Võ sinh mới',         description: 'Hoàn thành lộ trình Kihon Basics',          icon: '🥋', category: 'karate',  condition: { type: 'completion', target: 1,  source: 'karate', filter: 'track:kihon' }, xpReward: 500,  rarity: 'Rare' },
    { id: 'pullup_10',     title: 'Kéo xà 10 cái',       description: 'Đạt PR 10 lần kéo xà đơn',                  icon: '💪', category: 'spine',   condition: { type: 'pr',         target: 10, source: 'spine',  filter: 'exercise:pullup' }, xpReward: 300,  rarity: 'Rare' },
  ]

  await upsert({
    _type: 'siteSettings',
    _id: 'site-settings',
    appName: 'Home Workout Pro',
    achievements: defaultAchievements,
  })

  console.log('\n🎉 MIGRATION HOÀN TẤT!')
  console.log('👉 Vào Sanity Studio kiểm tra: http://localhost:3333')
}

migrate().catch((err) => {
  console.error('💥 Migration failed:', err)
  process.exit(1)
})