import { describeExpiry } from '../../lib/time';

export default function TimeBar({ expiresAt, now }) {
  const t = describeExpiry(expiresAt, now);
  if (t.isKept) return null;
  const pct = Math.round(t.fraction * 100);
  return (
    <div className="flex flex-col items-end gap-1.5">
      <span className={`font-mono text-xs ${t.isUrgent ? 'font-semibold text-ember-low' : 'text-ember-low'}`}>
        {t.label}
      </span>
      <span className="h-1.5 w-32 overflow-hidden rounded bg-[#E7EBF1]">
        <span
          data-fill
          style={{ width: `${pct}%` }}
          className={`block h-full rounded ${t.isUrgent ? 'ttl-fill-urgent animate-ttl-pulse' : 'ttl-fill'}`}
        />
      </span>
    </div>
  );
}
