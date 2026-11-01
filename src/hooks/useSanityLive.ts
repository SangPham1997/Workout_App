import { useEffect } from "react";
import { freshClient } from "../lib/sanity.client";

export function useSanityLive(
  query: string,
  onUpdate: () => void,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;
    const subscription = freshClient
      .listen(query, {}, { visibility: "query" })
      .subscribe({
        next: () => onUpdate(),
        error: (err) => console.warn("[useSanityLive]", err.message),
      });
    return () => subscription.unsubscribe();
  }, [query, enabled, onUpdate]);
}