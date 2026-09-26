import { useEffect, useMemo, useRef, useState } from 'react';
import { figureRegistry } from './figureRegistry';

/*
  SvgSimulator — thay thế hoàn toàn CanvasSimulator.
  - Vẽ hình SVG theo exercise.svg (dễ hình dung tư thế chuẩn), không dùng canvas.
  - Khi isRunning: hiệu ứng "nhịp thở" + vòng quay progress bằng CSS animation.
  - Giữ nguyên API props: { exercise, isRunning, onRepChange }.
*/

const CYCLE_SECONDS = { climber: 4.2, catcow: 9, plank: 21 }; // nhịp 1 rep
const CYCLIC_TYPES = ['bicycle', 'supine', 'reverse', 'climber', 'standing'];
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
  const hasCycle = useMemo(() => CYCLIC_TYPES.includes(type), [type]);
  const cycleSeconds = CYCLE_SECONDS[type] ?? DEFAULT_CYCLE;
  const Figure = figureRegistry[exercise?.svg || type];

  // Đếm rep theo nhịp khi đang chạy (deps là giá trị nguyên/thuỷ — ổn định hơn object).
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

  return (
    <div className="relative w-full max-w-[340px] mx-auto aspect-square flex items-center justify-center select-none">
      {/* vòng progress trang trí khi đang chạy */}
      <div
        className={`absolute inset-2 rounded-full border-2 border-dashed border-emerald-500/30 ${isRunning ? 'animate-spin-slow' : ''}`}
        style={{ animationDuration: `${cycleSeconds}s` }}
      />
      <div className={`w-full h-full ${isRunning ? 'animate-breathe' : ''}`}>
        <Figure />
      </div>

      {isRunning && hasCycle && (
        <span className="absolute bottom-1 right-2 text-xs font-bold text-emerald-400 bg-slate-800/80 border border-emerald-500/30 rounded-full px-2.5 py-0.5">
          {rep} rep
        </span>
      )}
      {isRunning && !hasCycle && (
        <span className="absolute bottom-1 right-2 text-xs font-bold text-amber-400 bg-slate-800/80 border border-amber-500/30 rounded-full px-2.5 py-0.5">
          Giữ tư thế
        </span>
      )}
    </div>
  );
}
