// Sanity data mapper for ExerciseItem
// Map AppExercise (Sanity) -> Legacy format expected by ExerciseItem

export function mapSanityToLegacyExercise(sanityExercise) {
  if (!sanityExercise) return null;
  
  return {
    id: sanityExercise.id,
    name: sanityExercise.name,
    subName: sanityExercise.nameEn,
    target: sanityExercise.muscleGroups?.join(', '),
    mode: sanityExercise.exerciseType === 'hold' ? 'time' : 'reps', // hold -> time, reps -> reps
    duration: sanityExercise.exerciseType === 'hold' 
      ? parseDuration(sanityExercise.defaultReps) // "30s" -> 30
      : sanityExercise.defaultSets * 60, // fallback for time mode
    sets: sanityExercise.defaultSets,
    reps: sanityExercise.exerciseType === 'reps' 
      ? parseReps(sanityExercise.defaultReps) // "10-12" -> 10 (take first)
      : null,
    rest: sanityExercise.restSeconds,
    guide: getGuideText(sanityExercise.instructions), // PortableText -> string
    type: sanityExercise.category?.slug || 'general',
    svg: getSvgIcon(sanityExercise.category?.slug),
    category: sanityExercise.category?.title,
    videoUrl: sanityExercise.videoUrl,
    // New fields
    exerciseType: sanityExercise.exerciseType,
    defaultReps: sanityExercise.defaultReps,
    restSeconds: sanityExercise.restSeconds,
    prepareSeconds: sanityExercise.prepareSeconds,
  };
}

function parseDuration(str) {
  if (!str) return 30;
  const match = str.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 30;
}

function parseReps(str) {
  if (!str) return 10;
  const match = str.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 10;
}

function getGuideText(blocks) {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .filter((b) => b._type === 'block' && b.children)
    .map((b) => b.children.map((c) => c.text).join(''))
    .join('\n\n');
}

function getSvgIcon(categorySlug) {
  const iconMap = {
    'bung': 'bicycle',
    'bung-duoi': 'supine',
    'lung-cot-song': 'birddog',
    'lung-vai': 'prone-ytw',
    'chan-mong': 'squat',
    'toan-than': 'climber',
    'than-tren': 'pushup',
    'voi': 'plank',
  };
  return iconMap[categorySlug] || 'dumbbell';
}