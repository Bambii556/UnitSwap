import { ALL_CATEGORIES } from "@/constants/categories";
import { conversionModules, CategoryKey } from "@/conversions";

describe("Unit Implementation Coverage", () => {
  it("should have implementations for all units defined in categories", () => {
    const missingImplementations: { category: string; unit: string; name: string }[] = [];
    const categoryMapping: Record<string, CategoryKey> = {
      "Length": "length",
      "Weight": "weight",
      "Temperature": "temperature",
      "Volume": "volume",
      "Area": "area",
      "Currency": "currency",
      "Speed": "speed",
      "Time": "time",
      "Data": "data",
    };

    for (const category of ALL_CATEGORIES) {
      const conversionKey = categoryMapping[category.name];
      
      if (!conversionKey) {
        console.warn(`No conversion module mapping for category: ${category.name}`);
        continue;
      }

      const conversionModule = conversionModules[conversionKey];
      
      if (!conversionModule) {
        missingImplementations.push({
          category: category.name,
          unit: "N/A",
          name: "Missing entire conversion module",
        });
        continue;
      }

      const implementedUnits = Object.keys(conversionModule.units);

      for (const unitInfo of category.units) {
        const unitKey = unitInfo.unit;
        
        // Check if the unit exists in the conversion module
        if (!implementedUnits.includes(unitKey)) {
          missingImplementations.push({
            category: category.name,
            unit: unitKey,
            name: unitInfo.name,
          });
        }
      }
    }

    if (missingImplementations.length > 0) {
      console.error("\n=== Missing Unit Implementations ===");
      missingImplementations.forEach((item) => {
        console.error(`  [${item.category}] ${item.unit} (${item.name})`);
      });
      console.error(`\nTotal: ${missingImplementations.length} units missing`);
    }

    expect(missingImplementations).toEqual([]);
  });

  it("should have all conversion units documented in categories", () => {
    const extraImplementations: { category: string; unit: string; label: string }[] = [];
    const categoryMapping: Record<string, string> = {
      "length": "Length",
      "weight": "Weight",
      "temperature": "Temperature",
      "volume": "Volume",
      "area": "Area",
      "currency": "Currency",
      "speed": "Speed",
      "time": "Time",
      "data": "Data",
    };

    for (const [conversionKey, conversionModule] of Object.entries(conversionModules)) {
      const categoryName = categoryMapping[conversionKey];
      
      if (!categoryName) {
        console.warn(`No category defined for conversion module: ${conversionKey}`);
        continue;
      }

      const category = ALL_CATEGORIES.find((c) => c.name === categoryName);
      
      if (!category) {
        extraImplementations.push({
          category: conversionKey,
          unit: "ALL",
          label: "Category not defined in constants",
        });
        continue;
      }

      const documentedUnits = category.units.map((u) => u.unit);

      for (const implementedUnit of Object.keys(conversionModule.units)) {
        if (!documentedUnits.includes(implementedUnit)) {
          const unitInfo = conversionModule.units[implementedUnit];
          extraImplementations.push({
            category: categoryName,
            unit: implementedUnit,
            label: unitInfo.label,
          });
        }
      }
    }

    if (extraImplementations.length > 0) {
      console.error("\n=== Units in Conversions but not in Categories ===");
      extraImplementations.forEach((item) => {
        console.error(`  [${item.category}] ${item.unit} (${item.label})`);
      });
      console.error(`\nTotal: ${extraImplementations.length} extra units`);
    }

    expect(extraImplementations).toEqual([]);
  });
});
