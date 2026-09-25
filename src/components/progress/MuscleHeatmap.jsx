import { useState } from 'react';
import { getMuscleMapForExercise, getRouteMuscleSummary, MUSCLE_LABELS } from '../../data/muscleData';

/*
  MuscleHeatmap — người SVG (mặt trước + mặt sau) với các path nhóm cơ
  đổi màu fill theo data "muscles" của bài tập đang chọn:
    level 2 (primary)   -> đỏ đậm
    level 1 (secondary) -> cam nhạt
    không tác động      -> xám
  Có tooltip tiếng Việt khi rê/chạm vào nhóm cơ.
*/

const COLOR_NONE = '#334155';
const COLOR_SECONDARY = '#fb923c';
const COLOR_PRIMARY = '#ef4444';

function fillColor(level) {
  if (level >= 2) return COLOR_PRIMARY;
  if (level === 1) return COLOR_SECONDARY;
  return COLOR_NONE;
}

// ----- đường bao chung của cơ thể (dùng làm nền mờ phía sau các cơ) -----
const BODY_OUTLINE_FRONT =
  'M100 14 a17 17 0 0 1 17 17 v9 a17 17 0 0 1 -15 16 l7 3 q22 6 25 26 l8 44 q1 8 -7 9 l-5 1 4 42 -3 66 q-1 8 -9 8 t-9 -8 l-4 -58 h-6 l-4 58 q-1 8 -9 8 t-9 -8 l-3 -66 4 -42 -5 -1 q-8 -1 -7 -9 l8 -44 q3 -20 25 -26 l7 -3 a17 17 0 0 1 -15 -16 v-9 a17 17 0 0 1 17 -17 Z';
const BODY_OUTLINE_BACK = BODY_OUTLINE_FRONT;

function FrontView({ map, onEnter, onLeave }) {
  const muscle = (id, d, extra = {}) => (
    <path
      d={d}
      fill={fillColor(map[id])}
      stroke="#0f172a"
      strokeWidth="1"
      className="cursor-pointer transition-[fill] duration-300 hover:opacity-80"
      onMouseEnter={() => onEnter(id)}
      onMouseLeave={onLeave}
      {...extra}
    />
  );

  return (
    <g>
      <path d={BODY_OUTLINE_FRONT} fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      {muscle('neck', 'M92 50 h16 v10 h-16 Z')}
      {muscle('shoulderL', 'M63 66 Q53 71 51 83 L65 87 Q66 74 71 68 Z')}
      {muscle('shoulderR', 'M137 66 Q147 71 149 83 L135 87 Q134 74 129 68 Z')}
      {muscle('chestL', 'M99 68 L71 70 Q66 82 74 92 L98 96 Q99 82 99 68 Z')}
      {muscle('chestR', 'M101 68 L129 70 Q134 82 126 92 L102 96 Q101 82 101 68 Z')}
      {muscle('bicepsL', 'M52 86 Q48 102 52 116 L65 112 Q66 96 64 88 Z')}
      {muscle('bicepsR', 'M148 86 Q152 102 148 116 L135 112 Q134 96 136 88 Z')}
      {muscle('foreL', 'M51 119 Q48 136 51 152 L61 150 Q64 133 64 116 Z')}
      {muscle('foreR', 'M149 119 Q152 136 149 152 L139 150 Q136 133 136 116 Z')}
      {muscle('absUpper', 'M85 100 h13 v15 h-13 Z')}
      {muscle('absLower', 'M85 132 h13 v18 h-13 Z')}
      {muscle('obliquesL', 'M72 100 h11 v34 q-7 3 -11 -2 Z')}
      {muscle('quadL', 'M75 156 Q72 182 76 204 L91 204 Q95 180 93 156 Z')}
      {muscle('hipFlexors', 'M86 152 h28 v6 H86 Z')}
      {/* đối xứng phải */}
      {muscle('absUpperR', 'M102 100 h13 v15 h-13 Z')}
      {muscle('absLowerR', 'M102 132 h13 v18 h-13 Z')}
      {muscle('obliquesR', 'M117 100 h11 q4 5 -3 34 h-8 Z')}
      {muscle('quadR', 'M125 156 Q128 182 124 204 L109 204 Q105 180 107 156 Z')}
      {/* cẳng chân trước (không nằm trong data -> nền) */}
      <path d="M77 208 L91 208 Q93 230 89 250 L81 250 Q77 230 77 208 Z" fill={COLOR_NONE} opacity="0.5" />
      <path d="M123 208 L109 208 Q107 230 111 250 L119 250 Q123 230 123 208 Z" fill={COLOR_NONE} opacity="0.5" />
    </g>
  );
}

