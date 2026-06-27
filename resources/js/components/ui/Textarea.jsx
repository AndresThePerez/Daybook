export default function Textarea({ label, id, error, rows = 4, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-xs uppercase tracking-wider text-ink-faint">{label}</label>}
      <textarea id={id} rows={rows} aria-invalid={error ? 'true' : undefined}
        className={`rounded-[10px] border bg-surface px-3.5 py-2.5 text-sm text-ink resize-y
          focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30
          ${error ? 'border-ember-low' : 'border-hairline'} ${className}`} {...props} />
      {error && <p className="text-xs text-ember-low">{error}</p>}
    </div>
  );
}
