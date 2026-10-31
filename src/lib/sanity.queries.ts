// GROQ Queries cho Sanity
// Tối ưu: Chỉ fetch fields cần thiết, dùng projection để flatten references

export const queries = {
  // 1. Lấy tất cả chương trình active cho Menu/Header
  programs: `*[_type == "workoutProgram" && isActive == true] | order(order asc) {
    _id, _updatedAt, title, slug, icon, colorTheme, programType, description
  }`,

  // 2. Lấy chi tiết 1 chương trình bằng Slug (Home, Spine, Karate)
  programBySlug: (slug: string) => `*[_type == "workoutProgram" && slug.current == $slug][0] {
    _id, _updatedAt, title, slug, icon, colorTheme, programType, description,
    // Weekly Program
    "weeks": weeks[]->{
      _id, _updatedAt, weekNumber, label, focus,
      "exercises": exercises[]->{
        _id, _updatedAt, slug, name, nameEn, videoUrl, thumbnail, gifUrl,
        exerciseType, defaultSets, defaultReps, restSeconds, prepareSeconds,
        "category": category->{_id, title, slug},
        "muscleGroups": muscleGroups[]->{_id, title, slug},
        "equipment": equipment[]->{_id, title, slug},
        difficulty, instructions, commonMistakes, tips,
        isTrackable, progressionUnit
      }
    },
    // Library Program (Spine Bar)
    "categories": categories[]->{
      _id, _updatedAt, title, slug, icon, order,
      "exercises": *[_type == "exercise" && references(^._id)] | order(name asc) {
        _id, _updatedAt, slug, name, nameEn, videoUrl, thumbnail, gifUrl,
        exerciseType, defaultSets, defaultReps, restSeconds, prepareSeconds,
        "category": category->{_id, title, slug},
        "muscleGroups": muscleGroups[]->{_id, title, slug},
        "equipment": equipment[]->{_id, title, slug},
        difficulty, instructions, commonMistakes, tips,
        isTrackable, progressionUnit
      }
    },
    // Karate Program
    "tracks": tracks[]->{
      _id, _updatedAt, id, label, description, level, weekLabels,
      "sessions": sessions[]->{
        _id, _updatedAt, sessionId, week, name, level, durationEstimate, notes,
        "techniques": techniques[]->{
          _id, _updatedAt, slug, name, nameEn, videoUrl, thumbnail, gifUrl,
          exerciseType, instructions, commonMistakes, tips
        },
        "warmup": warmup->{
          _id, _updatedAt, slug, name, nameEn, videoUrl, thumbnail, exerciseType, defaultReps, restSeconds, prepareSeconds
        },
        "cooldown": cooldown->{
          _id, _updatedAt, slug, name, nameEn, videoUrl, thumbnail, exerciseType, defaultReps, restSeconds, prepareSeconds
        }
      }
    }
  }`,

  // 3. Lấy 1 bài tập cụ thể (cho Timer/Detail Modal)
  exerciseById: (id: string) => `*[_type == "exercise" && _id == $id][0] {
    _id, _updatedAt, slug, name, nameEn, videoUrl, thumbnail, gifUrl,
    exerciseType, defaultSets, defaultReps, restSeconds, prepareSeconds,
    "category": category->{_id, title, slug},
    "muscleGroups": muscleGroups[]->{_id, title, slug},
    "equipment": equipment[]->{_id, title, slug},
    difficulty, instructions, commonMistakes, tips,
    isTrackable, progressionUnit
  }`,

  // 4. Lấy bài tập theo Category (cho Filter Spine Bar)
  exercisesByCategory: (categorySlug: string) => `*[_type == "exercise" && category->slug.current == $categorySlug] | order(name asc) {
    _id, _updatedAt, slug, name, nameEn, videoUrl, thumbnail, gifUrl,
    exerciseType, defaultSets, defaultReps, restSeconds, prepareSeconds,
    "category": category->{_id, title, slug},
    "muscleGroups": muscleGroups[]->{_id, title, slug},
    "equipment": equipment[]->{_id, title, slug},
    difficulty, instructions, commonMistakes, tips,
    isTrackable, progressionUnit
  }`,

  // 5. Lấy Settings (Achievements, App Config)
  siteSettings: `*[_type == "siteSettings"][0] {
    _id, _updatedAt, appName, 
    "defaultTimerSound": defaultTimerSound.asset->url,
    "achievements": achievements[]
  }`,

  // 6. Search bài tập (cho future search feature)
  searchExercises: (term: string) => `*[_type == "exercise" && (name match $term || nameEn match $term || "exercise" in *[_type=="exerciseCategory" && title match $term]._id)] | order(name asc) {
    _id, slug, name, nameEn, videoUrl, thumbnail, exerciseType, difficulty,
    "category": category->{title, slug}
  }`,
}