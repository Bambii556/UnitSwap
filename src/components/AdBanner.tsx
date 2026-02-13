import { ENABLE_REAL_ADS } from "@/config/app.config";
import { AdPlacement, AdUnits } from "@/utils/admob";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface AdBannerProps {
  placement: AdPlacement;
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement }) => {
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
        console.log("[AdBanner] Loading Google Mobile Ads module...");

        const adModule = await import("react-native-google-mobile-ads");

        console.log("[AdBanner] Module loaded, keys:", Object.keys(adModule));

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
    ? TestIds?.BANNER || "ca-app-pub-3940256099942544/6300978111"
    : adUnitId;

  // Show placeholder unless real ads are explicitly enabled
  if (!ENABLE_REAL_ADS || failed || !BannerAdComponent) {
    return (
      <View style={[styles.container, { borderColor: "red", borderWidth: 1 }]}>
        <Text style={styles.placeholderText}>Advertisement</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {unitId && (
        <BannerAdComponent
          size={BannerAdSize?.BANNER || "BANNER"}
          unitId={unitId}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdLoaded={() => {
            console.log(`[AdBanner] ${placement} loaded successfully`);
            setLoaded(true);
          }}
          onAdFailedToLoad={(error: any) => {
            console.log(`[AdBanner] ${placement} failed to load:`, error);
            setFailed(true);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    marginVertical: 8,
  },
  placeholderText: {
    color: "#999",
    fontSize: 12,
  },
});
