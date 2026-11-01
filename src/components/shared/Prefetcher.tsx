import { useEffect } from "react";
import { sanityClient } from "../../lib/sanity.client";
import { cachedFetch } from "../../lib/sanityCache";
import { EXERCISES_QUERY } from "../../lib/queries/exercises";
import { KARATE_SESSIONS_QUERY } from "../../lib/queries/karate";
import { SPINE_PROGRAM_QUERY } from "../../lib/queries/programs";

/**
 * Prefetch data sau khi app idle → navigate tới page nào cũng instant.
 * Dùng requestIdleCallback với fallback setTimeout cho Safari.
 */
export function Prefetcher() {
  useEffect(() => {
    const prefetch = () => {
      // Fire-and-forget, lỗi không quan trọng (đã có cache layer handle)
      cachedFetch(sanityClient, EXERCISES_QUERY).catch(() => {});
      cachedFetch(sanityClient, KARATE_SESSIONS_QUERY).catch(() => {});
      cachedFetch(sanityClient, SPINE_PROGRAM_QUERY).catch(() => {});
    };

    const idle =
      typeof window !== "undefined" && "requestIdleCallback" in window
        ? window.requestIdleCallback
        : (cb) => setTimeout(cb, 2000);

    const id = idle(prefetch);
    return () => {
      if (typeof window !== "undefined" && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(id);
      }
    };
  }, []);

  return null;
}