import { AppHeader } from "@/components/AppHeader";
import { CategoryCard } from "@/components/CategoryCard";
import { RecentConversionItem } from "@/components/RecentConversionItem";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/providers/ThemeProvider";
import { Link } from "expo-router";
import React from "react";
import { ScrollView, Text, TextInput, View } from "react-native";

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <AppHeader title="Converter" onHistoryPress={() => {}} />

      {/* Search Bar */}
      <View
        className="mx-4 mt-4 flex-row items-center rounded-lg p-3"
        style={{ backgroundColor: colors.tabIconDefault + "30" }}
      >
        <IconSymbol name="magnifyingglass" color={colors.icon} size={20} />
        <TextInput
          className="ml-2 flex-1 text-text"
          placeholder="Search units (e.g., meters to feet)"
          placeholderTextColor={colors.tabIconDefault}
        />
      </View>

      <View className="mt-6 px-4">
        <Text className="text-text text-xl font-bold">Categories</Text>
      </View>

      {/* Categories Grid - Placeholder for now */}
      <View className="mt-4 px-4 flex-row flex-wrap justify-between">
        {[
          {
            name: "Length",
            units: "m, ft, in, km, mi",
            icon: "ruler.fill",
            color: "#4285F4",
          },
          {
            name: "Weight",
            units: "kg, lb, oz, g",
            icon: "dumbbell.fill",
            color: "#34A853",
          },
          {
            name: "Temp",
            units: "°C, °F, K",
            icon: "thermometer.sun.fill",
            color: "#EA4335",
          },
          {
            name: "Volume",
            units: "l, gal, ml, cup",
            icon: "drop.fill",
            color: "#4285F4",
          },
          {
            name: "Area",
            units: "m², ft², acre",
            icon: "square.fill.and.line.vertical.and.line.horizontal",
            color: "#9C27B0",
          },
          {
            name: "Currency",
            units: "USD, EUR, GBP",
            icon: "coloncurrencysign.circle.fill",
            color: "#F9AB00",
          },
          {
            name: "Speed",
            units: "km/h, mph, m/s",
            icon: "speedometer",
            color: "#D32F2F",
          },
          {
            name: "Time",
            units: "sec, min, hr, day",
            icon: "hourglass.bottomhalf.fill",
            color: "#1976D2",
          },
        ].map((category) => (
          <Link
            key={category.name}
            href={{
              pathname: "/conversion/[type]",
              params: { type: category.name },
            }}
            asChild
          >
            <CategoryCard
              title={category.name}
              units={category.units}
              icon={category.icon as any}
              color={category.color}
              onPress={() => {}}
            />
          </Link>
        ))}
      </View>

      <View className="mt-6 px-4">
        <Text className="text-text text-xl font-bold">Recent Conversions</Text>
      </View>

      {/* Recent Conversions List - Placeholder for now */}
      <View className="mt-4 px-4">
        <RecentConversionItem
          fromValue="65"
          fromUnit="kg"
          toValue="143.3"
          toUnit="lbs"
          timeAgo="2 hours ago"
          onPress={() => {}}
        />
        <RecentConversionItem
          fromValue="100"
          fromUnit="USD"
          toValue="92.45"
          toUnit="EUR"
          timeAgo="Yesterday"
          onPress={() => {}}
        />
      </View>
    </ScrollView>
  );
}
