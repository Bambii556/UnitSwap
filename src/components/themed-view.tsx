import { cn } from "@/utils/cn";
import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  className?: string;
};

export function ThemedView({ className, ...allProps }: ThemedViewProps) {
  return (
    <View
      className={cn("flex-1 bg-background px-4 pt-4", className)}
      {...allProps}
    />
  );
}
