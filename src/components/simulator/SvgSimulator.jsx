import { useEffect, useMemo, useRef, useState } from 'react';
import { figureRegistry } from './figureRegistry';

/*
  SvgSimulator — thay thế hoàn toàn CanvasSimulator.
  - Vẽ hình SVG theo exercise.svg (dễ hình dung tư thế chuẩn), không dùng canvas.
  - Khi isRunning: hiệu ứng "nhịp thở" + vòng quay progress bằng CSS animation.
  - Giữ nguyên API props: { exercise, isRunning, onRepChange }.
  
  Cách xác định chu kỳ:
    1. Tra theo `svg` (chính xác nhất — vì 4 bài Pilates dùng chung type nhưng khác nhịp).
    2. Fallback về `type` (cho các bài truyền thống).
    3. Fallback cuối cùng: DEFAULT_CYCLE.
*/

// Thời gian 1 rep (giây) — tra theo `svg` trước, sau đó tới `type`
const CYCLE_SECONDS = {
  // ===== Nhóm bụng =====
  bicycle: 4.2,
  supine: 4.2,
  reverse: 4.2,
  plank: 21,

  // ===== Nhóm lưng & cột sống (Pilates) =====
  swan: 6,               // nâng ngực lên – hạ xuống
  swimming: 5,           // đổi tay/chân luân phiên
  'spine-stretch': 6,    // cuộn người về trước – ngồi lại
  'roll-down': 7,        // cuộn cột sống xuống – đứng lại

  // ===== Nhóm toàn thân =====
  birddog: 5,
  deadbug: 5,
  catcow: 9,
  climber: 4.2,
  standing: 4,
  squat: 5,
  'glute-bridge': 5,
};

// Những type có chuyển động tuần hoàn (đếm rep theo nhịp)
// Đã bổ sung 'birddog' và 'catcow' — vì chúng vốn có nhịp điệu đều.
const CYCLIC_TYPES = [
  'bicycle',
  'supine',
  'reverse',
  'climber',
  'standing',
  'birddog',
  'catcow',
];

const DEFAULT_CYCLE = 7;

export default function SvgSimulator({ exercise, isRunning, onRepChange }) {
  const [rep, setRep] = useState(0);
  const onRepChangeRef = useRef(onRepChange);

  useEffect(() => {
    onRepChangeRef.current = onRepChange;
  }, [onRepChange]);

  // Reset rep khi đổi bài (đồng bộ theo render — tránh cascading render)
  const exerciseId = exercise?.id;
  const prevExerciseIdRef = useRef(exerciseId);
  if (prevExerciseIdRef.current !== exerciseId) {
    prevExerciseIdRef.current = exerciseId;
    setRep(0);
  }

  // Giá trị dẫn xuất — memo để tránh tính lại mỗi lần re-render.
  const type = exercise?.type;
  const svgKey = exercise?.svg;
  const hasCycle = useMemo(() => CYCLIC_TYPES.includes(type), [type]);

  // Tra cycle theo svg trước, fallback về type, rồi DEFAULT_CYCLE
  const cycleSeconds = useMemo(
    () => CYCLE_SECONDS[svgKey] ?? CYCLE_SECONDS[type] ?? DEFAULT_CYCLE,
    [svgKey, type]
  );

  const Figure = figureRegistry[svgKey || type];

  // Đếm rep theo nhịp khi đang chạy
  useEffect(() => {
    onRepChangeRef.current?.(rep);
  }, [rep]);

  useEffect(() => {
    if (!isRunning || !hasCycle) return;
    const id = setInterval(() => {
      setRep((c) => c + 1);
    }, cycleSeconds * 1000);
    return () => clearInterval(id);
  }, [isRunning, hasCycle, cycleSeconds, exerciseId]);

  if (!Figure) {
    return <div className="text-slate-400 text-sm py-16">Đang tải...</div>;
  }

  // Bài giữ tĩnh không đếm rep — hiển thị nhãn "Giữ tư thế"
  const isStatic = !hasCycle;

  return (
    <div className="relative w-full max-w-[340px] mx-auto aspect-square flex items-center justify-center select-none">
      {/* vòng progress trang trí khi đang chạy */}
      <div
        className={`absolute inset-2 rounded-full border-2 border-dashed ${
          isRunning
            ? isStatic
              ? 'border-amber-500/40 animate-spin-slow'
              : 'border-emerald-500/30 animate-spin-slow'
            : 'border-slate-700/40'
        }`}
        style={{ animationDuration: `${cycleSeconds}s` }}
      />

      {/* Hình SVG với hiệu ứng nhịp thở khi chạy */}
      <div
        className={`w-full h-full ${
          isRunning
            ? isStatic
              ? 'animate-pulse-soft'
              : 'animate-breathe'
            : ''
        }`}
      >
        <Figure />
      </div>

      {/* Badge đếm rep */}
      {isRunning && !isStatic && (
        <span className="absolute bottom-1 right-2 text-xs font-bold text-emerald-400 bg-slate-800/80 border border-emerald-500/30 rounded-full px-2.5 py-0.5 shadow-md">
          <i className="fa-solid fa-repeat mr-1"></i>
          {rep} rep
        </span>
      )}

      {/* Badge giữ tư thế */}
      {isRunning && isStatic && (
        <span className="absolute bottom-1 right-2 text-xs font-bold text-amber-400 bg-slate-800/80 border border-amber-500/30 rounded-full px-2.5 py-0.5 shadow-md">
          <i className="fa-solid fa-hourglass-half mr-1"></i>
          Giữ tư thế
        </span>
      )}

      {/* Nhãn nhỏ ở góc trên khi chưa chạy — gợi ý số rep mục tiêu */}
      {!isRunning && !isStatic && exercise?.reps && (
        <span className="absolute top-2 right-2 text-[10px] font-bold text-slate-400 bg-slate-800/60 border border-slate-700/50 rounded-full px-2 py-0.5">
          Mục tiêu: {exercise.reps} rep
        </span>
      )}
    </div>
  );
}