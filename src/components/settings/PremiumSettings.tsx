import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePremium } from "@/providers/PremiumProvider";
import { cn } from "@/utils/cn";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  View,
} from "react-native";

/**
 * Premium Settings Component
 * Allows users to purchase ad removal or restore previous purchases
 */
export const PremiumSettings: React.FC = () => {
  const {
    isPremium,
    isConfigured,
    removeAdsPackage,
    purchaseRemoveAds,
    restorePurchases,
  } = usePremium();

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handlePurchase = async () => {
    if (!removeAdsPackage || isPurchasing) return;

    setIsPurchasing(true);
    const success = await purchaseRemoveAds();
    setIsPurchasing(false);

    if (success) {
      Alert.alert(
        "Purchase Successful!",
        "Thank you for your purchase. Ads have been removed from the app.",
        [{ text: "OK" }]
      );
    }
  };

  const handleRestore = async () => {
    if (isRestoring) return;

    setIsRestoring(true);
    const success = await restorePurchases();
    setIsRestoring(false);

    if (success) {
      Alert.alert(
        "Purchases Restored",
        "Your previous purchase has been restored and ads are now removed.",
        [{ text: "OK" }]
      );
    } else {
      Alert.alert(
        "No Purchases Found",
        "We couldn't find any previous purchases to restore. If you believe this is an error, please contact support.",
        [{ text: "OK" }]
      );
    }
  };

  const handleNotConfigured = () => {
    Alert.alert(
      "Not Available",
      "In-app purchases are not configured yet. Please try again later.",
      [{ text: "OK" }]
    );
  };

  // If user is already premium, show thank you message
  if (isPremium) {
    return (
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-3 text-text">
          Premium Status
        </Text>
        <View className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
          <View className="flex-row items-center mb-2">
            <IconSymbol
              name="checkmark.circle.fill"
              size={24}
              color="#22C55E"
            />
            <Text className="text-lg font-semibold ml-2 text-green-700 dark:text-green-400">
              Premium Active
            </Text>
          </View>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            Thank you for your purchase! Ads have been permanently removed from
            the app.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold mb-3 text-text">
        Remove Ads
      </Text>
      <View className="bg-card rounded-xl overflow-hidden border border-border">
        {/* Purchase Section */}
        <Pressable
          onPress={isConfigured ? handlePurchase : handleNotConfigured}
          disabled={isPurchasing || !removeAdsPackage}
          className={cn(
            "p-4 border-b border-border",
            (isPurchasing || !removeAdsPackage) && "opacity-50"
          )}
          accessibilityLabel="Purchase remove ads"
          accessibilityRole="button"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <IconSymbol
                  name="star.fill"
                  size={20}
                  color="#F59E0B"
                />
                <Text className="text-base font-semibold ml-2 text-text">
                  Remove Ads Forever
                </Text>
              </View>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                One-time purchase • No subscriptions
              </Text>
              {!isConfigured && (
                <Text className="text-xs text-orange-500 mt-1">
                  Not configured yet
                </Text>
              )}
            </View>
            <View className="flex-row items-center">
              <View className="bg-primary px-3 py-2 rounded-lg mr-3">
                <Text className="text-white font-semibold">$1.99</Text>
              </View>
              {isPurchasing ? (
                <ActivityIndicator size="small" color="#3B82F6" />
              ) : (
                <IconSymbol
                  name="chevron.right"
                  size={20}
                  color="#9CA3AF"
                />
              )}
            </View>
          </View>
        </Pressable>

        {/* Restore Purchases */}
        <Pressable
          onPress={isConfigured ? handleRestore : handleNotConfigured}
          disabled={isRestoring}
          className={cn("p-4", isRestoring && "opacity-50")}
          accessibilityLabel="Restore purchases"
          accessibilityRole="button"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <IconSymbol
                  name="arrow.clockwise"
                  size={20}
                  color="#6B7280"
                />
                <Text className="text-base font-semibold ml-2 text-text">
                  Restore Purchases
                </Text>
              </View>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Already purchased? Restore here
              </Text>
            </View>
            {isRestoring ? (
              <ActivityIndicator size="small" color="#3B82F6" />
            ) : (
              <IconSymbol name="chevron.right" size={20} color="#9CA3AF" />
            )}
          </View>
        </Pressable>
      </View>
    </View>
  );
};
