import { useEffect } from "react";
import { useExerciseStore } from "../../stores/useExerciseStore";
import { useKarateStore } from "../../stores/useKarateStore";
import { useSpineBarStore } from "../../stores/useSpineBarStore";

const POLL_INTERVAL_MS = 3 * 60 * 1000; // 3 phút
const VISIBILITY_DEBOUNCE_MS = 500; // Debounce 500ms

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

    const force = () =>
      Promise.allSettled([
        useExerciseStore.getState().initFromSanity?.({ force: true }),
        useKarateStore.getState().initFromSanity?.({ force: true }),
        useSpineBarStore.getState().initFromSanity?.({ force: true }),
      ]);

    const idle =
      typeof window !== "undefined" && "requestIdleCallback" in window
        ? window.requestIdleCallback
        : (cb) => setTimeout(cb, 2000);

    const idleId = idle(() => warm());

    // Polling chỉ chạy khi tab visible
    const intervalId = setInterval(() => {
      if (document.visibilityState === "visible") {
        const now = Date.now();
        // Chỉ refresh nếu > 30s từ lần cuối (tránh spam khi vừa quay lại tab)
        if (now - lastVisibilityRefresh > 30 * 1000) {
          force();
          lastVisibilityRefresh = now;
        }
      }
    }, POLL_INTERVAL_MS);

    // Debounce visibility change
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        if (visibilityTimeout) clearTimeout(visibilityTimeout);
        visibilityTimeout = setTimeout(() => {
          const now = Date.now();
          // Chỉ refresh nếu > 30s từ lần cuối
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