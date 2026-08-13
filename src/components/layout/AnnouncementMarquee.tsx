import { Marquee } from "@/components/motion/Marquee";

const ITEMS = ["DROP 04 LIVE NOW", "FREE SHIPPING OVER £75", "MADE IN LIMITED RUNS"];

export function AnnouncementMarquee() {
  return (
    <div className="bg-accent text-ink" data-chrome="marquee">
      <Marquee speed={45} pauseOnHover className="py-1.5">
        {ITEMS.concat(ITEMS).map((item, i) => (
          <span key={i} className="px-6 font-display text-[10px] font-extrabold tracking-[0.22em]">
            {item} <span aria-hidden="true">✦</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
