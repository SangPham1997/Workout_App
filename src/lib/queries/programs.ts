export const HOME_PROGRAM_QUERY = `
  *[_type == "workoutProgram" && _id == "program-home-workout"][0] {
    _id, title, subtitle, accent, groupBy,
    "groups": groups[],
    "items": items[]-> {
      _id, name, subName, category, mode, duration, sets, reps, rest,
      guide, videoUrl, week
    }
  }
`

export const SPINE_PROGRAM_QUERY = `
  *[_type == "workoutProgram" && _id == "program-spine-bar"][0] {
    _id, title, subtitle, accent, groupBy,
    "groups": groups[],
    "items": items[]-> {
      _id, name, subName, category, mode, duration, sets, reps, rest,
      guide, videoUrl, level, equipment, bar,
      spineFocus, deskIssues, safety, regression, progression, groupId
    }
  }
`