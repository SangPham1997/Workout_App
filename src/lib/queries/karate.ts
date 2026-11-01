export const KARATE_SESSIONS_QUERY = `
  *[_type == "karateSession"] | order(track asc, week asc, order asc) {
    _id, id, name, subName, target, duration, durationDisplay, category,
    week, level, type, icon, equipment, source, guide, homework,
    track, order, focus, techniques, exercises
  }
`