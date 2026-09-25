/* =========================================================
   SVG FIGURE LIB — bộ hình người tĩnh (stickman vector) cho
   từng bài tập. Dùng chung cho Simulator (SvgSimulator) và
   danh sách bài tập (ExerciseBadge). Không dùng Canvas.
   Khung nhìn chuẩn: viewBox="0 0 200 200", sàn tại y=182.
   props: { primary, secondary } — màu stroke.
   ========================================================= */

const FLOOR = 182;

function Floor({ color }) {
  return (
    <g>
      <line x1="14" y1={FLOOR} x2="186" y2={FLOOR} stroke={color} strokeWidth="3" strokeLinecap="round" />
      {[34, 64, 94, 124, 154, 178].map((x) => (
        <line key={x} x1={x} y1={FLOOR + 8} x2={x - 10} y2={FLOOR + 16} stroke={color} strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      ))}
    </g>
  );
}

const base = (primary) => ({
  fill: 'none',
  stroke: primary,
  strokeWidth: 6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
});

// ---------- ĐẠP XE TRÊN KHÔNG (Bicycle Crunch) ----------
export function BicycleFigure({ primary = '#34d399', secondary = '#059669' }) {
  const s = base(primary);
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Floor color="#334155" />
      {/* thân nằm ngửa, đầu bên trái */}
      <circle cx="42" cy={FLOOR - 14} r="11" {...s} />
      <path d={`M53 ${FLOOR - 12} L108 ${FLOOR - 8}`} {...s} />
      {/* tay sau đầu */}
      <path d={`M58 ${FLOOR - 12} L50 ${FLOOR - 36} L40 ${FLOOR - 30}`} {...s} strokeWidth="5" />
      {/* chân phải duỗi chéo gần sàn */}
      <path d={`M108 ${FLOOR - 8} L150 ${FLOOR - 20} L178 ${FLOOR - 8}`} stroke={secondary} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* chân trái co kéo gối về phía khuỷu tay */}
      <path d={`M108 ${FLOOR - 8} L122 ${FLOOR - 48} L100 ${FLOOR - 56}`} {...s} />
      {/* khuỷu tay phải chạm gối trái */}
      <path d={`M60 ${FLOOR - 12} L86 ${FLOOR - 40} L100 ${FLOOR - 52}`} {...s} strokeWidth="5" />
      {/* mũi tên xoáy — chuyển động chéo */}
      <path d="M132 40 A20 20 0 1 1 112 60" stroke={secondary} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M112 60 l-8 -3 m8 3 l2 -9" stroke={secondary} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ---------- ĐẠP XE NẰM NGỬA (Supine Cycling) ----------
