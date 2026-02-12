import { convertVolume, volumeCategory } from '@/conversions/converters/volume';

describe('Volume Converter', () => {
  describe('convertVolume function', () => {
    it('should convert ml to ml (same unit)', () => {
      expect(convertVolume(100, 'ml', 'ml')).toBe(100);
    });

    it('should convert L to ml', () => {
      expect(convertVolume(1, 'L', 'ml')).toBe(1000);
    });

    it('should convert ml to L', () => {
      expect(convertVolume(1000, 'ml', 'L')).toBe(1);
    });

    it('should convert tsp to ml', () => {
      expect(convertVolume(1, 'tsp', 'ml')).toBeCloseTo(4.92892, 5);
    });

    it('should convert tbsp to ml', () => {
      expect(convertVolume(1, 'tbsp', 'ml')).toBeCloseTo(14.7868, 4);
    });

    it('should convert cup to ml', () => {
      expect(convertVolume(1, 'cup', 'ml')).toBeCloseTo(236.588, 3);
    });

    it('should convert fl_oz to ml', () => {
      expect(convertVolume(1, 'fl_oz', 'ml')).toBeCloseTo(29.5735, 4);
    });

    it('should convert gal to ml', () => {
      expect(convertVolume(1, 'gal', 'ml')).toBeCloseTo(3785.41, 2);
    });

    it('should convert ml to gal', () => {
      expect(convertVolume(3785.41, 'ml', 'gal')).toBeCloseTo(1, 5);
    });

    it('should convert L to gal', () => {
      expect(convertVolume(3.78541, 'L', 'gal')).toBeCloseTo(1, 5);
    });

    it('should convert gal to L', () => {
      expect(convertVolume(1, 'gal', 'L')).toBeCloseTo(3.78541, 5);
    });

    it('should convert L to cups', () => {
      expect(convertVolume(0.236588, 'L', 'cup')).toBeCloseTo(1, 5);
    });

    it('should convert tbsp to tsp', () => {
      expect(convertVolume(1, 'tbsp', 'tsp')).toBeCloseTo(3, 0);
    });

    it('should return null for null value', () => {
      expect(convertVolume(null as any, 'ml', 'L')).toBeNull();
    });

    it('should return null for NaN value', () => {
      expect(convertVolume(NaN, 'ml', 'L')).toBeNull();
    });

    it('should return null for invalid from unit', () => {
      expect(convertVolume(100, 'invalid', 'ml')).toBeNull();
    });

    it('should return null for invalid to unit', () => {
      expect(convertVolume(100, 'ml', 'invalid')).toBeNull();
    });

    it('should handle zero value', () => {
      expect(convertVolume(0, 'ml', 'L')).toBe(0);
    });

    it('should handle negative values', () => {
      expect(convertVolume(-500, 'ml', 'L')).toBe(-0.5);
    });
  });

  describe('volumeCategory structure', () => {
    it('should have correct name', () => {
      expect(volumeCategory.name).toBe('Volume (Cooking)');
    });

    it('should have correct base unit', () => {
      expect(volumeCategory.baseUnit).toBe('ml');
    });

    it('should have all required units', () => {
      const expectedUnits = ['ml', 'L', 'tsp', 'tbsp', 'cup', 'fl_oz', 'gal'];
      const actualUnits = Object.keys(volumeCategory.units);
      
      expectedUnits.forEach(unit => {
        expect(actualUnits).toContain(unit);
      });
    });

    it('should have proper unit structure', () => {
      const mlUnit = volumeCategory.units.ml;
      expect(mlUnit.label).toBe('Milliliters');
      expect(mlUnit.symbol).toBe('ml');
      expect(typeof mlUnit.toBase).toBe('function');
    });

    it('should have convert function', () => {
      expect(typeof volumeCategory.convert).toBe('function');
    });
  });
});
