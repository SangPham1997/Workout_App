import { useState, useRef, useEffect, useCallback } from 'react';

export function useTimer(initialDuration, onFinish) {
  const [timeLeft, setTimeLeft] = useState(initialDuration || 30);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          if (onFinish) onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [isRunning, onFinish]);

  const pause = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  }, []);

  const reset = useCallback((newDuration) => {
    pause();
    setTimeLeft(newDuration || initialDuration || 30);
  }, [initialDuration, pause]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return { timeLeft, isRunning, start, pause, reset };
}