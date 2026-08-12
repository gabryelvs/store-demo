"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Registered exactly once. Registering inside components means whichever
// component mounts first decides what is available, which breaks in
// hard-to-reproduce ways once pages get code-split.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Wrap every animation in gsap.matchMedia(motionOK) so it simply never runs
// for anyone who asked their OS to reduce motion.
export const motionOK = "(prefers-reduced-motion: no-preference)";

if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  Object.assign(window, { gsap, ScrollTrigger, SplitText });
}

export { gsap, useGSAP, ScrollTrigger, SplitText };
