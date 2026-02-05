// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "home",
  "chart.bar.fill": "bar-chart",
  "heart.fill": "favorite",
  "gearshape.fill": "settings",
  "xmark.circle.fill": "close", // Added for modal close button
  magnifyingglass: "search",
  "line.horizontal.3": "menu",
  "arrow.counterclockwise": "history",
  "ruler.fill": "straighten",
  "dumbbell.fill": "fitness-center",
  "thermometer.sun.fill": "thermostat",
  "drop.fill": "water-drop",
  "square.fill.and.line.vertical.and.line.horizontal": "crop-square",
  "coloncurrencysign.circle.fill": "payments", // From categories.ts
  speedometer: "speed", // From categories.ts
  "hourglass.bottomhalf.fill": "hourglass-empty", // From categories.ts
  "arrow.up.arrow.down": "swap-vert",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.down": "expand-more",
  "delete.left": "backspace", // Changed to 'backspace' Material Icon
  "questionmark.circle.fill": "help", // Added default icon for CategoryIcon
  "thermometer.medium.slash.fill": "thermostat", // From categories.ts
  memorychip: "memory", // From categories.ts
} as const;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
