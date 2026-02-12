import { convertTime, timeCategory } from '@/conversions/converters/time';

describe('Time Converter', () => {
  describe('convertTime function', () => {
    it('should convert sec to sec (same unit)', () => {
      expect(convertTime(60, 'sec', 'sec')).toBe(60);
    });

    it('should convert minutes to seconds', () => {
      expect(convertTime(1, 'min', 'sec')).toBe(60);
    });

    it('should convert seconds to minutes', () => {
      expect(convertTime(60, 'sec', 'min')).toBe(1);
    });

    it('should convert hours to seconds', () => {
      expect(convertTime(1, 'hr', 'sec')).toBe(3600);
    });

    it('should convert seconds to hours', () => {
      expect(convertTime(3600, 'sec', 'hr')).toBe(1);
    });

    it('should convert days to seconds', () => {
      expect(convertTime(1, 'day', 'sec')).toBe(86400);
    });

    it('should convert weeks to seconds', () => {
      expect(convertTime(1, 'week', 'sec')).toBe(604800);
    });

    it('should convert months to seconds', () => {
      expect(convertTime(1, 'month', 'sec')).toBe(2629746);
    });

    it('should convert years to seconds', () => {
      expect(convertTime(1, 'year', 'sec')).toBe(31556952);
    });

    it('should convert hours to minutes', () => {
      expect(convertTime(1, 'hr', 'min')).toBe(60);
    });

    it('should convert days to hours', () => {
      expect(convertTime(1, 'day', 'hr')).toBe(24);
    });

    it('should convert weeks to days', () => {
      expect(convertTime(1, 'week', 'day')).toBe(7);
    });

    it('should convert months to days', () => {
      expect(convertTime(1, 'month', 'day')).toBeCloseTo(30.44, 2);
    });

    it('should convert years to days', () => {
      expect(convertTime(1, 'year', 'day')).toBeCloseTo(365.24, 2);
    });

    it('should convert years to months', () => {
      expect(convertTime(1, 'year', 'month')).toBeCloseTo(12, 1);
    });

    it('should return null for null value', () => {
      expect(convertTime(null as any, 'sec', 'min')).toBeNull();
    });

    it('should return null for NaN value', () => {
      expect(convertTime(NaN, 'sec', 'min')).toBeNull();
    });

    it('should return null for invalid from unit', () => {
      expect(convertTime(60, 'invalid', 'sec')).toBeNull();
    });

    it('should return null for invalid to unit', () => {
      expect(convertTime(60, 'sec', 'invalid')).toBeNull();
    });

    it('should handle zero value', () => {
      expect(convertTime(0, 'sec', 'min')).toBe(0);
    });

    it('should handle negative values', () => {
      expect(convertTime(-60, 'sec', 'min')).toBe(-1);
    });
  });

  describe('timeCategory structure', () => {
    it('should have correct name', () => {
      expect(timeCategory.name).toBe('Time');
    });

    it('should have correct base unit', () => {
      expect(timeCategory.baseUnit).toBe('sec');
    });

    it('should have all required units', () => {
      const expectedUnits = ['sec', 'min', 'hr', 'day', 'week', 'month', 'year'];
      const actualUnits = Object.keys(timeCategory.units);
      
      expectedUnits.forEach(unit => {
        expect(actualUnits).toContain(unit);
      });
    });

    it('should have proper unit structure', () => {
      const secUnit = timeCategory.units.sec;
      expect(secUnit.label).toBe('Seconds');
      expect(secUnit.symbol).toBe('s');
      expect(typeof secUnit.toBase).toBe('function');
    });

    it('should have convert function', () => {
      expect(typeof timeCategory.convert).toBe('function');
    });
  });
});
