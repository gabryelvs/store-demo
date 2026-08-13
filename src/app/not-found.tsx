import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 text-center">
      <h1 className="font-display text-[clamp(4rem,16vw,10rem)] font-black italic leading-none tracking-[-0.05em] text-accent">
        404<span className="sr-only"> — page not found</span>
      </h1>
      <p className="max-w-sm text-sm text-muted">
        That page has been retired. The current drop is still live.
      </p>
      <Link
        href="/collections/drop-04"
        className="bg-accent px-6 py-3 font-display text-[11px] font-extrabold tracking-[0.16em] text-ink"
      >
        BACK TO DROP 04
      </Link>
    </div>
  );
}
