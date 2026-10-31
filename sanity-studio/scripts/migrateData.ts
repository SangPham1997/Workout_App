// Migration Script: Push dữ liệu từ src/data/* lên Sanity
// Chạy: npm run migrate  (hoặc: cd sanity-studio && npx tsx scripts/migrateData.ts)
// Cần SANITY_API_TOKEN + SANITY_STUDIO_PROJECT_ID + SANITY_STUDIO_DATASET
// đặt trong gốc repo `.env` hoặc `sanity-studio/.env.local`.

import { loadScriptEnv } from './loadEnv'

// PHẢI load env TRƯỚC khi import sanity.client (client đọc process.env lúc khởi tạo)
loadScriptEnv()

const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID
const DATASET = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_API_TOKEN

if (!PROJECT_ID || !TOKEN) {
  console.error(
    '❌ Thiếu cấu hình. Hãy thêm vào file ".env" (gốc repo) hoặc "sanity-studio/.env.local":\n' +
      '   SANITY_STUDIO_PROJECT_ID=<project-id>\n' +
      '   SANITY_STUDIO_DATASET=production\n' +
      '   SANITY_API_TOKEN=<token Editor>'
  )
  process.exit(1)
}

// Import động SAU khi env đã sẵn sàng
const { createClient } = await import('@sanity/client')
const sanityWriteClient = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: TOKEN,
})

// Đường dẫn đúng: script nằm ở <repo>/sanity-studio/scripts/ → src là ../<../../src>
const { exercises } = await import('../../src/data/exercises.js')
const { homeWorkoutProgram } = await import('../../src/data/programs/homeWorkout.js')
const { karateSessions, KARATE_TRACKS } = await import('../../src/data/karate/index.js')
const { spineBarProgram } = await import('../../src/data/programs/spineBar.js')
const { habitTemplates } = await import('../../src/data/habitTemplates.js')

