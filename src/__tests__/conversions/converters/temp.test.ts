import { convertTemperature, temperatureCategory } from '@/conversions/converters/temp';

describe('Temperature Converter', () => {
  describe('convertTemperature function', () => {
    it('should convert °C to °C (same unit)', () => {
      expect(convertTemperature(25, '°C', '°C')).toBe(25);
    });

    it('should convert °F to °F (same unit)', () => {
      expect(convertTemperature(77, '°F', '°F')).toBe(77);
    });

    it('should convert K to K (same unit)', () => {
      expect(convertTemperature(298.15, 'K', 'K')).toBe(298.15);
    });

    it('should convert °R to °R (same unit)', () => {
      expect(convertTemperature(491.67, '°R', '°R')).toBeCloseTo(491.67, 2);
    });

    it('should convert °C to °F', () => {
      expect(convertTemperature(0, '°C', '°F')).toBe(32);
      expect(convertTemperature(100, '°C', '°F')).toBe(212);
      expect(convertTemperature(-40, '°C', '°F')).toBe(-40);
    });

    it('should convert °F to °C', () => {
      expect(convertTemperature(32, '°F', '°C')).toBe(0);
      expect(convertTemperature(212, '°F', '°C')).toBe(100);
      expect(convertTemperature(-40, '°F', '°C')).toBe(-40);
    });

    it('should convert °C to K', () => {
      expect(convertTemperature(0, '°C', 'K')).toBe(273.15);
      expect(convertTemperature(100, '°C', 'K')).toBe(373.15);
      expect(convertTemperature(-273.15, '°C', 'K')).toBe(0);
    });

    it('should convert K to °C', () => {
      expect(convertTemperature(273.15, 'K', '°C')).toBe(0);
      expect(convertTemperature(373.15, 'K', '°C')).toBe(100);
      expect(convertTemperature(0, 'K', '°C')).toBe(-273.15);
    });

    it('should convert °F to K', () => {
      expect(convertTemperature(32, '°F', 'K')).toBe(273.15);
      expect(convertTemperature(212, '°F', 'K')).toBe(373.15);
    });

    it('should convert K to °F', () => {
      expect(convertTemperature(273.15, 'K', '°F')).toBe(32);
      expect(convertTemperature(373.15, 'K', '°F')).toBe(212);
    });

    it('should convert °C to °R', () => {
      expect(convertTemperature(0, '°C', '°R')).toBeCloseTo(491.67, 2);
      expect(convertTemperature(100, '°C', '°R')).toBeCloseTo(671.67, 2);
    });

    it('should convert °R to °C', () => {
      expect(convertTemperature(491.67, '°R', '°C')).toBeCloseTo(0, 2);
      expect(convertTemperature(671.67, '°R', '°C')).toBeCloseTo(100, 2);
    });

    it('should convert °F to °R', () => {
      expect(convertTemperature(32, '°F', '°R')).toBeCloseTo(491.67, 2);
      expect(convertTemperature(212, '°F', '°R')).toBeCloseTo(671.67, 2);
    });

    it('should convert °R to °F', () => {
      expect(convertTemperature(491.67, '°R', '°F')).toBeCloseTo(32, 2);
      expect(convertTemperature(671.67, '°R', '°F')).toBeCloseTo(212, 2);
    });

    it('should convert K to °R', () => {
      expect(convertTemperature(273.15, 'K', '°R')).toBeCloseTo(491.67, 2);
    });

    it('should convert °R to K', () => {
      expect(convertTemperature(491.67, '°R', 'K')).toBeCloseTo(273.15, 2);
    });

    it('should handle decimal precision', () => {
      expect(convertTemperature(25, '°C', '°F')).toBeCloseTo(77, 1);
      expect(convertTemperature(77, '°F', '°C')).toBeCloseTo(25, 1);
    });

    it('should return null for null value', () => {
      expect(convertTemperature(null as any, '°C', '°F')).toBeNull();
    });

    it('should return null for NaN value', () => {
      expect(convertTemperature(NaN, '°C', '°F')).toBeNull();
    });

    it('should return null for invalid from unit', () => {
      expect(convertTemperature(25, 'invalid', '°C')).toBeNull();
    });

    it('should handle zero value in Celsius', () => {
      expect(convertTemperature(0, '°C', '°F')).toBe(32);
      expect(convertTemperature(0, '°C', 'K')).toBe(273.15);
    });

    it('should handle zero value in Fahrenheit', () => {
      expect(convertTemperature(0, '°F', '°C')).toBeCloseTo(-17.7778, 4);
      expect(convertTemperature(0, '°F', 'K')).toBeCloseTo(255.372, 3);
    });

    it('should handle absolute zero', () => {
      expect(convertTemperature(-273.15, '°C', 'K')).toBeCloseTo(0, 2);
      expect(convertTemperature(0, 'K', '°C')).toBeCloseTo(-273.15, 2);
    });
  });

  describe('temperatureCategory structure', () => {
    it('should have correct name', () => {
      expect(temperatureCategory.name).toBe('Temperature');
    });

    it('should have all required units', () => {
      const expectedUnits = ['°C', '°F', 'K', '°R'];
      const actualUnits = Object.keys(temperatureCategory.units);
      
      expectedUnits.forEach(unit => {
        expect(actualUnits).toContain(unit);
      });
    });

    it('should have proper unit structure', () => {
      const cUnit = temperatureCategory.units['°C'];
      expect(cUnit.label).toBe('Celsius (°C)');
      expect(cUnit.symbol).toBe('°C');
      expect(typeof cUnit.convert).toBe('function');
    });

    it('should have convert function', () => {
      expect(typeof temperatureCategory.convert).toBe('function');
    });

    it('should not have base unit (temperature uses different conversion logic)', () => {
      expect(temperatureCategory.baseUnit).toBeUndefined();
    });
  });
});
