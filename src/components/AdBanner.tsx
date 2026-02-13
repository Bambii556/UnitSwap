import { ENABLE_REAL_ADS } from "@/config/app.config";
import { useSettings } from "@/providers/SettingsProvider";
import { AdPlacement, AdUnits } from "@/utils/admob";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { ThemedText } from "./themed-text";

interface AdBannerProps {
  placement: AdPlacement;
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement }) => {
  const { settings } = useSettings();
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [BannerAdComponent, setBannerAdComponent] = useState<any>(null);
  const [BannerAdSize, setBannerAdSize] = useState<any>(null);
  const [TestIds, setTestIds] = useState<any>(null);

  useEffect(() => {
    if (!ENABLE_REAL_ADS) {
      console.log(
        "[AdBanner] Placeholder mode (set ENABLE_REAL_ADS = true to enable)",
      );
      return;
    }

    const loadAdModule = async () => {
      try {
        const adModule = await import("react-native-google-mobile-ads");
        const BannerAd = adModule.BannerAd;
        const BannerAdSize = adModule.BannerAdSize;
        const TestIds = adModule.TestIds;

        if (BannerAd) {
          setBannerAdComponent(() => BannerAd);
          setBannerAdSize(BannerAdSize);
          setTestIds(TestIds);
          console.log("[AdBanner] Ads initialized successfully!");
        }
      } catch (err) {
        console.log("[AdBanner] Failed to load module:", err);
        setFailed(true);
      }
    };

    loadAdModule();
  }, []);

  const adUnitId = AdUnits[placement];
  const unitId = __DEV__
    ? TestIds?.LARGE_BANNER || "ca-app-pub-3940256099942544/6300978111"
    : adUnitId;

  // Don't show ads if user has purchased premium
  if (settings.isPremium) {
    return null;
  }

  // Show placeholder unless real ads are explicitly enabled
  if (!ENABLE_REAL_ADS || failed || !BannerAdComponent) {
    return (
      <AdContainer>
        <ThemedText>Advertisement</ThemedText>
      </AdContainer>
    );
  }

  return (
    <AdContainer>
      {unitId && (
        <BannerAdComponent
          size={BannerAdSize?.LARGE_BANNER || "LARGE_BANNER"}
          unitId={unitId}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdLoaded={() => {
            setLoaded(true);
          }}
          onAdFailedToLoad={(error: any) => {
            setFailed(true);
          }}
        />
      )}
    </AdContainer>
  );
};

function AdContainer({ children }: { children: React.ReactNode }) {
  return (
    <View className="w-full items-center justify-center my-4">{children}</View>
  );
}
