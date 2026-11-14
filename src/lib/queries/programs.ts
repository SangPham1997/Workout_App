export const HOME_PROGRAM_QUERY = `
  *[_type == "workoutProgram" && _id == "program-home-workout"][0] {
    _id,
    title,
    subtitle,
    accent,
    groupBy,
    "groups": groups[] {
      id,
      label,
      short,
      icon,
      description
    },
    "items": items[]-> {
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
      level,
      bar,
      groupId
    }
  }
`

export const SPINE_PROGRAM_QUERY = `
  *[_type == "workoutProgram" && _id == "program-spine-bar"][0] {
    _id,
    title,
    subtitle,
    accent,
    groupBy,
    "groups": groups[] {
      id,
      label,
      short,
      icon,
      description
    },
    "items": items[]-> {
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
      level,
      bar,
      groupId,
      spineFocus,
      deskIssues,
      safety,
      regression,
      progression
    }
  }
`