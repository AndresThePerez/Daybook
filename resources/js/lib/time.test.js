import { describe, it, expect } from 'vitest';
import { describeExpiry, TTL_HOURS } from './time';

const H = 3600 * 1000;
const NOW = 1_700_000_000_000;
const iso = (msFromNow) => new Date(NOW + msFromNow).toISOString();

describe('describeExpiry', () => {
  it('marks null expiry as kept', () => {
    expect(describeExpiry(null, NOW)).toEqual({ isKept: true });
  });

  it('computes fraction over the 12h window', () => {
    const r = describeExpiry(iso(6 * H), NOW);
    expect(r.isKept).toBe(false);
    expect(r.fraction).toBeCloseTo(0.5, 5);
    expect(r.isUrgent).toBe(false);
    expect(r.label).toBe('6h 0m left');
  });

  it('flags under an hour as urgent and omits hours', () => {
    const r = describeExpiry(iso(42 * 60 * 1000), NOW);
    expect(r.isUrgent).toBe(true);
    expect(r.label).toBe('42m left');
  });

  it('clamps fraction to [0,1] and labels past expiry', () => {
    expect(describeExpiry(iso(-5 * H), NOW)).toMatchObject({ fraction: 0, label: 'Expiring' });
    expect(describeExpiry(iso(99 * H), NOW).fraction).toBe(1);
  });

  it('exposes the window constant', () => {
    expect(TTL_HOURS).toBe(12);
  });
});
