import { useEffect } from "react";
import { useExerciseStore } from "../../stores/useExerciseStore";
import { useKarateStore } from "../../stores/useKarateStore";
import { useSpineBarStore } from "../../stores/useSpineBarStore";
import { useTimerStore } from "../../stores/useTimerStore";

const POLL_INTERVAL_MS = 3 * 60 * 1000;
const VISIBILITY_DEBOUNCE_MS = 500;

export function Prefetcher() {
  useEffect(() => {
    let visibilityTimeout = null;
    let lastVisibilityRefresh = 0;

    const warm = () =>
      Promise.allSettled([
        useExerciseStore.getState().initFromSanity?.(),
        useKarateStore.getState().initFromSanity?.(),
        useSpineBarStore.getState().initFromSanity?.(),
      ]);

    const force = () => {
      // ⚡ FIX: Không force refresh khi user đang workout
      const timer = useTimerStore.getState();
      const timerActive =
        timer.phase !== "idle" && timer.phase !== "completed";
      if (timerActive) {
        if (import.meta.env.DEV) {
          console.debug(
            "[Prefetcher] Skip force refresh — timer active:",
            timer.phase,
            "set", timer.currentSet + "/" + timer.totalSets
          );
        }
        return Promise.resolve([]);
      }

      return Promise.allSettled([
        useExerciseStore.getState().initFromSanity?.({ force: true }),
        useKarateStore.getState().initFromSanity?.({ force: true }),
        useSpineBarStore.getState().initFromSanity?.({ force: true }),
      ]);
    };

    const idle =
      typeof window !== "undefined" && "requestIdleCallback" in window
        ? window.requestIdleCallback
        : (cb) => setTimeout(cb, 2000);

    const idleId = idle(() => warm());

    const intervalId = setInterval(() => {
      if (document.visibilityState === "visible") {
        const now = Date.now();
        if (now - lastVisibilityRefresh > 30 * 1000) {
          force();
          lastVisibilityRefresh = now;
        }
      }
    }, POLL_INTERVAL_MS);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        if (visibilityTimeout) clearTimeout(visibilityTimeout);
        visibilityTimeout = setTimeout(() => {
          const now = Date.now();
          if (now - lastVisibilityRefresh > 30 * 1000) {
            force();
            lastVisibilityRefresh = now;
          }
        }, VISIBILITY_DEBOUNCE_MS);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (typeof window !== "undefined" && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      clearInterval(intervalId);
      if (visibilityTimeout) clearTimeout(visibilityTimeout);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return null;
}