// Helper: Tạo Sanity Document ID ổn định
const makeId = (prefix: string, key: string) => `${prefix}-${key.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

// Helper: Upload image từ URL (nếu có) - Tạm bỏ qua, chỉ lưu URL
// Thực tế nên download -> upload asset -> lấy _ref

async function upsert(doc: any) {
  try {
    await sanityWriteClient.createOrReplace(doc)
    console.log(`✅ Upserted: ${doc._type} - ${doc._id}`)
  } catch (err) {
    console.error(`❌ Failed: ${doc._type} - ${doc._id}`, err)
  }
}

async function migrate() {
  console.log('🚀 Bắt đầu migration dữ liệu lên Sanity...')
  
  // ===== 1. Tạo Categories, Muscle Groups, Equipment từ dữ liệu exercises =====
  const categoryMap = new Map<string, string>()
  const muscleMap = new Map<string, string>()
  const equipmentMap = new Map<string, string>()

  // Collect unique values
  exercises.forEach((ex) => {
    if (ex.category) categoryMap.set(ex.category, makeId('cat', ex.category))
    ex.muscles?.forEach((m: string) => muscleMap.set(m, makeId('muscle', m)))
    ex.equipment?.forEach((e: string) => equipmentMap.set(e, makeId('equip', e)))
  })

  // Upsert Categories
  for (const [title, id] of categoryMap) {
    await upsert({
      _type: 'exerciseCategory',
      _id: id,
      title,
      slug: { current: title.toLowerCase().replace(/\s+/g, '-') },
    })
  }
  
  // Upsert Muscle Groups
  for (const [title, id] of muscleMap) {
    await upsert({
      _type: 'muscleGroup',
      _id: id,
      title,
      slug: { current: title.toLowerCase().replace(/\s+/g, '-') },
    })
  }
  
  // Upsert Equipment
  for (const [title, id] of equipmentMap) {
    await upsert({
      _type: 'equipment',
      _id: id,
      title,
      slug: { current: title.toLowerCase().replace(/\s+/g, '-') },
      isBodyweight: title.toLowerCase().includes('bodyweight') || title.toLowerCase() === 'none',
    })
  }

  // ===== 2. Tạo Exercises =====
  console.log(`\n📦 Migrating ${exercises.length} exercises...`)
  for (const ex of exercises) {
    const doc = {
      _type: 'exercise',
      _id: makeId('ex', ex.id),
      name: ex.name,
      nameEn: ex.nameEn,
      slug: { current: ex.id },
      videoUrl: ex.videoUrl,
      gifUrl: ex.gifUrl,
      thumbnail: ex.thumbnail ? { _type: 'reference', _ref: `sanity-image-asset-${ex.id}` } : undefined, // Cần upload asset thực tế
      category: ex.category ? { _type: 'reference', _ref: makeId('cat', ex.category) } : undefined,
      muscleGroups: ex.muscles?.map((m: string) => ({ _type: 'reference', _ref: makeId('muscle', m) })) || [],
      equipment: ex.equipment?.map((e: string) => ({ _type: 'reference', _ref: makeId('equip', e) })) || [],
      difficulty: ex.difficulty || 'Beginner',
      exerciseType: ex.exerciseType || 'reps',
      defaultSets: ex.defaultSets || 3,
      defaultReps: ex.defaultReps || '10-12',
      restSeconds: ex.restSeconds || 60,
      prepareSeconds: ex.prepareSeconds || 10,
      instructions: ex.instructions ? [{ _type: 'block', children: [{ _type: 'span', text: ex.instructions }] }] : [],
      commonMistakes: ex.commonMistakes ? [{ _type: 'block', children: [{ _type: 'span', text: ex.commonMistakes }] }] : [],
      tips: ex.tips ? [{ _type: 'block', children: [{ _type: 'span', text: ex.tips }] }] : [],
      isTrackable: ex.isTrackable !== false,
      progressionUnit: ex.progressionUnit || 'reps',
    }
    await upsert(doc)
  }

  // ===== 3. Tạo Home Workout Program (Weekly) =====
  console.log('\n📦 Migrating Home Workout Program...')
  const weekDocs = homeWorkoutProgram.items.map((week, idx) => {
    const weekId = makeId('week', `home-w${week.week}`)
    return {
      _type: 'workoutWeek',
      _id: weekId,
      weekNumber: week.week,
      label: week.label || `Tuần ${week.week}`,
      focus: week.focus,
      exercises: week.items.map((item) => ({
        _type: 'reference',
        _ref: makeId('ex', item.id),
      })),
    }
  })

  for (const week of weekDocs) await upsert(week)

  await upsert({
    _type: 'workoutProgram',
    _id: 'program-home-workout',
    title: 'Home Workout Pro',
    slug: { current: 'home-workout-pro' },
    description: 'Chương trình tập luyện tại nhà 4 tuần, không cần dụng cụ, phù hợp mọi trình độ.',
    icon: 'fa-dumbbell',
    colorTheme: 'rose',
    programType: 'weekly',
    weeks: weekDocs.map((w) => ({ _type: 'reference', _ref: w._id })),
    order: 1,
    isActive: true,
  })

  // ===== 4. Tạo Spine Bar Program (Library) =====
  console.log('\n📦 Migrating Spine Bar Program...')
  const spineCategories = [...new Set(spineBarProgram.items.map((ex) => ex.category).filter(Boolean))]
  const spineCatDocs = spineCategories.map((cat) => {
    const id = makeId('cat', cat)
    return {
      _type: 'exerciseCategory',
      _id: id,
      title: cat,
      slug: { current: cat.toLowerCase().replace(/\s+/g, '-') },
      order: spineCategories.indexOf(cat),
    }
  })
  for (const cat of spineCatDocs) await upsert(cat)

  // Map Spine Bar exercises (cần merge với exercises chính hoặc tạo mới)
  // Giả sử spineBarProgram.items đã có trong exercises hoặc tạo mới
  const spineExDocs = spineBarProgram.items.map((ex) => {
    const id = makeId('ex', ex.id)
    return {
      _type: 'exercise',
      _id: id,
      name: ex.name,
      nameEn: ex.nameEn,
      slug: { current: ex.id },
      videoUrl: ex.videoUrl,
      gifUrl: ex.gifUrl,
      thumbnail: ex.thumbnail ? { _type: 'reference', _ref: `sanity-image-asset-${ex.id}` } : undefined,
      category: ex.category ? { _type: 'reference', _ref: makeId('cat', ex.category) } : undefined,
      muscleGroups: ex.muscles?.map((m: string) => ({ _type: 'reference', _ref: makeId('muscle', m) })) || [],
      equipment: ex.equipment?.map((e: string) => ({ _type: 'reference', _ref: makeId('equip', e) })) || [],
      difficulty: ex.difficulty || 'Beginner',
      exerciseType: ex.exerciseType || 'reps',
      defaultSets: ex.defaultSets || 3,
      defaultReps: ex.defaultReps || '10-12',
      restSeconds: ex.restSeconds || 60,
      prepareSeconds: ex.prepareSeconds || 10,
      instructions: ex.instructions ? [{ _type: 'block', children: [{ _type: 'span', text: ex.instructions }] }] : [],
      commonMistakes: ex.commonMistakes ? [{ _type: 'block', children: [{ _type: 'span', text: ex.commonMistakes }] }] : [],
      tips: ex.tips ? [{ _type: 'block', children: [{ _type: 'span', text: ex.tips }] }] : [],
      isTrackable: ex.isTrackable !== false,
      progressionUnit: ex.progressionUnit || 'reps',
    }
  })
  for (const ex of spineExDocs) await upsert(ex)

  await upsert({
    _type: 'workoutProgram',
    _id: 'program-spine-bar',
    title: 'Spine Bar - Cột sống khỏe',
    slug: { current: 'spine-bar' },
    description: 'Chương trình bảo vệ cột sống, giảm đau lưng, vai gáy qua xà đơn và thể trọng.',
    icon: 'fa-spine',
    colorTheme: 'emerald',
    programType: 'library',
    categories: spineCatDocs.map((c) => ({ _type: 'reference', _ref: c._id })),
    order: 2,
    isActive: true,
  })

  // ===== 5. Tạo Karate Program =====
  console.log('\n📦 Migrating Karate Program...')
  const trackDocs = KARATE_TRACKS.map((track) => {
    const sessions = karateSessions
      .filter((s) => s.track === track.id)
      .map((session) => {
        const sessionId = makeId('session', session.id)
        return {
          _type: 'karateSession',
          _id: sessionId,
          sessionId: session.id,
          week: session.week,
          name: session.name,
          track: { _type: 'reference', _ref: makeId('track', track.id) },
          level: session.level,
          techniques: session.techniques?.map((t: string) => ({ _type: 'reference', _ref: makeId('ex', t) })) || [],
          warmup: session.warmup ? { _type: 'reference', _ref: makeId('ex', session.warmup) } : undefined,
          cooldown: session.cooldown ? { _type: 'reference', _ref: makeId('ex', session.cooldown) } : undefined,
          durationEstimate: session.durationEstimate || 45,
          notes: session.notes,
        }
      })

    for (const s of sessions) upsert(s) // Fire and forget for sessions

    return {
      _type: 'karateTrack',
      _id: makeId('track', track.id),
      id: track.id,
      label: track.label,
      description: track.description,
      level: track.level,
      sessions: sessions.map((s) => ({ _type: 'reference', _ref: s._id })),
      weekLabels: track.weekLabels ? JSON.stringify(track.weekLabels) : undefined,
    }
  })

  for (const track of trackDocs) await upsert(track)

  await upsert({
    _type: 'workoutProgram',
    _id: 'program-karate',
    title: 'Karate Training',
    slug: { current: 'karate-training' },
    description: 'Hệ thống đào tạo Karate từ cơ bản đến nâng cao: Kihon, Kata, Kumite.',
    icon: 'fa-hand-fist',
    colorTheme: 'amber',
    programType: 'karate',
    tracks: trackDocs.map((t) => ({ _type: 'reference', _ref: t._id })),
    order: 3,
    isActive: true,
  })

  // ===== 6. Site Settings & Achievements =====
  console.log('\n📦 Migrating Site Settings & Achievements...')
  const defaultAchievements = [
    { id: 'first_workout', title: 'Bước đầu tiên', description: 'Hoàn thành buổi tập đầu tiên', icon: '🎯', category: 'workout', condition: { type: 'count', target: 1, source: 'workout' }, xpReward: 50, rarity: 'Common' },
    { id: 'streak_7', title: 'Kiên trì 7 ngày', description: 'Duy trì thói quen 7 ngày liên tiếp', icon: '🔥', category: 'habits', condition: { type: 'streak', target: 7, source: 'habits' }, xpReward: 200, rarity: 'Rare' },
    { id: 'streak_30', title: 'Thép không gió', description: 'Duy trì thói quen 30 ngày liên tiếp', icon: '🛡️', category: 'habits', condition: { type: 'streak', target: 30, source: 'habits' }, xpReward: 1000, rarity: 'Epic' },
    { id: 'karate_white', title: 'Võ sinh mới', description: 'Hoàn thành lộ trình Kihon Basics', icon: '🥋', category: 'karate', condition: { type: 'completion', target: 1, source: 'karate', filter: 'track:kihon' }, xpReward: 500, rarity: 'Rare' },
    { id: 'pullup_10', title: 'Kéo xà 10 cái', description: 'Đạt PR 10 lần kéo xà đơn', icon: '💪', category: 'spine', condition: { type: 'pr', target: 10, source: 'spine', filter: 'exercise:pullup' }, xpReward: 300, rarity: 'Rare' },
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