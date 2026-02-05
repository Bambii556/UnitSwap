import { BlurTint, BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, ViewProps } from "react-native";
import { cn } from "../utils/cn";

interface BlurBackgroundProps extends ViewProps {
  intensity?: number;
  tint?: BlurTint;
  children?: React.ReactNode;
  className?: string;
}

export function BlurBackground({
  intensity = 5,
  tint = "dark",
  style,
  children,
  className,
  ...rest
}: BlurBackgroundProps) {
  return (
    <View
      className={cn(
        "rounded-2xl overflow-hidden border border-white/10 bg-gray-800",
        className,
      )}
      style={style}
      {...rest}
    >
      <LinearGradient
        colors={["rgba(40, 40, 91, 0.05)", "rgba(16, 17, 43, 0.419)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="absolute inset-0"
      />
      <BlurView
        intensity={intensity}
        tint={tint}
        className="absolute inset-0"
      />
      {children}
    </View>
  );
}
