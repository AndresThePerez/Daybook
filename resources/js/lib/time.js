export const TTL_HOURS = 12;
const WINDOW_MS = TTL_HOURS * 3600 * 1000;

function formatRemaining(ms) {
  if (ms <= 0) return 'Expiring';
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
}

export function describeExpiry(expiresAt, now = Date.now()) {
  if (!expiresAt) return { isKept: true };
  const remainingMs = new Date(expiresAt).getTime() - now;
  const fraction = Math.max(0, Math.min(1, remainingMs / WINDOW_MS));
  const isUrgent = remainingMs > 0 && remainingMs < 3600 * 1000;
  return { isKept: false, remainingMs, fraction, isUrgent, label: formatRemaining(remainingMs) };
}
