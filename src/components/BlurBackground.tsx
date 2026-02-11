import { BlurTint, BlurView } from "expo-blur";
import React from "react";
import { View, ViewProps } from "react-native";
import { useAppTheme } from "@/providers/ThemeProvider";
import { cn } from "../utils/cn";

interface BlurBackgroundProps extends ViewProps {
  intensity?: number;
  tint?: BlurTint;
  children?: React.ReactNode;
  className?: string;
}

export function BlurBackground({
  intensity = 5,
  tint,
  style,
  children,
  className,
  ...rest
}: BlurBackgroundProps) {
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === "dark";

  // Use theme-appropriate tint if not specified
  const blurTint = tint || (isDark ? "dark" : "light");

  return (
    <View
      className={cn(
        "rounded-2xl overflow-hidden border border-border bg-card/80",
        className,
      )}
      style={style}
      {...rest}
    >
      <BlurView
        intensity={intensity}
        tint={blurTint}
        className="absolute inset-0"
      />
      {children}
    </View>
  );
}
