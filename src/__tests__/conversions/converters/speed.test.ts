import { convertSpeed, speedCategory } from '@/conversions/converters/speed';

describe('Speed Converter', () => {
  describe('convertSpeed function', () => {
    it('should convert kph to kph (same unit)', () => {
      expect(convertSpeed(100, 'kph', 'kph')).toBe(100);
    });

    it('should convert kph to mph', () => {
      expect(convertSpeed(100, 'kph', 'mph')).toBeCloseTo(62.137, 3);
    });

    it('should convert mph to kph', () => {
      expect(convertSpeed(62.137, 'mph', 'kph')).toBeCloseTo(100, 3);
    });

    it('should convert kph to mps', () => {
      expect(convertSpeed(3.6, 'kph', 'mps')).toBeCloseTo(1, 1);
    });

    it('should convert mps to kph', () => {
      expect(convertSpeed(1, 'mps', 'kph')).toBeCloseTo(3.6, 1);
    });

    it('should convert kph to fps', () => {
      expect(convertSpeed(1.09728, 'kph', 'fps')).toBeCloseTo(1, 5);
    });

    it('should convert fps to kph', () => {
      expect(convertSpeed(1, 'fps', 'kph')).toBeCloseTo(1.09728, 5);
    });

    it('should convert mph to mps', () => {
      expect(convertSpeed(1, 'mph', 'mps')).toBeCloseTo(0.44704, 5);
    });

    it('should convert mps to fps', () => {
      expect(convertSpeed(1, 'mps', 'fps')).toBeCloseTo(3.28084, 5);
    });

    it('should return null for null value', () => {
      expect(convertSpeed(null as any, 'kph', 'mph')).toBeNull();
    });

    it('should return null for NaN value', () => {
      expect(convertSpeed(NaN, 'kph', 'mph')).toBeNull();
    });

    it('should return null for invalid from unit', () => {
      expect(convertSpeed(100, 'invalid', 'kph')).toBeNull();
    });

    it('should return null for invalid to unit', () => {
      expect(convertSpeed(100, 'kph', 'invalid')).toBeNull();
    });

    it('should handle zero value', () => {
      expect(convertSpeed(0, 'kph', 'mph')).toBe(0);
    });

    it('should handle negative values', () => {
      expect(convertSpeed(-50, 'kph', 'mph')).toBeCloseTo(-31.069, 3);
    });
  });

  describe('speedCategory structure', () => {
    it('should have correct name', () => {
      expect(speedCategory.name).toBe('Speed');
    });

    it('should have correct base unit', () => {
      expect(speedCategory.baseUnit).toBe('kph');
    });

    it('should have all required units', () => {
      const expectedUnits = ['kph', 'mph', 'mps', 'fps'];
      const actualUnits = Object.keys(speedCategory.units);
      
      expectedUnits.forEach(unit => {
        expect(actualUnits).toContain(unit);
      });
    });

    it('should have proper unit structure', () => {
      const kphUnit = speedCategory.units.kph;
      expect(kphUnit.label).toBe('Kilometers/Hour');
      expect(kphUnit.symbol).toBe('km/h');
      expect(typeof kphUnit.toBase).toBe('function');
    });

    it('should have convert function', () => {
      expect(typeof speedCategory.convert).toBe('function');
    });
  });
});