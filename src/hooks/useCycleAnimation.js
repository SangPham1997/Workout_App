import { useEffect, useRef } from 'react';

export function useCycleAnimation(canvasRef, exercise, isRunning, size, onRepChange) {
  const angleRef = useRef(0);
  const frameRef = useRef(null);
  const exerciseRef = useRef(exercise);
  const isRunningRef = useRef(isRunning);
  const sizeRef = useRef(size);
  const onRepChangeRef = useRef(onRepChange); // lưu callback

  const repCountRef = useRef(0);
  const prevAngleRef = useRef(0);

  // Cập nhật refs khi props thay đổi
  useEffect(() => {
    exerciseRef.current = exercise;
    isRunningRef.current = isRunning;
    sizeRef.current = size;
    onRepChangeRef.current = onRepChange;
  }, [exercise, isRunning, size, onRepChange]);

  // Reset rep và góc khi đổi bài (chỉ phụ thuộc vào exercise)
  useEffect(() => {
    angleRef.current = 0;
    prevAngleRef.current = 0;
    repCountRef.current = 0;
    if (onRepChangeRef.current) onRepChangeRef.current(0);
  }, [exercise]);

  // === Hàm lấy tốc độ theo từng bài ===
  const getSpeed = (type) => {
    const baseSpeed = 0.15;
    switch (type) {
      case 'climber': return baseSpeed * 1.5;
      case 'catcow': return baseSpeed * 0.7;
      case 'plank': return baseSpeed * 0.3;
      default: return baseSpeed;
    }
  };

  // === Các hàm vẽ stickman (cơ bản) ===
  const drawStickmanLine = (ctx, x1, y1, x2, y2, color, width) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const drawCircle = (ctx, x, y, r, color, fill = false) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    if (fill) {
      ctx.fillStyle = color;
      ctx.fill();
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  };

  // === Các hàm vẽ động tác cụ thể ===
  const drawLyingCycling = (ctx, w, h, type, c1, c2, angle) => {
    const cx = w / 2;
    const cy = h - 60;
    drawCircle(ctx, cx - 80, cy - 10, 12, c1);
    drawStickmanLine(ctx, cx - 68, cy - 5, cx, cy, c1, 4);
    if (type === 'bicycle') {
      drawStickmanLine(ctx, cx - 50, cy - 5, cx - 70, cy - 15, c1, 3);
    } else {
      drawStickmanLine(ctx, cx - 20, cy, cx - 10, cy + 10, c1, 3);
    }
    const dir = type === 'reverse' ? -1 : 1;
    const radius = 35;
    const pedal1X = cx + Math.cos(angle * dir) * radius;
    const pedal1Y = (cy - 40) + Math.sin(angle * dir) * radius;
    const pedal2X = cx + Math.cos(angle * dir + Math.PI) * radius;
    const pedal2Y = (cy - 40) + Math.sin(angle * dir + Math.PI) * radius;
    const getKnee = (footX, footY) => {
      const midX = (cx + footX) / 2;
      const midY = (cy + footY) / 2;
      return { x: midX + 10, y: midY - 20 };
    };
    const k2 = getKnee(pedal2X, pedal2Y);
    drawStickmanLine(ctx, cx, cy, k2.x, k2.y, c2, 4);
    drawStickmanLine(ctx, k2.x, k2.y, pedal2X, pedal2Y, c2, 4);
    const k1 = getKnee(pedal1X, pedal1Y);
    drawStickmanLine(ctx, cx, cy, k1.x, k1.y, c1, 4);
    drawStickmanLine(ctx, k1.x, k1.y, pedal1X, pedal1Y, c1, 4);
  };

  const drawMountainClimber = (ctx, w, h, c1, c2, angle) => {
    const floorY = h - 40;
    const handX = w / 2 + 60;
    const hipX = w / 2 - 40;
    const hipY = floorY - 60;
    drawStickmanLine(ctx, handX, floorY, handX - 20, hipY - 20, c1, 4);
    drawCircle(ctx, handX - 10, hipY - 40, 12, c1);
    drawStickmanLine(ctx, handX - 20, hipY - 20, hipX, hipY, c1, 4);
    const offset = Math.sin(angle * 2) * 30;
    const backFootX = hipX - 50 - offset;
    drawStickmanLine(ctx, hipX, hipY, hipX - 20, hipY + 30, c2, 4);
    drawStickmanLine(ctx, hipX - 20, hipY + 30, backFootX, floorY, c2, 4);
    const frontFootX = hipX - 10 + offset;
    const frontKneeY = hipY + 10;
    drawStickmanLine(ctx, hipX, hipY, frontFootX + 10, frontKneeY, c1, 4);
    drawStickmanLine(ctx, frontFootX + 10, frontKneeY, frontFootX, floorY - 10, c1, 4);
  };

  const drawStandingCrunch = (ctx, w, h, c1, c2, angle) => {
    const cx = w / 2;
    const floorY = h - 40;
    const hipY = floorY - 90;
    const crunchAmt = Math.abs(Math.sin(angle)) * 15;
    drawStickmanLine(ctx, cx, hipY, cx + 5, floorY, c1, 4);
    const shoulderX = cx - 10 + crunchAmt;
    const shoulderY = hipY - 70 + crunchAmt;
    drawStickmanLine(ctx, cx, hipY, shoulderX, shoulderY, c1, 4);
    drawCircle(ctx, shoulderX, shoulderY - 15, 12, c1);
    drawStickmanLine(ctx, shoulderX, shoulderY + 10, shoulderX + 10, shoulderY - 10, c1, 3);
    const liftAmt = Math.abs(Math.sin(angle)) * 40;
    const kneeX = cx - 20;
    const kneeY = hipY - 10 - liftAmt;
    const footX = kneeX + 5;
    const footY = kneeY + 40;
    drawStickmanLine(ctx, cx, hipY, kneeX, kneeY, c2, 4);
    drawStickmanLine(ctx, kneeX, kneeY, footX, footY, c2, 4);
  };

  const drawPlank = (ctx, w, h, c1, angle) => {
    const floorY = h - 30;
    const cx = w / 2;
    const shake = Math.sin(angle * 8) * 1.5;
    const handY = floorY - 20 + shake;
    const footY = floorY - 10 + shake;
    const shoulderX = cx - 30;
    const shoulderY = floorY - 50 + shake;
    const hipX = cx;
    const hipY = floorY - 40 + shake;
    drawCircle(ctx, cx - 10, shoulderY - 15, 10, c1);
    drawStickmanLine(ctx, cx - 10, shoulderY - 5, cx, hipY, c1, 4);
    drawStickmanLine(ctx, shoulderX, shoulderY, shoulderX - 20, handY, c1, 4);
    drawStickmanLine(ctx, shoulderX + 20, shoulderY, shoulderX + 40, handY, c1, 4);
    drawStickmanLine(ctx, hipX, hipY, hipX - 20, footY, c1, 4);
    drawStickmanLine(ctx, hipX, hipY, hipX + 20, footY, c1, 4);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Plank - Giữ tư thế', w / 2, h - 10);
  };

  const drawBirdDog = (ctx, w, h, c1, angle) => {
    const floorY = h - 30;
    const cx = w / 2;
    const phase = Math.sin(angle);
    const extend = Math.abs(phase) * 30;
    const isLeft = phase > 0;
    const hipX = cx;
    const hipY = floorY - 50;
    const shoulderX = cx - 30;
    const shoulderY = floorY - 60;
    drawCircle(ctx, shoulderX - 15, shoulderY - 10, 10, c1);
    drawStickmanLine(ctx, shoulderX - 5, shoulderY, hipX, hipY, c1, 4);
    if (isLeft) {
      const armX = shoulderX + 20 + extend;
      const armY = shoulderY - 10 - extend * 0.3;
      drawStickmanLine(ctx, shoulderX + 5, shoulderY, armX, armY, c1, 4);
      const legX = hipX - 10 - extend;
      const legY = hipY + 10 + extend * 0.3;
      drawStickmanLine(ctx, hipX, hipY, legX, legY, c1, 4);
      drawStickmanLine(ctx, shoulderX - 5, shoulderY, shoulderX - 25, floorY - 20, c1, 4);
      drawStickmanLine(ctx, hipX, hipY, hipX + 15, floorY - 15, c1, 4);
    } else {
      const armX = shoulderX - 10 - extend;
      const armY = shoulderY - 10 - extend * 0.3;
      drawStickmanLine(ctx, shoulderX - 5, shoulderY, armX, armY, c1, 4);
      const legX = hipX + 10 + extend;
      const legY = hipY + 10 + extend * 0.3;
      drawStickmanLine(ctx, hipX, hipY, legX, legY, c1, 4);
      drawStickmanLine(ctx, shoulderX - 5, shoulderY, shoulderX + 20, floorY - 20, c1, 4);
      drawStickmanLine(ctx, hipX, hipY, hipX - 15, floorY - 15, c1, 4);
    }
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Bird-Dog - Duỗi chéo', w / 2, h - 10);
  };

  const drawDeadBug = (ctx, w, h, c1, c2, angle, name) => {
    const cx = w / 2;
    const cy = h / 2 + 20;
    const phase = Math.sin(angle * 1.2);
    const extend = Math.abs(phase);
    const side = Math.sign(phase);
    ctx.fillStyle = 'rgba(51, 65, 85, 0.3)';
    ctx.beginPath();
    ctx.ellipse(w/2, h - 30, w/2 - 30, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    const bodyColor = '#475569';
    const skinColor = '#34d399';
    drawCircle(ctx, cx - 10, cy - 65, 14, skinColor, true);
    drawCircle(ctx, cx - 10, cy - 65, 14, bodyColor, false);
    drawStickmanLine(ctx, cx - 8, cy - 52, cx, cy - 40, bodyColor, 3);
    drawStickmanLine(ctx, cx, cy - 40, cx, cy + 10, bodyColor, 5);
    drawCircle(ctx, cx, cy + 10, 6, bodyColor, true);
    const armExtend = 20 + extend * 35;
    if (side > 0) {
      drawStickmanLine(ctx, cx + 5, cy - 30, cx + 5 + armExtend, cy - 35 - extend * 10, c1, 4);
      drawCircle(ctx, cx + 5 + armExtend, cy - 35 - extend * 10, 5, c1, true);
    } else {
      drawStickmanLine(ctx, cx + 5, cy - 30, cx + 20, cy - 45, c2, 4);
      drawCircle(ctx, cx + 20, cy - 45, 5, c2, true);
    }
    if (side < 0) {
      drawStickmanLine(ctx, cx - 5, cy - 30, cx - 5 - armExtend, cy - 35 - extend * 10, c1, 4);
      drawCircle(ctx, cx - 5 - armExtend, cy - 35 - extend * 10, 5, c1, true);
    } else {
      drawStickmanLine(ctx, cx - 5, cy - 30, cx - 20, cy - 45, c2, 4);
      drawCircle(ctx, cx - 20, cy - 45, 5, c2, true);
    }
    const legExtend = 25 + extend * 40;
    if (side < 0) {
      drawStickmanLine(ctx, cx + 8, cy + 10, cx + 8 + legExtend * 0.7, cy + 30 + extend * 25, c1, 5);
      drawCircle(ctx, cx + 8 + legExtend * 0.7, cy + 30 + extend * 25, 6, c1, true);
    } else {
      drawStickmanLine(ctx, cx + 8, cy + 10, cx + 25, cy + 5, c2, 5);
      drawStickmanLine(ctx, cx + 25, cy + 5, cx + 30, cy - 15, c2, 4);
      drawCircle(ctx, cx + 30, cy - 15, 6, c2, true);
    }
    if (side > 0) {
      drawStickmanLine(ctx, cx - 8, cy + 10, cx - 8 - legExtend * 0.7, cy + 30 + extend * 25, c1, 5);
      drawCircle(ctx, cx - 8 - legExtend * 0.7, cy + 30 + extend * 25, 6, c1, true);
    } else {
      drawStickmanLine(ctx, cx - 8, cy + 10, cx - 25, cy + 5, c2, 5);
      drawStickmanLine(ctx, cx - 25, cy + 5, cx - 30, cy - 15, c2, 4);
      drawCircle(ctx, cx - 30, cy - 15, 6, c2, true);
    }
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    const status = Math.abs(phase) > 0.3 ? '🔄 Duỗi tay - chân đối diện' : '📐 Giữ tư thế trung tâm';
    ctx.fillText(status, cx, cy + 75);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('Giữ lưng áp sát sàn', cx, cy + 92);
  };

  const drawCatCow = (ctx, w, h, c1, angle) => {
    const floorY = h - 30;
    const cx = w / 2;
    const shoulderX = cx - 30;
    const shoulderY = floorY - 55;
    const hipX = cx + 5;
    const hipY = floorY - 50;
    const flex = Math.sin(angle) * 20;
    const isCat = flex < 0;
    drawCircle(ctx, shoulderX - 15, shoulderY - 5 + flex * 0.5, 12, c1);
    drawStickmanLine(ctx, shoulderX - 5, shoulderY + flex * 0.6, hipX, hipY - flex * 0.4, c1, 4);
    drawStickmanLine(ctx, shoulderX - 10, shoulderY + 10 + flex * 0.3, shoulderX - 20, floorY - 10, c1, 4);
    drawStickmanLine(ctx, shoulderX, shoulderY + 10 + flex * 0.3, shoulderX + 10, floorY - 10, c1, 4);
    drawStickmanLine(ctx, hipX - 5, hipY + 10 - flex * 0.3, hipX - 20, floorY - 10, c1, 4);
    drawStickmanLine(ctx, hipX + 5, hipY + 10 - flex * 0.3, hipX + 20, floorY - 10, c1, 4);
    const label = isCat ? '🐱 Mèo (Cong lưng)' : '🐄 Bò (Ưỡn lưng)';
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(label, w / 2, h - 10);
  };

  const drawSquat = (ctx, w, h, c1, angle) => {
    const floorY = h - 30;
    const cx = w / 2;
    const depth = Math.sin(angle) * 20 + 20;
    const headY = floorY - 120 + depth * 0.2;
    const shoulderY = headY + 20;
    const hipY = floorY - 60 + depth * 0.5;
    drawCircle(ctx, cx, headY, 14, c1);
    drawStickmanLine(ctx, cx, headY + 14, cx + 5, hipY, c1, 4);
    const kneeX = cx + 10;
    const kneeY = hipY + 20 + depth * 0.4;
    drawStickmanLine(ctx, cx + 5, hipY, kneeX, kneeY, c1, 4);
    drawStickmanLine(ctx, kneeX, kneeY, kneeX - 5, floorY - 5, c1, 4);
    const kneeX2 = cx - 10;
    const kneeY2 = hipY + 20 + depth * 0.4;
    drawStickmanLine(ctx, cx + 5, hipY, kneeX2, kneeY2, c1, 4);
    drawStickmanLine(ctx, kneeX2, kneeY2, kneeX2 + 5, floorY - 5, c1, 4);
    drawStickmanLine(ctx, cx - 5, shoulderY, cx - 30, shoulderY + 10 + depth * 0.2, c1, 4);
    drawStickmanLine(ctx, cx + 5, shoulderY, cx + 30, shoulderY + 10 + depth * 0.2, c1, 4);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Squat - Ngồi xổm', w / 2, h - 10);
  };

  const drawGluteBridge = (ctx, w, h, c1, angle) => {
    const floorY = h - 30;
    const cx = w / 2;
    const lift = (Math.sin(angle) + 1) * 20;
    const headX = cx - 30;
    const headY = floorY - 20;
    drawCircle(ctx, headX, headY, 12, c1);
    const shoulderX = cx - 5;
    const shoulderY = floorY - 15;
    const hipX = cx + 5;
    const hipY = floorY - 10 - lift * 0.6;
    drawStickmanLine(ctx, headX + 10, headY - 5, shoulderX, shoulderY, c1, 4);
    drawStickmanLine(ctx, shoulderX, shoulderY, hipX, hipY, c1, 4);
    const kneeX = hipX - 15;
    const kneeY = hipY + 30 - lift * 0.3;
    drawStickmanLine(ctx, hipX, hipY, kneeX, kneeY, c1, 4);
    drawStickmanLine(ctx, kneeX, kneeY, kneeX + 5, floorY - 5, c1, 4);
    const kneeX2 = hipX + 15;
    const kneeY2 = hipY + 30 - lift * 0.3;
    drawStickmanLine(ctx, hipX, hipY, kneeX2, kneeY2, c1, 4);
    drawStickmanLine(ctx, kneeX2, kneeY2, kneeX2 - 5, floorY - 5, c1, 4);
    drawStickmanLine(ctx, shoulderX - 5, shoulderY, shoulderX - 10, floorY - 10, c1, 4);
    drawStickmanLine(ctx, shoulderX + 5, shoulderY, shoulderX + 10, floorY - 10, c1, 4);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Glute Bridge - Nâng mông', w / 2, h - 10);
  };

  const drawStaticExercise = (ctx, w, h, name) => {
    const cx = w / 2;
    const cy = h / 2 + 20;
    const color = '#34d399';
    drawCircle(ctx, cx, cy - 60, 16, color, true);
    drawStickmanLine(ctx, cx, cy - 44, cx, cy - 10, color, 4);
    drawStickmanLine(ctx, cx, cy - 10, cx - 15, cy + 30, color, 4);
    drawStickmanLine(ctx, cx, cy - 10, cx + 15, cy + 30, color, 4);
    drawStickmanLine(ctx, cx, cy - 30, cx - 30, cy - 10, color, 4);
    drawStickmanLine(ctx, cx, cy - 30, cx + 30, cy - 10, color, 4);
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(name, cx, cy + 50);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('Giữ tư thế theo hướng dẫn', cx, cy + 72);
  };

  // === Vòng lặp vẽ chính ===
  const drawFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sizeData = sizeRef.current;
    if (!sizeData || !sizeData.width || !sizeData.height) {
      frameRef.current = requestAnimationFrame(drawFrame);
      return;
    }

    const { width: w, height: h } = sizeData;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);

    const currentExercise = exerciseRef.current;
    const running = isRunningRef.current;

    if (!currentExercise || !currentExercise.type) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Đang tải...', w / 2, h / 2);
      frameRef.current = requestAnimationFrame(drawFrame);
      return;
    }

    const speed = getSpeed(currentExercise.type);
    angleRef.current += speed;

    // --- Đếm rep: chỉ khi đang chạy và bài hiện tại thuộc nhóm có chuyển động ---
    const TWO_PI = Math.PI * 2;
    if (running && ['bicycle', 'supine', 'reverse', 'climber', 'standing'].includes(currentExercise.type)) {
      if (angleRef.current - prevAngleRef.current >= TWO_PI) {
        repCountRef.current += 1;
        if (onRepChangeRef.current) onRepChangeRef.current(repCountRef.current);
        prevAngleRef.current = angleRef.current;
      }
    }

    // Vẽ sàn
    const mainColor = '#34d399';
    const secColor = '#059669';
    const floorColor = '#334155';
    drawStickmanLine(ctx, 20, h - 40, w - 20, h - 40, floorColor, 2);

    // Gọi hàm vẽ theo type
    const type = currentExercise.type;
    switch (type) {
      case 'bicycle':
      case 'supine':
      case 'reverse':
        drawLyingCycling(ctx, w, h, type, mainColor, secColor, angleRef.current);
        break;
      case 'climber':
        drawMountainClimber(ctx, w, h, mainColor, secColor, angleRef.current);
        break;
      case 'standing':
        drawStandingCrunch(ctx, w, h, mainColor, secColor, angleRef.current);
        break;
      case 'plank':
        drawPlank(ctx, w, h, mainColor, angleRef.current);
        break;
      case 'birddog':
        drawBirdDog(ctx, w, h, mainColor, angleRef.current);
        break;
      case 'deadbug':
        drawDeadBug(ctx, w, h, mainColor, secColor, angleRef.current, currentExercise.name);
        break;
      case 'catcow':
        drawCatCow(ctx, w, h, mainColor, angleRef.current);
        break;
      case 'squat':
        drawSquat(ctx, w, h, mainColor, angleRef.current);
        break;
      case 'glute-bridge':
        drawGluteBridge(ctx, w, h, mainColor, angleRef.current);
        break;
      default:
        drawStaticExercise(ctx, w, h, currentExercise.name);
        break;
    }

    frameRef.current = requestAnimationFrame(drawFrame);
  };

  // === Điều khiển vòng lặp ===
  const startLoop = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    drawFrame();
  };

  const stopLoop = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  };

  useEffect(() => {
    startLoop();
    return stopLoop;
  }, []);

  return { startLoop, stopLoop };
}