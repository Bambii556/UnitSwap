import { BlurTint, BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { cn } from "../utils/cn";

interface CardBackgroundProps extends ViewProps {
  intensity?: number;
  tint?: BlurTint;
  children?: React.ReactNode;
  className?: string;
}

export function CardBackground({
  intensity = 5,
  tint = "dark",
  style,
  children,
  className,
  ...rest
}: CardBackgroundProps) {
  return (
    <View
      style={[styles.container, style]}
      className={cn("bg-gray-800", className)}
      {...rest}
    >
      <LinearGradient
        colors={["rgba(40, 40, 91, 0.05)", "rgba(16, 17, 43, 0.419)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <BlurView
        intensity={intensity}
        tint={tint}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1, // Add a subtle border
    borderColor: "rgba(255,255,255,0.1)", // Light border color
  },
});
