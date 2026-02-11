import { convertData, dataCategory } from '@/conversions/converters/data';

describe('Data Converter', () => {
  describe('convertData function', () => {
    it('should convert byte to byte (same unit)', () => {
      expect(convertData(1024, 'byte', 'byte')).toBe(1024);
    });

    it('should convert bytes to kilobytes', () => {
      expect(convertData(1024, 'byte', 'kb')).toBe(1);
    });

    it('should convert kilobytes to bytes', () => {
      expect(convertData(1, 'kb', 'byte')).toBe(1024);
    });

    it('should convert kilobytes to megabytes', () => {
      expect(convertData(1024, 'kb', 'mb')).toBe(1);
    });

    it('should convert megabytes to kilobytes', () => {
      expect(convertData(1, 'mb', 'kb')).toBe(1024);
    });

    it('should convert megabytes to gigabytes', () => {
      expect(convertData(1024, 'mb', 'gb')).toBe(1);
    });

    it('should convert gigabytes to megabytes', () => {
      expect(convertData(1, 'gb', 'mb')).toBe(1024);
    });

    it('should convert gigabytes to terabytes', () => {
      expect(convertData(1024, 'gb', 'tb')).toBe(1);
    });

    it('should convert terabytes to gigabytes', () => {
      expect(convertData(1, 'tb', 'gb')).toBe(1024);
    });

    it('should convert bytes to megabytes', () => {
      expect(convertData(1024 * 1024, 'byte', 'mb')).toBe(1);
    });

    it('should convert bytes to gigabytes', () => {
      expect(convertData(1024 * 1024 * 1024, 'byte', 'gb')).toBe(1);
    });

    it('should convert bytes to terabytes', () => {
      expect(convertData(1024 * 1024 * 1024 * 1024, 'byte', 'tb')).toBe(1);
    });

    it('should handle decimal values', () => {
      expect(convertData(512, 'byte', 'kb')).toBe(0.5);
      expect(convertData(0.5, 'kb', 'byte')).toBe(512);
    });

    it('should return null for null value', () => {
      expect(convertData(null as any, 'byte', 'kb')).toBeNull();
    });

    it('should return null for NaN value', () => {
      expect(convertData(NaN, 'byte', 'kb')).toBeNull();
    });

    it('should return null for invalid from unit', () => {
      expect(convertData(1024, 'invalid', 'byte')).toBeNull();
    });

    it('should return null for invalid to unit', () => {
      expect(convertData(1024, 'byte', 'invalid')).toBeNull();
    });

    it('should handle zero value', () => {
      expect(convertData(0, 'byte', 'kb')).toBe(0);
    });

    it('should handle negative values', () => {
      expect(convertData(-1024, 'byte', 'kb')).toBe(-1);
    });

    it('should handle large numbers correctly', () => {
      const tbInBytes = 1024 * 1024 * 1024 * 1024;
      expect(convertData(2, 'tb', 'byte')).toBe(tbInBytes * 2);
    });

    it('should convert between non-adjacent units', () => {
      expect(convertData(1, 'mb', 'byte')).toBe(1024 * 1024);
      expect(convertData(1, 'gb', 'kb')).toBe(1024 * 1024);
      expect(convertData(1, 'tb', 'mb')).toBe(1024 * 1024);
    });
  });

  describe('dataCategory structure', () => {
    it('should have correct name', () => {
      expect(dataCategory.name).toBe('Data');
    });

    it('should have correct base unit', () => {
      expect(dataCategory.baseUnit).toBe('byte');
    });

    it('should have all required units', () => {
      const expectedUnits = ['byte', 'kb', 'mb', 'gb', 'tb'];
      const actualUnits = Object.keys(dataCategory.units);
      
      expectedUnits.forEach(unit => {
        expect(actualUnits).toContain(unit);
      });
    });

    it('should have proper unit structure', () => {
      const byteUnit = dataCategory.units.byte;
      expect(byteUnit.label).toBe('Bytes');
      expect(byteUnit.symbol).toBe('B');
      expect(typeof byteUnit.toBase).toBe('function');
    });

    it('should have convert function', () => {
      expect(typeof dataCategory.convert).toBe('function');
    });
  });
});