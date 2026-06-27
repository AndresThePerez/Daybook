export default function Badge({ color = '#97A0B0', children }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft">
      <span className="h-2 w-2 rounded-[3px]" style={{ background: color }} />
      {children}
    </span>
  );
}
