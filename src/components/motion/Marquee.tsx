"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";
import { DUR } from "@/lib/motion";

type MarqueeProps = {
  children: ReactNode;
  /** Pixels travelled per second. 40–80 reads well for text. */
  speed?: number;
  /** Scroll leftwards (default) or rightwards. */
  direction?: "left" | "right";
  /** Slow to a stop while the pointer is over it. */
  pauseOnHover?: boolean;
  className?: string;
};

/**
 * Seamless infinite ticker.
 *
 * The children are rendered twice side by side and the track is moved by exactly
 * half its width before looping. Because the second copy sits where the first
 * started, the reset is invisible — this is what makes it seamless rather than
 * a visible snap back.
 *
 * Duration is derived from measured width so that speed stays constant no matter
 * how much content is inside. A fixed duration would make long content race.
 */
export function Marquee({
  children,
  speed = 45,
  direction = "left",
  pauseOnHover = false,
  className = "",
}: MarqueeProps) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(motionOK, () => {
        const el = track.current;
        if (!el) return;

        const half = el.scrollWidth / 2;
        if (half <= 0) return;

        const tween = gsap.to(el, {
          x: direction === "left" ? -half : 0,
          duration: half / speed,
          ease: "none",
          repeat: -1,
          // Start the rightward variant already displaced, so it travels into
          // view rather than out of it.
          startAt: direction === "right" ? { x: -half } : undefined,
        });

        if (!pauseOnHover) return () => tween.kill();

        const slow = () => gsap.to(tween, { timeScale: 0, duration: DUR.panel });
        const resume = () => gsap.to(tween, { timeScale: 1, duration: DUR.panel });
        root.current?.addEventListener("mouseenter", slow);
        root.current?.addEventListener("mouseleave", resume);

        return () => {
          root.current?.removeEventListener("mouseenter", slow);
          root.current?.removeEventListener("mouseleave", resume);
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [speed, direction, pauseOnHover] },
  );

  return (
    <div ref={root} className={`overflow-hidden ${className}`}>
      <div ref={track} className="flex w-max flex-nowrap">
        <div className="flex flex-nowrap items-center">{children}</div>
        <div className="flex flex-nowrap items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
