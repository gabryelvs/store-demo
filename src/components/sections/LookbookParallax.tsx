"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";

/**
 * The one showpiece moment on the page: the image drifts against the scroll
 * inside a fixed-height band. yPercent (not y) keeps it correct at every
 * viewport width, and the image is oversized so the drift never reveals an edge.
 */
export function LookbookParallax() {
  const root = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(motionOK, () => {
        gsap.fromTo(
          image.current,
          { yPercent: -12 },
          {
            yPercent: 12,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-[60vh] min-h-[380px] overflow-hidden">
      <div ref={image} className="absolute inset-x-0 -top-[20%] h-[140%]">
        <Image src="/collections/outerwear.webp" alt="" fill sizes="100vw" className="object-cover opacity-80" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-ink/30">
        <p className="max-w-xl px-6 text-center font-display text-2xl font-extrabold italic leading-tight tracking-[-0.02em] md:text-4xl">
          BUILT FOR THE PADDOCK, WORN EVERYWHERE ELSE
        </p>
      </div>
    </section>
  );
}
