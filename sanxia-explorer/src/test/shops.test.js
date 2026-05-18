import { describe, it, expect } from 'vitest';
import { shops } from '../data/shops';

// ---------------------------------------------------------------------------
describe('shops data', () => {
  it('exports at least one shop', () => {
    expect(shops.length).toBeGreaterThan(0);
  });

  it('every shop has required fields', () => {
    shops.forEach((shop) => {
      expect(shop).toHaveProperty('id');
      expect(shop).toHaveProperty('name');
      expect(shop).toHaveProperty('nameZh');
      expect(shop).toHaveProperty('category');
      expect(shop).toHaveProperty('points');
      expect(shop).toHaveProperty('lat');
      expect(shop).toHaveProperty('lng');
    });
  });

  it('all shop ids are unique', () => {
    const ids = shops.map((s) => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('all shops award a positive number of points', () => {
    shops.forEach((shop) => {
      expect(shop.points).toBeGreaterThan(0);
    });
  });

  it('contains the Golden Croissant Bakery', () => {
    expect(shops.find((s) => s.id === 'bakery')).toBeDefined();
  });

  it('contains the Sanxia Zushi Temple', () => {
    expect(shops.find((s) => s.id === 'temple')).toBeDefined();
  });

  it('contains the Indigo Dyeing Workshop', () => {
    expect(shops.find((s) => s.id === 'indigo')).toBeDefined();
  });

  it('coordinates are within Taiwan bounding box', () => {
    // Taiwan approx lat 21–26, lng 119–123
    shops.forEach((shop) => {
      expect(shop.lat).toBeGreaterThanOrEqual(21);
      expect(shop.lat).toBeLessThanOrEqual(26);
      expect(shop.lng).toBeGreaterThanOrEqual(119);
      expect(shop.lng).toBeLessThanOrEqual(123);
    });
  });
});
