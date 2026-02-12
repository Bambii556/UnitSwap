import { conversionModules, convert } from "@/conversions/index";

describe("Main Conversion Function", () => {
  describe("convert function", () => {
    it("should convert weight units", () => {
      expect(convert(1, "kg", "g", "weight")).toBe(1000);
      expect(convert(1, "lb", "kg", "weight")).toBeCloseTo(0.453592, 6);
      expect(convert(1, "kg", "mg", "weight")).toBe(1000000);
    });

    it("should convert length units", () => {
      expect(convert(1, "m", "cm", "length")).toBe(100);
      expect(convert(1, "ft", "m", "length")).toBeCloseTo(0.3048, 4);
      expect(convert(1, "m", "mm", "length")).toBe(1000);
      expect(convert(1, "nmi", "m", "length")).toBe(1852);
    });

    it("should convert temperature units", () => {
      expect(convert(0, "°C", "°F", "temperature")).toBe(32);
      expect(convert(32, "°F", "°C", "temperature")).toBeCloseTo(0, 5);
      expect(convert(0, "°C", "K", "temperature")).toBe(273.15);
      expect(convert(0, "°C", "°R", "temperature")).toBeCloseTo(491.67, 2);
    });

    it("should convert volume units", () => {
      expect(convert(1, "L", "ml", "volume")).toBe(1000);
      expect(convert(1, "tsp", "ml", "volume")).toBeCloseTo(4.92892, 5);
      expect(convert(1, "gal", "L", "volume")).toBeCloseTo(3.78541, 5);
    });

    it("should convert speed units", () => {
      expect(convert(100, "km/h", "mph", "speed")).toBeCloseTo(62.137, 3);
      expect(convert(1, "m/s", "km/h", "speed")).toBeCloseTo(3.6, 1);
      expect(convert(1, "knot", "km/h", "speed")).toBeCloseTo(1.852, 5);
    });

    it("should convert time units", () => {
      expect(convert(1, "hr", "min", "time")).toBe(60);
      expect(convert(1, "day", "hr", "time")).toBe(24);
      expect(convert(60, "sec", "min", "time")).toBe(1);
    });

    it("should convert area units", () => {
      expect(convert(1, "m²", "ft²", "area")).toBeCloseTo(10.7639, 4);
      expect(convert(1, "ha", "m²", "area")).toBe(10000);
      expect(convert(1, "yd²", "m²", "area")).toBeCloseTo(0.836127, 6);
    });

    it("should convert data units", () => {
      expect(convert(1024, "B", "KB", "data")).toBe(1);
      expect(convert(1, "MB", "KB", "data")).toBe(1024);
    });

    it("should return null for invalid category", () => {
      const originalConsoleError = console.error;
      console.error = jest.fn();
      
      expect(convert(1, "kg", "g", "invalid" as any)).toBeNull();
      expect(console.error).toHaveBeenCalledWith("Unknown categoryKey: invalid");
      
      console.error = originalConsoleError;
    });

    it("should return null for null value", () => {
      expect(convert(null as any, "kg", "g", "weight")).toBeNull();
    });

    it("should return null for NaN value", () => {
      expect(convert(NaN, "kg", "g", "weight")).toBeNull();
    });
  });

  describe("conversionModules", () => {
    it("should contain all expected categories", () => {
      const expectedCategories = [
        "length",
        "weight",
        "temperature",
        "volume",
        "speed",
        "area",
        "time",
        "data",
        "currency",
      ];
      const actualCategories = Object.keys(conversionModules);

      expectedCategories.forEach((category) => {
        expect(actualCategories).toContain(category);
      });
    });

    it("should have properly structured category modules", () => {
      Object.values(conversionModules).forEach((category) => {
        expect(category).toHaveProperty("name");
        expect(category).toHaveProperty("units");
        expect(category).toHaveProperty("convert");
        expect(typeof category.convert).toBe("function");
        expect(typeof category.units).toBe("object");
      });
    });

    it("should have unique category names", () => {
      const categoryNames = Object.values(conversionModules).map(
        (cat) => cat.name,
      );
      const uniqueNames = [...new Set(categoryNames)];
      expect(categoryNames.length).toBe(uniqueNames.length);
    });

    it("should have proper units in each category", () => {
      Object.values(conversionModules).forEach((category) => {
        Object.values(category.units).forEach((unit) => {
          expect(unit).toHaveProperty("label");
          expect(unit).toHaveProperty("symbol");
        });
      });
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle zero value conversions", () => {
      expect(convert(0, "kg", "g", "weight")).toBe(0);
      expect(convert(0, "m", "cm", "length")).toBe(0);
      expect(convert(0, "°C", "°F", "temperature")).toBe(32);
    });

    it("should handle negative value conversions", () => {
      expect(convert(-1, "kg", "g", "weight")).toBe(-1000);
      expect(convert(-1, "m", "cm", "length")).toBe(-100);
      expect(convert(-40, "°C", "°F", "temperature")).toBe(-40);
    });

    it("should handle decimal value conversions", () => {
      expect(convert(1.5, "kg", "g", "weight")).toBe(1500);
      expect(convert(0.5, "m", "cm", "length")).toBe(50);
    });

    it("should handle very large values", () => {
      expect(convert(1000000, "kg", "ton", "weight")).toBe(1000);
      expect(convert(1000000, "m", "km", "length")).toBe(1000);
    });

    it("should handle very small values", () => {
      expect(convert(0.001, "g", "mg", "weight")).toBe(1);
      expect(convert(0.001, "kg", "g", "weight")).toBe(1);
    });
  });
});
