"use client";

import { useEffect } from "react";

/**
 * Freezes the page behind an open overlay. Padding compensates for the removed
 * scrollbar so the layout does not jump sideways as the drawer opens.
 */
export function useLockScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const { body, documentElement } = document;
    const gap = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;

    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [locked]);
}
