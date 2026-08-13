export function Badge({ children }: { children: string }) {
  return (
    <span className="bg-accent px-1.5 py-1 font-display text-[9px] font-extrabold tracking-[0.14em] text-ink">
      {children}
    </span>
  );
}
