import { exercises } from '../data/exercises';

/*
  muscleData — bản đồ bài tập -> nhóm cơ tác động.
  Mã cơ khớp với các path trong MuscleHeatmap.jsx.
  level: 2 = primary (tập trung chính), 1 = secondary (phụ/trợ lực).
*/

export const MUSCLE_LABELS = {
  neck: 'Cơ cổ',
  shoulderL: 'Vai trái',
  shoulderR: 'Vai phải',
  chestL: 'Ngực trái',
  chestR: 'Ngực phải',
  bicepsL: 'Cánh tay trái',
  bicepsR: 'Cánh tay phải',
  foreL: 'Cẳng tay trái',
  foreR: 'Cẳng tay phải',
  absUpper: 'Bụng trên',
  absLower: 'Bụng dưới',
  obliques: 'Bụng chéo',
  chestCore: 'Lưng trên / lõi sau',
  lowerBack: 'Lưng dưới',
  hipFlexors: 'Gập hông',
  glutes: 'Cơ mông',
  quadL: 'Đùi trước trái',
  quadR: 'Đùi trước phải',
  hamL: 'Đùi sau trái',
  hamR: 'Đùi sau phải',
  calfL: 'Bắp chân trái',
  calfR: 'Bắp chân phải',
};

// Mỗi bài tập tự khai báo cơ tác động ngay trong data (muscles field)
export function getMuscleMapForExercise(exercise) {
  const map = {};
  for (const entry of exercise?.muscles ?? []) {
    map[entry.id] = Math.max(map[entry.id] ?? 0, entry.level);
  }
  return map;
}

/** Tổng kết nhóm cơ của toàn lộ trình (dùng cho heatmap chế độ "all") */
export function getRouteMuscleSummary(list = exercises) {
  const summary = {};
  for (const ex of list) {
    for (const { id, level } of ex.muscles ?? []) {
      summary[id] = Math.max(summary[id] ?? 0, level);
    }
  }
  return summary;
}
