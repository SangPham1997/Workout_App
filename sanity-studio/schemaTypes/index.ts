import workoutProgram from './workoutProgram'
import exercise from './exercise'
import exerciseCategory from './exerciseCategory'
import muscleGroup from './muscleGroup'
import equipment from './equipment'
import workoutWeek from './workoutWeek'
import karateTrack from './karateTrack'
import karateSession from './karateSession'
import siteSettings from './siteSettings'
import achievement from './achievement'

export const schemaTypes = [
  // Core Content
  workoutProgram,
  exercise,
  exerciseCategory,
  muscleGroup,
  equipment,
  
  // Program Structures
  workoutWeek,
  karateTrack,
  karateSession,
  
  // Settings
  siteSettings,
  achievement,
]