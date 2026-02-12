import { convertData, dataCategory } from '@/conversions/converters/data';

describe('Data Converter', () => {
  describe('convertData function', () => {
    it('should convert B to B (same unit)', () => {
      expect(convertData(1024, 'B', 'B')).toBe(1024);
    });

    it('should convert bytes to kilobytes', () => {
      expect(convertData(1024, 'B', 'KB')).toBe(1);
    });

    it('should convert kilobytes to bytes', () => {
      expect(convertData(1, 'KB', 'B')).toBe(1024);
    });

    it('should convert kilobytes to megabytes', () => {
      expect(convertData(1024, 'KB', 'MB')).toBe(1);
    });

    it('should convert megabytes to kilobytes', () => {
      expect(convertData(1, 'MB', 'KB')).toBe(1024);
    });

    it('should convert megabytes to gigabytes', () => {
      expect(convertData(1024, 'MB', 'GB')).toBe(1);
    });

    it('should convert gigabytes to megabytes', () => {
      expect(convertData(1, 'GB', 'MB')).toBe(1024);
    });

    it('should convert gigabytes to terabytes', () => {
      expect(convertData(1024, 'GB', 'TB')).toBe(1);
    });

    it('should convert terabytes to gigabytes', () => {
      expect(convertData(1, 'TB', 'GB')).toBe(1024);
    });

    it('should convert bytes to megabytes', () => {
      expect(convertData(1024 * 1024, 'B', 'MB')).toBe(1);
    });

    it('should convert bytes to gigabytes', () => {
      expect(convertData(1024 * 1024 * 1024, 'B', 'GB')).toBe(1);
    });

    it('should convert bytes to terabytes', () => {
      expect(convertData(1024 * 1024 * 1024 * 1024, 'B', 'TB')).toBe(1);
    });

    it('should handle decimal values', () => {
      expect(convertData(512, 'B', 'KB')).toBe(0.5);
      expect(convertData(0.5, 'KB', 'B')).toBe(512);
    });

    it('should return null for null value', () => {
      expect(convertData(null as any, 'B', 'KB')).toBeNull();
    });

    it('should return null for NaN value', () => {
      expect(convertData(NaN, 'B', 'KB')).toBeNull();
    });

    it('should return null for invalid from unit', () => {
      expect(convertData(1024, 'invalid', 'B')).toBeNull();
    });

    it('should return null for invalid to unit', () => {
      expect(convertData(1024, 'B', 'invalid')).toBeNull();
    });

    it('should handle zero value', () => {
      expect(convertData(0, 'B', 'KB')).toBe(0);
    });

    it('should handle negative values', () => {
      expect(convertData(-1024, 'B', 'KB')).toBe(-1);
    });

    it('should handle large numbers correctly', () => {
      const tbInBytes = 1024 * 1024 * 1024 * 1024;
      expect(convertData(2, 'TB', 'B')).toBe(tbInBytes * 2);
    });

    it('should convert between non-adjacent units', () => {
      expect(convertData(1, 'MB', 'B')).toBe(1024 * 1024);
      expect(convertData(1, 'GB', 'KB')).toBe(1024 * 1024);
      expect(convertData(1, 'TB', 'MB')).toBe(1024 * 1024);
    });
  });

  describe('dataCategory structure', () => {
    it('should have correct name', () => {
      expect(dataCategory.name).toBe('Data');
    });

    it('should have correct base unit', () => {
      expect(dataCategory.baseUnit).toBe('B');
    });

    it('should have all required units', () => {
      const expectedUnits = ['B', 'KB', 'MB', 'GB', 'TB'];
      const actualUnits = Object.keys(dataCategory.units);
      
      expectedUnits.forEach(unit => {
        expect(actualUnits).toContain(unit);
      });
    });

    it('should have proper unit structure', () => {
      const bUnit = dataCategory.units.B;
      expect(bUnit.label).toBe('Bytes');
      expect(bUnit.symbol).toBe('B');
      expect(typeof bUnit.toBase).toBe('function');
    });

    it('should have convert function', () => {
      expect(typeof dataCategory.convert).toBe('function');
    });
  });
});
