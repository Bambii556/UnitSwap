import { ALL_CATEGORIES } from "@/constants/categories";

export interface SearchableUnit {
  unitKey: string;
  fullName: string;
  symbol: string;
  categoryName: string;
  categoryColor: string;
}

// Static array that is computed once at module load time
// This never rebuilds since the data is static
export const ALL_SEARCHABLE_UNITS: SearchableUnit[] = (() => {
  const units: SearchableUnit[] = [];
  ALL_CATEGORIES.forEach((category) => {
    category.units.forEach((unitInfo) => {
      units.push({
        unitKey: `${category.name}-${unitInfo.unit}`,
        fullName: unitInfo.name,
        symbol: unitInfo.unit,
        categoryName: category.name,
        categoryColor: category.color,
      });
    });
  });
  return units;
})();