function BackView({ map, onEnter, onLeave }) {
  const muscle = (id, d) => (
    <path
      d={d}
      fill={fillColor(map[id])}
      stroke="#0f172a"
      strokeWidth="1"
      className="cursor-pointer transition-[fill] duration-300 hover:opacity-80"
      onMouseEnter={() => onEnter(id)}
      onMouseLeave={onLeave}
    />
  );

  return (
    <g>
      <path d={BODY_OUTLINE_BACK} fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      {muscle('neck', 'M92 50 h16 v10 h-16 Z')}
      {muscle('chestCoreUL', 'M99 68 L73 71 Q70 84 76 96 L98 98 Z')}
      {muscle('chestCoreUR', 'M101 68 L127 71 Q130 84 124 96 L102 98 Z')}
      {muscle('lowerBackUL', 'M84 102 h14 v28 h-14 Z')}
      {muscle('lowerBackUR', 'M102 102 h14 v28 h-14 Z')}
      {muscle('glutesL', 'M72 136 Q70 156 84 162 L98 158 V134 Q84 130 72 136 Z')}
      {muscle('glutesR', 'M128 136 Q130 156 116 162 L102 158 V134 Q116 130 128 136 Z')}
      {muscle('hamL', 'M76 166 Q72 188 76 206 L92 206 Q95 186 94 166 Z')}
      {muscle('hamR', 'M124 166 Q128 188 124 206 L108 206 Q105 186 106 166 Z')}
      {muscle('calfL', 'M78 210 L92 210 Q94 232 88 250 L82 250 Q76 232 78 210 Z')}
      {muscle('calfR', 'M122 210 L108 210 Q106 232 112 250 L118 250 Q124 232 122 210 Z')}
      {muscle('shoulderL', 'M63 66 Q53 71 51 83 L65 87 Q66 74 71 68 Z')}
      {muscle('shoulderR', 'M137 66 Q147 71 149 83 L135 87 Q134 74 129 68 Z')}
    </g>
  );
}

// thân người đối xứng trái/phải -> các path "xxxL/xxxR" dùng chung level với id gốc trong data
function normalizeMap(rawMap) {
  const m = { ...rawMap };
  const alias = {
    absUpperR: 'absUpper',
    absLowerR: 'absLower',
    obliquesL: 'obliques',
    obliquesR: 'obliques',
    chestCoreUL: 'chestCore',
    chestCoreUR: 'chestCore',
    lowerBackUL: 'lowerBack',
    lowerBackUR: 'lowerBack',
    glutesL: 'glutes',
    glutesR: 'glutes',
  };
  for (const [pathId, dataId] of Object.entries(alias)) {
    m[pathId] = m[dataId];
  }
  return m;
}

export default function MuscleHeatmap({ exercise, view = 'route' }) {
  const [hovered, setHovered] = useState(null);

  const rawMap = view === 'exercise' && exercise
    ? getMuscleMapForExercise(exercise)
    : getRouteMuscleSummary();

  const map = normalizeMap(rawMap);

  const handleEnter = (id) => {
    if (MUSCLE_LABELS[id]) setHovered(id);
  };
  const handleLeave = () => setHovered(null);

  const hoveredLabel = hovered ? MUSCLE_LABELS[hovered] : null;
  const hoveredLevel = hovered ? map[hovered] : null;

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl border border-slate-700/50 p-5 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <i className="fa-solid fa-fire text-red-400"></i>
          Bản đồ cơ
          <span className="text-[10px] font-medium text-slate-400 bg-slate-700/60 rounded-full px-2 py-0.5">
            {view === 'exercise' && exercise ? exercise.name : 'Toàn lộ trình'}
          </span>
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2 max-w-[320px] mx-auto">
        <figure className="m-0">
          <svg viewBox="55 10 90 250" className="w-full h-auto" role="img" aria-label="Cơ thể mặt trước">
            <FrontView map={map} onEnter={handleEnter} onLeave={handleLeave} />
          </svg>
          <figcaption className="text-center text-[10px] uppercase tracking-widest text-slate-500 mt-1">Trước</figcaption>
        </figure>
        <figure className="m-0">
          <svg viewBox="55 10 90 250" className="w-full h-auto" role="img" aria-label="Cơ thể mặt sau">
            <BackView map={map} onEnter={handleEnter} onLeave={handleLeave} />
          </svg>
          <figcaption className="text-center text-[10px] uppercase tracking-widest text-slate-500 mt-1">Sau</figcaption>
        </figure>
      </div>

      {/* tooltip vùng cơ đang trỏ */}
      <div className="h-6 text-center mt-1">
        {hoveredLabel ? (
          <span className={`text-xs font-semibold ${hoveredLevel >= 2 ? 'text-red-400' : 'text-orange-400'}`}>
            {hoveredLabel} — {hoveredLevel >= 2 ? 'nhóm cơ chính' : 'trợ lực'}
          </span>
        ) : (
          <span className="text-xs text-slate-500">Rê chuột vào cơ để xem tên nhóm cơ</span>
        )}
      </div>

      {/* chú giải */}
      <div className="flex items-center justify-center gap-4 mt-2 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5"><i className="w-3 h-3 rounded-sm inline-block" style={{ background: COLOR_PRIMARY }}></i>Cơ chính</span>
        <span className="flex items-center gap-1.5"><i className="w-3 h-3 rounded-sm inline-block" style={{ background: COLOR_SECONDARY }}></i>Trợ lực</span>
        <span className="flex items-center gap-1.5"><i className="w-3 h-3 rounded-sm inline-block" style={{ background: COLOR_NONE }}></i>Không tập</span>
      </div>
    </div>
  );
}
