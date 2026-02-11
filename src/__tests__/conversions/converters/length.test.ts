import { convertLength, lengthCategory } from '@/conversions/converters/length';

describe('Length Converter', () => {
  describe('convertLength function', () => {
    it('should convert m to m (same unit)', () => {
      expect(convertLength(5, 'm', 'm')).toBe(5);
    });

    it('should convert m to cm', () => {
      expect(convertLength(1, 'm', 'cm')).toBe(100);
    });

    it('should convert cm to m', () => {
      expect(convertLength(100, 'cm', 'm')).toBe(1);
    });

    it('should convert m to km', () => {
      expect(convertLength(1000, 'm', 'km')).toBe(1);
    });

    it('should convert km to m', () => {
      expect(convertLength(1, 'km', 'm')).toBe(1000);
    });

    it('should convert m to inches', () => {
      expect(convertLength(0.0254, 'm', 'in')).toBeCloseTo(1, 5);
    });

    it('should convert inches to m', () => {
      expect(convertLength(1, 'in', 'm')).toBeCloseTo(0.0254, 4);
    });

    it('should convert m to feet', () => {
      expect(convertLength(0.3048, 'm', 'ft')).toBeCloseTo(1, 4);
    });

    it('should convert feet to m', () => {
      expect(convertLength(1, 'ft', 'm')).toBeCloseTo(0.3048, 4);
    });

    it('should convert m to yards', () => {
      expect(convertLength(0.9144, 'm', 'yd')).toBeCloseTo(1, 4);
    });

    it('should convert yards to m', () => {
      expect(convertLength(1, 'yd', 'm')).toBeCloseTo(0.9144, 4);
    });

    it('should convert km to miles', () => {
      expect(convertLength(1.60934, 'km', 'mi')).toBeCloseTo(1, 5);
    });

    it('should convert miles to km', () => {
      expect(convertLength(1, 'mi', 'km')).toBeCloseTo(1.60934, 5);
    });

    it('should convert feet to inches', () => {
      expect(convertLength(1, 'ft', 'in')).toBeCloseTo(12, 0);
    });

    it('should convert yards to feet', () => {
      expect(convertLength(1, 'yd', 'ft')).toBeCloseTo(3, 0);
    });

    it('should return null for null value', () => {
      expect(convertLength(null as any, 'm', 'cm')).toBeNull();
    });

    it('should return null for NaN value', () => {
      expect(convertLength(NaN, 'm', 'cm')).toBeNull();
    });

    it('should return null for invalid from unit', () => {
      expect(convertLength(5, 'invalid', 'm')).toBeNull();
    });

    it('should return null for invalid to unit', () => {
      expect(convertLength(5, 'm', 'invalid')).toBeNull();
    });

    it('should handle zero value', () => {
      expect(convertLength(0, 'm', 'cm')).toBe(0);
    });

    it('should handle negative values', () => {
      expect(convertLength(-1, 'm', 'cm')).toBe(-100);
    });
  });

  describe('lengthCategory structure', () => {
    it('should have correct name', () => {
      expect(lengthCategory.name).toBe('Length');
    });

    it('should have correct base unit', () => {
      expect(lengthCategory.baseUnit).toBe('m');
    });

    it('should have all required units', () => {
      const expectedUnits = ['m', 'cm', 'in', 'ft', 'yd', 'km', 'mi'];
      const actualUnits = Object.keys(lengthCategory.units);
      
      expectedUnits.forEach(unit => {
        expect(actualUnits).toContain(unit);
      });
    });

    it('should have proper unit structure', () => {
      const mUnit = lengthCategory.units.m;
      expect(mUnit.label).toBe('Meters');
      expect(mUnit.symbol).toBe('m');
      expect(typeof mUnit.toBase).toBe('function');
    });

    it('should have convert function', () => {
      expect(typeof lengthCategory.convert).toBe('function');
    });
  });
});