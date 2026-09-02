import { useRef, useEffect, useState } from 'react';
import { useCycleAnimation } from '../../hooks/useCycleAnimation';

export default function CanvasSimulator({ exercise, isRunning, onRepChange }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleResize = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (width === 0 || height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    setSize({ width, height });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    handleResize();
  }, []);

  useCycleAnimation(canvasRef, exercise, isRunning, size, onRepChange);

  return (
    <div 
      ref={containerRef} 
      className="w-full max-w-[320px] mx-auto aspect-square flex items-center justify-center"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
      />
    </div>
  );
}