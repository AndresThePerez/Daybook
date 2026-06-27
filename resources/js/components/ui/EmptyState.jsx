export default function EmptyState({ title, action }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-card border border-dashed border-hairline bg-surface/60 py-16 text-center">
      <p className="text-ink-soft">{title}</p>
      {action}
    </div>
  );
}
