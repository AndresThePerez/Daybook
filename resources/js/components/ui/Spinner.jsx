export default function Spinner({ label = 'Loading' }) {
  return (
    <div role="status" className="flex items-center gap-2 text-ink-soft">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-hairline border-t-ink" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}