function PedalingLegs({ dir = 1, primary, secondary }) {
  // hai chân quay tròn quanh khớp hông (112, FLOOR-10)
  const a = 0.9 * dir;
  const b = -0.35 * dir;
  const hipX = 112, hipY = FLOOR - 10;
  const kneeOf = (ang) => ({ x: hipX + Math.cos(ang) * 26, y: hipY + Math.sin(ang) * 26 - 14 });
  const k1 = kneeOf(a), k2 = kneeOf(b);
  const f1 = { x: k1.x + 24, y: k1.y + 22 };
  const f2 = { x: k2.x + 26, y: k2.y + 10 };
  return (
    <g>
      <path d={`M${hipX} ${hipY} L${k1.x} ${k1.y} L${f1.x} ${f1.y}`} stroke={primary} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${hipX} ${hipY} L${k2.x} ${k2.y} L${f2.x} ${f2.y}`} stroke={secondary} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* vòng quay bàn đạp */}
      <circle cx="152" cy={FLOOR - 34} r="24" stroke="#475569" strokeWidth="2" strokeDasharray="4 6" fill="none" />
      <path d={dir > 0
        ? `M152 ${FLOOR - 62} A28 28 0 0 1 176 ${FLOOR - 40}`
        : `M176 ${FLOOR - 28} A28 28 0 0 1 152 ${FLOOR - 6}`}
        stroke={secondary} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d={dir > 0 ? 'M176 142 l-2 -9 m2 9 l-9 -2' : 'M152 176 l9 2 m-9 -2 l2 9'}
        stroke={secondary} strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function SupineFigure({ primary = '#34d399', secondary = '#059669' }) {
  const s = base(primary);
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Floor color="#334155" />
      <circle cx="42" cy={FLOOR - 14} r="11" {...s} />
      <path d={`M53 ${FLOOR - 12} L112 ${FLOOR - 10}`} {...s} />
      {/* hai tay lót dưới hông */}
      <path d={`M62 ${FLOOR - 12} L84 ${FLOOR - 4} L104 ${FLOOR - 4}`} {...s} strokeWidth="5" />
      <PedalingLegs dir={1} primary={primary} secondary={secondary} />
    </svg>
  );
}

// ---------- ĐẠP XE NGƯỢC (Reverse Cycling) ----------
export function ReverseFigure({ primary = '#34d399', secondary = '#059669' }) {
  const s = base(primary);
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Floor color="#334155" />
      <circle cx="42" cy={FLOOR - 14} r="11" {...s} />
      <path d={`M53 ${FLOOR - 12} L112 ${FLOOR - 10}`} {...s} />
      <path d={`M62 ${FLOOR - 12} L84 ${FLOOR - 4} L104 ${FLOOR - 4}`} {...s} strokeWidth="5" />
      <PedalingLegs dir={-1} primary={primary} secondary={secondary} />
    </svg>
  );
}

// ---------- PLANK ----------
export function PlankFigure({ primary = '#34d399', secondary = '#059669' }) {
  const s = base(primary);
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Floor color="#334155" />
      {/* cơ thể thẳng từ đầu đến gót — trụ khuỷu tay */}
      <circle cx="48" cy={FLOOR - 48} r="11" {...s} />
      <path d={`M58 ${FLOOR - 44} L150 ${FLOOR - 12}`} {...s} />
      <path d={`M60 ${FLOOR - 42} L56 ${FLOOR - 22} L48 ${FLOOR - 20}`} {...s} strokeWidth="5" />
      <path d={`M150 ${FLOOR - 12} L170 ${FLOOR - 6} L178 ${FLOOR}`} {...s} />
      {/* vệt sáng báo hiệu siết core */}
      <path d={`M80 ${FLOOR - 46} L130 ${FLOOR - 32}`} stroke={secondary} strokeWidth="2.5" strokeDasharray="3 5" fill="none" strokeLinecap="round" />
      <text x="105" y="42" textAnchor="middle" fontSize="11" fill="#94a3b8" fontStyle="italic">Giữ thẳng · siết bụng</text>
    </svg>
  );
}

// ---------- BIRD-DOG ----------
export function BirdDogFigure({ primary = '#34d399', secondary = '#059669' }) {
  const s = base(primary);
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Floor color="#334155" />
      {/* chống bốn chân */}
      <circle cx="58" cy={FLOOR - 52} r="10" {...s} />
      <path d={`M66 ${FLOOR - 48} L122 ${FLOOR - 44}`} {...s} />
      {/* tay trái trụ */}
      <path d={`M66 ${FLOOR - 46} L60 ${FLOOR}`} {...s} strokeWidth="5" />
      {/* tay phải duỗi thẳng về trước */}
      <path d={`M68 ${FLOOR - 48} L22 ${FLOOR - 58}`} stroke={secondary} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* chân trái trụ */}
      <path d={`M122 ${FLOOR - 44} L128 ${FLOOR}`} {...s} strokeWidth="5" />
      {/* chân phải duỗi thẳng ra sau */}
      <path d={`M122 ${FLOOR - 44} L172 ${FLOOR - 56}`} stroke={secondary} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M22 118 l10 -4 m-10 4 l3 10" stroke={secondary} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M172 122 l-10 -5 m10 5 l-2 10" stroke={secondary} strokeWidth="3" fill="none" strokeLinecap="round" />
      <text x="100" y="36" textAnchor="middle" fontSize="11" fill="#94a3b8" fontStyle="italic">Duỗi chéo tay – chân đối diện</text>
    </svg>
  );
}

// ---------- DEAD BUG ----------
export function DeadBugFigure({ primary = '#34d399', secondary = '#059669' }) {
  const s = base(primary);
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Floor color="#334155" />
      {/* nhìn nghiêng: nằm ngửa, lưng áp sàn */}
      <circle cx="44" cy={FLOOR - 14} r="11" {...s} />
      <path d={`M55 ${FLOOR - 12} L110 ${FLOOR - 10}`} {...s} />
      {/* tay phải giữ thẳng đứng, tay trái duỗi xa */}
      <path d={`M60 ${FLOOR - 14} L64 ${FLOOR - 62}`} {...s} strokeWidth="5" />
      <path d={`M60 ${FLOOR - 14} L26 ${FLOOR - 46}`} stroke={secondary} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* chân trái co 90 độ trên khớp hông, chân phải duỗi xa */}
      <path d={`M110 ${FLOOR - 10} L116 ${FLOOR - 58} L142 ${FLOOR - 58}`} {...s} />
      <path d={`M110 ${FLOOR - 10} L158 ${FLOOR - 26}`} stroke={secondary} strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* mũi tên duỗi */}
      <path d="M168 46 l-12 6 m12 -6 l-2 12" stroke={secondary} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M14 128 l12 8 m-12 -8 l13 -3" stroke={secondary} strokeWidth="3" fill="none" strokeLinecap="round" />
      <text x="120" y="34" textAnchor="middle" fontSize="11" fill="#94a3b8" fontStyle="italic">Lưng luôn áp sát sàn</text>
    </svg>
  );
}

// ---------- CAT-COW ----------
export function CatCowFigure({ primary = '#34d399', secondary = '#059669' }) {
  const s = base(primary);
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Floor color="#334155" />
      {/* tư thế mèo: lưng cong lên */}
      <circle cx="50" cy={FLOOR - 46} r="10" {...s} />
      <path d={`M58 ${FLOOR - 44} Q94 ${FLOOR - 78} 130 ${FLOOR - 42}`} {...s} />
      <path d={`M60 ${FLOOR - 42} L56 ${FLOOR}`} {...s} strokeWidth="5" />
      <path d={`M128 ${FLOOR - 42} L134 ${FLOOR}`} {...s} strokeWidth="5" />
      <path d={`M66 ${FLOOR - 42} L64 ${FLOOR}`} stroke={secondary} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d={`M122 ${FLOOR - 42} L126 ${FLOOR}`} stroke={secondary} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* mũi tên: thóp lưng lên / ưỡn xuống */}
      <path d="M94 92 v-22 m0 22 l-7 -8 m7 8 l7 -8" stroke={primary} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M94 158 v18 m0 -18 l-7 8 m7 -8 l7 8" stroke={secondary} strokeWidth="3" fill="none" strokeLinecap="round" />
      <text x="94" y="52" textAnchor="middle" fontSize="11" fill="#34d399" fontWeight="bold">🐱 Mèo</text>
      <text x="150" y="52" textAnchor="middle" fontSize="11" fill="#94a3b8">🐄 Bò</text>
    </svg>
  );
}

// ---------- MOUNTAIN CLIMBERS ----------
export function ClimberFigure({ primary = '#34d399', secondary = '#059669' }) {
  const s = base(primary);
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Floor color="#334155" />
      {/* tư thế chống đẩy cao, thân dốc */}
      <circle cx="150" cy={FLOOR - 66} r="10" {...s} />
      <path d={`M142 ${FLOOR - 60} L92 ${FLOOR - 34}`} {...s} />
      {/* hai tay chống sàn */}
      <path d={`M146 ${FLOOR - 58} L152 ${FLOOR}`} {...s} strokeWidth="5" />
      <path d={`M140 ${FLOOR - 54} L144 ${FLOOR}`} stroke={secondary} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* chân trái kéo gối về ngực */}
      <path d={`M92 ${FLOOR - 34} L70 ${FLOOR - 52} L96 ${FLOOR - 44}`} {...s} />
      {/* chân phải duỗi sau */}
      <path d={`M92 ${FLOOR - 34} L46 ${FLOOR - 14} L30 ${FLOOR - 6}`} stroke={secondary} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* mũi tên đổi chân */}
      <path d="M52 108 q14 -14 30 -6 m-30 6 l2 -12 m-2 12 l12 3" stroke={secondary} strokeWidth="3" fill="none" strokeLinecap="round" />
      <text x="100" y="36" textAnchor="middle" fontSize="11" fill="#94a3b8" fontStyle="italic">Kéo gối luân phiên nhanh</text>
    </svg>
  );
}

// ---------- STANDING CROSS CRUNCH ----------
export function StandingFigure({ primary = '#34d399', secondary = '#059669' }) {
  const s = base(primary);
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Floor color="#334155" />
      {/* đứng thẳng, tay sau đầu */}
      <circle cx="96" cy="46" r="12" {...s} />
      <path d={`M98 58 L100 108`} {...s} />
      <path d={`M98 64 L76 50 L82 40 M98 64 L118 52 L112 42`} {...s} strokeWidth="5" />
      {/* chân phải trụ */}
      <path d={`M100 108 L104 144 L106 ${FLOOR}`} {...s} />
      {/* chân trái co gối nâng cao chéo sang phải */}
      <path d={`M100 108 L132 118 L118 148`} stroke={secondary} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* thân gập nhẹ, khuỷu tay phải tiến gần gối trái */}
      <path d={`M98 66 L108 84 L126 108`} stroke={primary} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <path d="M140 96 l-8 8 m8 -8 l-11 -1" stroke={secondary} strokeWidth="3" fill="none" strokeLinecap="round" />
      <text x="52" y="150" textAnchor="middle" fontSize="11" fill="#94a3b8" fontStyle="italic">Khuỷu chạm</text>
      <text x="52" y="164" textAnchor="middle" fontSize="11" fill="#94a3b8" fontStyle="italic">đối gối</text>
    </svg>
  );
}

// ---------- SQUAT ----------
export function SquatFigure({ primary = '#34d399', secondary = '#059669' }) {
  const s = base(primary);
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Floor color="#334155" />
      {/* bóng mờ tư thế đứng */}
      <g opacity="0.28">
        <circle cx="146" cy="52" r="11" stroke={secondary} strokeWidth="5" fill="none" />
        <path d={`M146 63 L146 110 M146 110 L142 144 L142 ${FLOOR} M146 110 L152 144 L152 ${FLOOR} M146 74 L136 96`}
          stroke={secondary} strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
      {/* người ở tư thế squat sâu */}
      <circle cx="86" cy="86" r="12" {...s} />
      <path d={`M92 96 L110 126`} {...s} />
      {/* hai tay duỗi song song sàn */}
      <path d={`M96 102 L62 96`} {...s} strokeWidth="5" />
      {/* đùi gần song song sàn, lưng thẳng */}
      <path d={`M110 126 L76 130 L78 ${FLOOR}`} {...s} />
      <path d={`M110 126 L82 138 L88 ${FLOOR}`} stroke={secondary} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* mũi tên hạ / đứng */}
      <path d="M118 60 q-18 6 -22 20 m22 -20 l-1 11 m1 -11 l11 3" stroke={secondary} strokeWidth="3" fill="none" strokeLinecap="round" />
      <text x="150" y="150" textAnchor="middle" fontSize="11" fill="#94a3b8" fontStyle="italic">Ngồi như ghế</text>
      <text x="150" y="164" textAnchor="middle" fontSize="11" fill="#94a3b8" fontStyle="italic">lưng thẳng</text>
    </svg>
  );
}

// ---------- GLUTE BRIDGE ----------
export function GluteBridgeFigure({ primary = '#34d399', secondary = '#059669' }) {
  const s = base(primary);
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Floor color="#334155" />
      {/* bóng mờ tư thế hạ */}
      <g opacity="0.28">
        <path d={`M52 ${FLOOR - 12} L104 ${FLOOR - 8} M104 ${FLOOR - 8} L126 ${FLOOR - 40} L140 ${FLOOR - 4}`}
          stroke={secondary} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* người nâng hông cao — thân tạo đường thẳng vai–hông */}
      <circle cx="40" cy={FLOOR - 14} r="11" {...s} />
      <path d={`M51 ${FLOOR - 12} L78 ${FLOOR - 14}`} {...s} />
      <path d={`M78 ${FLOOR - 14} L108 ${FLOOR - 44}`} {...s} />
      <path d={`M108 ${FLOOR - 44} L126 ${FLOOR - 40} L130 ${FLOOR}`} {...s} />
      {/* tay chống sàn */}
      <path d={`M58 ${FLOOR - 12} L62 ${FLOOR - 2}`} {...s} strokeWidth="5" />
      {/* mũi tên nâng hông */}
      <path d="M96 108 v-24 m0 24 l-7 8 m7 -8 l7 8" stroke={secondary} strokeWidth="3" fill="none" strokeLinecap="round" transform="rotate(180 96 96)" />
      <text x="96" y="70" textAnchor="middle" fontSize="11" fill="#94a3b8" fontStyle="italic">Nâng hông · siết mông</text>
    </svg>
  );
}
