import { convertWeight, weightCategory } from '@/conversions/converters/weight';

describe('Weight Converter', () => {
  describe('convertWeight function', () => {
    it('should convert kg to kg (same unit)', () => {
      expect(convertWeight(5, 'kg', 'kg')).toBe(5);
    });

    it('should convert kg to g', () => {
      expect(convertWeight(1, 'kg', 'g')).toBe(1000);
    });

    it('should convert g to kg', () => {
      expect(convertWeight(1000, 'g', 'kg')).toBe(1);
    });

    it('should convert kg to lb', () => {
      expect(convertWeight(1, 'kg', 'lb')).toBeCloseTo(2.20462, 5);
    });

    it('should convert lb to kg', () => {
      expect(convertWeight(2.20462, 'lb', 'kg')).toBeCloseTo(1, 5);
    });

    it('should convert kg to oz', () => {
      expect(convertWeight(1, 'kg', 'oz')).toBeCloseTo(35.274, 3);
    });

    it('should convert oz to kg', () => {
      expect(convertWeight(35.274, 'oz', 'kg')).toBeCloseTo(1, 3);
    });

    it('should convert kg to tons', () => {
      expect(convertWeight(1000, 'kg', 'ton')).toBe(1);
    });

    it('should convert tons to kg', () => {
      expect(convertWeight(1, 'ton', 'kg')).toBe(1000);
    });

    it('should convert lb to oz', () => {
      expect(convertWeight(1, 'lb', 'oz')).toBeCloseTo(16, 0);
    });

    it('should return null for null value', () => {
      expect(convertWeight(null as any, 'kg', 'g')).toBeNull();
    });

    it('should return null for NaN value', () => {
      expect(convertWeight(NaN, 'kg', 'g')).toBeNull();
    });

    it('should return null for invalid from unit', () => {
      expect(convertWeight(5, 'invalid', 'kg')).toBeNull();
    });

    it('should return null for invalid to unit', () => {
      expect(convertWeight(5, 'kg', 'invalid')).toBeNull();
    });

    it('should handle zero value', () => {
      expect(convertWeight(0, 'kg', 'g')).toBe(0);
    });

    it('should handle negative values', () => {
      expect(convertWeight(-1, 'kg', 'g')).toBe(-1000);
    });
  });

  describe('weightCategory structure', () => {
    it('should have correct name', () => {
      expect(weightCategory.name).toBe('Weight');
    });

    it('should have correct base unit', () => {
      expect(weightCategory.baseUnit).toBe('kg');
    });

    it('should have all required units', () => {
      const expectedUnits = ['kg', 'g', 'lb', 'oz', 'ton'];
      const actualUnits = Object.keys(weightCategory.units);
      
      expectedUnits.forEach(unit => {
        expect(actualUnits).toContain(unit);
      });
    });

    it('should have proper unit structure', () => {
      const kgUnit = weightCategory.units.kg;
      expect(kgUnit.label).toBe('Kilograms');
      expect(kgUnit.symbol).toBe('kg');
      expect(typeof kgUnit.toBase).toBe('function');
    });

    it('should have convert function', () => {
      expect(typeof weightCategory.convert).toBe('function');
    });
  });
});