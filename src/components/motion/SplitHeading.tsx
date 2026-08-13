"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText, motionOK } from "@/lib/gsap";
import { DUR } from "@/lib/motion";

type SplitHeadingProps = {
  children: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
};

/**
 * Animates a heading in line by line, each line rising out of a mask.
 *
 * This is the effect that reads as "expensive" on a marketing site, and it is
 * the one clients ask for by pointing at someone else's homepage.
 */
export function SplitHeading({ children, as = "h1", className }: SplitHeadingProps) {
  const root = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(motionOK, () => {
        // autoSplit re-splits when the webfont finishes loading or the box is
        // resized. Without it, a slow connection animates the fallback font and
        // then reflows mid-animation, which looks broken.
        const split = SplitText.create(root.current, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              opacity: 0,
              duration: DUR.hero,
              stagger: 0.18,
              ease: "power3.out",
            }),
        });

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  // Capitalised so JSX treats it as a component reference rather than a literal
  // tag name. Passing the ref through JSX (not createElement) keeps the React
  // Compiler's ref lint rule happy.
  const Tag = as;

  return (
    <Tag ref={root} className={className}>
      {children}
    </Tag>
  );
}
