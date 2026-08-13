"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";
import { DUR } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait after the element hits the trigger point. */
  delay?: number;
  /** Distance in px the element travels up into place. */
  y?: number;
  className?: string;
};

/**
 * Fades and lifts its children in once they scroll into view.
 *
 * Children render normally in the HTML and are hidden by GSAP on mount, so
 * crawlers and no-JS visitors still get the content.
 */
export function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(motionOK, () => {
        gsap.from(root.current, {
          y,
          opacity: 0,
          duration: DUR.reveal,
          delay,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
        });
      });

      // No reduced-motion branch on purpose: with nothing registered for that
      // case the element just renders in its final position.
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
