import { describe, it, expect } from 'vitest';
import { tiers } from '../data/tiers';

// ---------------------------------------------------------------------------
// Helper – mirrors the UI logic: which tier does a given points value match?
// ---------------------------------------------------------------------------
function getTierForPoints(points) {
  return tiers.findLast((t) => points >= t.min) ?? tiers[0];
}

// ---------------------------------------------------------------------------
// Helper – mirrors the rewards route: can a user afford a redemption?
// ---------------------------------------------------------------------------
function canRedeem(tierName, currentPoints) {
  const reward = tiers.find((t) => t.name === tierName);
  if (!reward) return false;
  return currentPoints >= reward.requiredPts;
}

// ---------------------------------------------------------------------------
describe('tiers data', () => {
  it('exports three tiers', () => {
    expect(tiers).toHaveLength(3);
  });

  it('tiers have required fields', () => {
    tiers.forEach((tier) => {
      expect(tier).toHaveProperty('name');
      expect(tier).toHaveProperty('min');
      expect(tier).toHaveProperty('max');
      expect(tier).toHaveProperty('requiredPts');
      expect(tier).toHaveProperty('cost');
      expect(tier).toHaveProperty('reward');
      expect(tier).toHaveProperty('emoji');
    });
  });

  it('tiers are ordered by min points ascending', () => {
    const mins = tiers.map((t) => t.min);
    expect(mins).toEqual([...mins].sort((a, b) => a - b));
  });
});

// ---------------------------------------------------------------------------
describe('getTierForPoints', () => {
  it('returns Explorer for 0 points', () => {
    expect(getTierForPoints(0).name).toBe('Explorer');
  });

  it('returns Explorer for 199 points', () => {
    expect(getTierForPoints(199).name).toBe('Explorer');
  });

  it('returns Wanderer for exactly 200 points', () => {
    expect(getTierForPoints(200).name).toBe('Wanderer');
  });

  it('returns Wanderer for 499 points', () => {
    expect(getTierForPoints(499).name).toBe('Wanderer');
  });

  it('returns Local Legend for exactly 500 points', () => {
    expect(getTierForPoints(500).name).toBe('Local Legend');
  });

  it('returns Local Legend for 9999 points', () => {
    expect(getTierForPoints(9999).name).toBe('Local Legend');
  });
});

// ---------------------------------------------------------------------------
describe('canRedeem', () => {
  it('Explorer tier (free) can always be redeemed at 0 points', () => {
    expect(canRedeem('Explorer', 0)).toBe(true);
  });

  it('Wanderer requires at least 200 points', () => {
    expect(canRedeem('Wanderer', 199)).toBe(false);
    expect(canRedeem('Wanderer', 200)).toBe(true);
  });

  it('Local Legend requires at least 500 points', () => {
    expect(canRedeem('Local Legend', 499)).toBe(false);
    expect(canRedeem('Local Legend', 500)).toBe(true);
  });

  it('returns false for an unknown tier name', () => {
    expect(canRedeem('Unknown Tier', 1000)).toBe(false);
  });
});
