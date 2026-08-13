"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** For JS-driven motion that cannot be expressed through gsap.matchMedia. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    // Reconcile with the live media query, then subscribe to future
    // changes — both happen in this effect deliberately. The lazy
    // initializer above is gated on `typeof window` so it stays SSR-safe,
    // which means on the server (and on the very first client render,
    // before this effect commits) `reduced` is always `false` regardless of
    // the real OS setting. Reading `window.matchMedia` during render instead
    // would throw on the server, so the correction has to happen here, in
    // the same place the "subscribe for updates from an external system"
    // half of this effect already has to live.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
