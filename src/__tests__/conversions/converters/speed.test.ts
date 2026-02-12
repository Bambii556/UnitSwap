import { convertSpeed, speedCategory } from '@/conversions/converters/speed';

describe('Speed Converter', () => {
  describe('convertSpeed function', () => {
    it('should convert km/h to km/h (same unit)', () => {
      expect(convertSpeed(100, 'km/h', 'km/h')).toBe(100);
    });

    it('should convert km/h to mph', () => {
      expect(convertSpeed(100, 'km/h', 'mph')).toBeCloseTo(62.137, 3);
    });

    it('should convert mph to km/h', () => {
      expect(convertSpeed(62.137, 'mph', 'km/h')).toBeCloseTo(100, 3);
    });

    it('should convert km/h to m/s', () => {
      expect(convertSpeed(3.6, 'km/h', 'm/s')).toBeCloseTo(1, 1);
    });

    it('should convert m/s to km/h', () => {
      expect(convertSpeed(1, 'm/s', 'km/h')).toBeCloseTo(3.6, 1);
    });

    it('should convert km/h to ft/s', () => {
      expect(convertSpeed(1.09728, 'km/h', 'ft/s')).toBeCloseTo(1, 5);
    });

    it('should convert ft/s to km/h', () => {
      expect(convertSpeed(1, 'ft/s', 'km/h')).toBeCloseTo(1.09728, 5);
    });

    it('should convert km/h to knot', () => {
      expect(convertSpeed(1.852, 'km/h', 'knot')).toBeCloseTo(1, 5);
    });

    it('should convert knot to km/h', () => {
      expect(convertSpeed(1, 'knot', 'km/h')).toBeCloseTo(1.852, 5);
    });

    it('should convert mph to m/s', () => {
      expect(convertSpeed(1, 'mph', 'm/s')).toBeCloseTo(0.44704, 5);
    });

    it('should convert m/s to ft/s', () => {
      expect(convertSpeed(1, 'm/s', 'ft/s')).toBeCloseTo(3.28084, 5);
    });

    it('should convert knot to mph', () => {
      expect(convertSpeed(1, 'knot', 'mph')).toBeCloseTo(1.15078, 5);
    });

    it('should return null for null value', () => {
      expect(convertSpeed(null as any, 'km/h', 'mph')).toBeNull();
    });

    it('should return null for NaN value', () => {
      expect(convertSpeed(NaN, 'km/h', 'mph')).toBeNull();
    });

    it('should return null for invalid from unit', () => {
      expect(convertSpeed(100, 'invalid', 'km/h')).toBeNull();
    });

    it('should return null for invalid to unit', () => {
      expect(convertSpeed(100, 'km/h', 'invalid')).toBeNull();
    });

    it('should handle zero value', () => {
      expect(convertSpeed(0, 'km/h', 'mph')).toBe(0);
    });

    it('should handle negative values', () => {
      expect(convertSpeed(-50, 'km/h', 'mph')).toBeCloseTo(-31.069, 3);
    });
  });

  describe('speedCategory structure', () => {
    it('should have correct name', () => {
      expect(speedCategory.name).toBe('Speed');
    });

    it('should have correct base unit', () => {
      expect(speedCategory.baseUnit).toBe('km/h');
    });

    it('should have all required units', () => {
      const expectedUnits = ['km/h', 'mph', 'm/s', 'knot', 'ft/s'];
      const actualUnits = Object.keys(speedCategory.units);
      
      expectedUnits.forEach(unit => {
        expect(actualUnits).toContain(unit);
      });
    });

    it('should have proper unit structure', () => {
      const kphUnit = speedCategory.units['km/h'];
      expect(kphUnit.label).toBe('Kilometers/Hour');
      expect(kphUnit.symbol).toBe('km/h');
      expect(typeof kphUnit.toBase).toBe('function');
    });

    it('should have convert function', () => {
      expect(typeof speedCategory.convert).toBe('function');
    });
  });
});
