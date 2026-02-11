import { IconSymbol, IconSymbolName } from "@/components/ui/icon-symbol";
import { useAppTheme } from "@/providers/ThemeProvider";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TabBarIconProps {
  name: IconSymbolName;
  color: string;
}

function TabBarIcon({ name, color }: TabBarIconProps) {
  return <IconSymbol name={name} color={color} size={28} />;
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  // For Android, don't add bottom inset since we're hiding the nav bar
  const bottomPadding = Platform.OS === 'ios' ? insets.bottom : 8;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarShowLabel: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.text + "33", // Subtle border using 20% opacity of text color
          height: 60 + bottomPadding, // Fixed height + minimal padding
          paddingBottom: bottomPadding, // Safe area only on iOS
          paddingTop: 5, // Add space between the top border and icons/labels
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: Platform.OS === "ios" ? 0 : 3,
          color: colors.text,
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
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="arrow.counterclockwise" color={color} />
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
