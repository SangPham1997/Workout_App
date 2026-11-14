export const EXERCISES_QUERY = `
  *[_type == "homeExercise"] | order(week asc, name asc) {
    _id,
    _type,
    name,
    subName,
    target,
    category,
    mode,
    duration,
    sets,
    reps,
    rest,
    guide,
    videoUrl,
    week,
    equipment,
    safety,
    regression,
    progression,
    type,
    svg
  }
`

export const SPINE_EXERCISES_QUERY = `
  *[_type == "spineExercise"] | order(groupId asc, level asc, name asc) {
    _id,
    _type,
    name,
    subName,
    target,
    mode,
    duration,
    sets,
    reps,
    rest,
    guide,
    videoUrl,
    level,
    bar,
    groupId,
    spineFocus,
    deskIssues,
    safety,
    regression,
    progression,
    type,
    svg
  }
`