export const EXERCISES_QUERY = `
  *[_type == "exercise" && !(_id match "spine-ex-*")] | order(week asc, name asc) {
    _id, name, subName, category, mode, duration, sets, reps, rest,
    guide, videoUrl, week, level, equipment, bar,
    spineFocus, deskIssues, safety, regression, progression
  }
`

export const SPINE_EXERCISES_QUERY = `
  *[_type == "exercise" && _id match "spine-ex-*"] | order(groupId asc) {
    _id, name, subName, category, mode, duration, sets, reps, rest,
    guide, videoUrl, level, equipment, bar,
    spineFocus, deskIssues, safety, regression, progression, groupId
  }
`