import { convertArea, areaCategory } from '@/conversions/converters/area';

describe('Area Converter', () => {
  describe('convertArea function', () => {
    it('should convert m² to m² (same unit)', () => {
      expect(convertArea(100, 'm²', 'm²')).toBe(100);
    });

    it('should convert m² to ft²', () => {
      expect(convertArea(1, 'm²', 'ft²')).toBeCloseTo(10.7639, 4);
    });

    it('should convert ft² to m²', () => {
      expect(convertArea(10.7639, 'ft²', 'm²')).toBeCloseTo(1, 4);
    });

    it('should convert m² to km²', () => {
      expect(convertArea(1_000_000, 'm²', 'km²')).toBe(1);
    });

    it('should convert km² to m²', () => {
      expect(convertArea(1, 'km²', 'm²')).toBe(1_000_000);
    });

    it('should convert m² to mi²', () => {
      expect(convertArea(2_589_988, 'm²', 'mi²')).toBeCloseTo(1, 6);
    });

    it('should convert mi² to m²', () => {
      expect(convertArea(1, 'mi²', 'm²')).toBeCloseTo(2_589_988, 0);
    });

    it('should convert m² to acre', () => {
      expect(convertArea(4046.86, 'm²', 'acre')).toBeCloseTo(1, 5);
    });

    it('should convert acre to m²', () => {
      expect(convertArea(1, 'acre', 'm²')).toBeCloseTo(4046.86, 2);
    });

    it('should convert m² to ha', () => {
      expect(convertArea(10_000, 'm²', 'ha')).toBe(1);
    });

    it('should convert ha to m²', () => {
      expect(convertArea(1, 'ha', 'm²')).toBe(10_000);
    });

    it('should convert m² to yd²', () => {
      expect(convertArea(1, 'm²', 'yd²')).toBeCloseTo(1.19599, 5);
    });

    it('should convert yd² to m²', () => {
      expect(convertArea(1, 'yd²', 'm²')).toBeCloseTo(0.836127, 6);
    });

    it('should convert km² to ha', () => {
      expect(convertArea(1, 'km²', 'ha')).toBe(100);
    });

    it('should convert ha to km²', () => {
      expect(convertArea(100, 'ha', 'km²')).toBe(1);
    });

    it('should convert acre to ha', () => {
      expect(convertArea(2.47105, 'acre', 'ha')).toBeCloseTo(1, 5);
    });

    it('should convert mi² to acre', () => {
      expect(convertArea(1, 'mi²', 'acre')).toBeCloseTo(640, 0);
    });

    it('should return null for null value', () => {
      expect(convertArea(null as any, 'm²', 'ft²')).toBeNull();
    });

    it('should return null for NaN value', () => {
      expect(convertArea(NaN, 'm²', 'ft²')).toBeNull();
    });

    it('should return null for invalid from unit', () => {
      expect(convertArea(100, 'invalid', 'm²')).toBeNull();
    });

    it('should return null for invalid to unit', () => {
      expect(convertArea(100, 'm²', 'invalid')).toBeNull();
    });

    it('should handle zero value', () => {
      expect(convertArea(0, 'm²', 'ft²')).toBe(0);
    });

    it('should handle negative values', () => {
      expect(convertArea(-100, 'm²', 'ft²')).toBeCloseTo(-1076.39, 2);
    });
  });

  describe('areaCategory structure', () => {
    it('should have correct name', () => {
      expect(areaCategory.name).toBe('Area');
    });

    it('should have correct base unit', () => {
      expect(areaCategory.baseUnit).toBe('m²');
    });

    it('should have all required units', () => {
      const expectedUnits = ['m²', 'ft²', 'km²', 'mi²', 'acre', 'ha', 'yd²'];
      const actualUnits = Object.keys(areaCategory.units);
      
      expectedUnits.forEach(unit => {
        expect(actualUnits).toContain(unit);
      });
    });

    it('should have proper unit structure', () => {
      const sqmUnit = areaCategory.units['m²'];
      expect(sqmUnit.label).toBe('Square Meters');
      expect(sqmUnit.symbol).toBe('m²');
      expect(typeof sqmUnit.toBase).toBe('function');
    });

    it('should have convert function', () => {
      expect(typeof areaCategory.convert).toBe('function');
    });
  });
});
