import { IconSymbol, IconSymbolName } from "@/components/ui/icon-symbol";
import { useTheme } from "@/providers/ThemeProvider";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

interface TabBarIconProps {
  name: IconSymbolName;
  color: string;
}

function TabBarIcon({ name, color }: TabBarIconProps) {
  return <IconSymbol name={name} color={color} size={28} />;
}

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarShowLabel: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: Platform.OS === "ios" ? 0 : 3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trends"
        options={{
          title: "Trends",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="chart.bar.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="heart.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="gearshape.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
