export default function Select({ label, id, error, children, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-xs uppercase tracking-wider text-ink-faint">{label}</label>}
      <select id={id} aria-invalid={error ? 'true' : undefined}
        className={`rounded-[10px] border bg-surface px-3.5 py-2.5 text-sm text-ink
          focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30
          ${error ? 'border-ember-low' : 'border-hairline'} ${className}`} {...props}>
        {children}
      </select>
      {error && <p className="text-xs text-ember-low">{error}</p>}
    </div>
  );
}
