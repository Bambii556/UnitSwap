import { convertArea, areaCategory } from '@/conversions/converters/area';

describe('Area Converter', () => {
  describe('convertArea function', () => {
    it('should convert sqm to sqm (same unit)', () => {
      expect(convertArea(100, 'sqm', 'sqm')).toBe(100);
    });

    it('should convert sqm to sqft', () => {
      expect(convertArea(1, 'sqm', 'sqft')).toBeCloseTo(10.7639, 4);
    });

    it('should convert sqft to sqm', () => {
      expect(convertArea(10.7639, 'sqft', 'sqm')).toBeCloseTo(1, 4);
    });

    it('should convert sqm to sqkm', () => {
      expect(convertArea(1_000_000, 'sqm', 'sqkm')).toBe(1);
    });

    it('should convert sqkm to sqm', () => {
      expect(convertArea(1, 'sqkm', 'sqm')).toBe(1_000_000);
    });

    it('should convert sqm to sqmi', () => {
      expect(convertArea(2_589_988, 'sqm', 'sqmi')).toBeCloseTo(1, 6);
    });

    it('should convert sqmi to sqm', () => {
      expect(convertArea(1, 'sqmi', 'sqm')).toBeCloseTo(2_589_988, 0);
    });

    it('should convert sqm to acres', () => {
      expect(convertArea(4046.86, 'sqm', 'acre')).toBeCloseTo(1, 5);
    });

    it('should convert acres to sqm', () => {
      expect(convertArea(1, 'acre', 'sqm')).toBeCloseTo(4046.86, 2);
    });

    it('should convert sqm to hectares', () => {
      expect(convertArea(10_000, 'sqm', 'hectare')).toBe(1);
    });

    it('should convert hectares to sqm', () => {
      expect(convertArea(1, 'hectare', 'sqm')).toBe(10_000);
    });

    it('should convert sqkm to hectares', () => {
      expect(convertArea(1, 'sqkm', 'hectare')).toBe(100);
    });

    it('should convert hectares to sqkm', () => {
      expect(convertArea(100, 'hectare', 'sqkm')).toBe(1);
    });

    it('should convert acres to hectares', () => {
      expect(convertArea(2.47105, 'acre', 'hectare')).toBeCloseTo(1, 5);
    });

    it('should convert sqmi to acres', () => {
      expect(convertArea(1, 'sqmi', 'acre')).toBeCloseTo(640, 0);
    });

    it('should return null for null value', () => {
      expect(convertArea(null as any, 'sqm', 'sqft')).toBeNull();
    });

    it('should return null for NaN value', () => {
      expect(convertArea(NaN, 'sqm', 'sqft')).toBeNull();
    });

    it('should return null for invalid from unit', () => {
      expect(convertArea(100, 'invalid', 'sqm')).toBeNull();
    });

    it('should return null for invalid to unit', () => {
      expect(convertArea(100, 'sqm', 'invalid')).toBeNull();
    });

    it('should handle zero value', () => {
      expect(convertArea(0, 'sqm', 'sqft')).toBe(0);
    });

    it('should handle negative values', () => {
      expect(convertArea(-100, 'sqm', 'sqft')).toBeCloseTo(-1076.39, 2);
    });
  });

  describe('areaCategory structure', () => {
    it('should have correct name', () => {
      expect(areaCategory.name).toBe('Area');
    });

    it('should have correct base unit', () => {
      expect(areaCategory.baseUnit).toBe('sqm');
    });

    it('should have all required units', () => {
      const expectedUnits = ['sqm', 'sqft', 'sqkm', 'sqmi', 'acre', 'hectare'];
      const actualUnits = Object.keys(areaCategory.units);
      
      expectedUnits.forEach(unit => {
        expect(actualUnits).toContain(unit);
      });
    });

    it('should have proper unit structure', () => {
      const sqmUnit = areaCategory.units.sqm;
      expect(sqmUnit.label).toBe('Square Meters');
      expect(sqmUnit.symbol).toBe('m²');
      expect(typeof sqmUnit.toBase).toBe('function');
    });

    it('should have convert function', () => {
      expect(typeof areaCategory.convert).toBe('function');
    });
  });
});