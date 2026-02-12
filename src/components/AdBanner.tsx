import { AdPlacement, AdUnits } from "@/utils/admob";
import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";

// Safely import the AdMob module
let BannerAd: any;
let BannerAdSize: any;
let TestIds: any;
let isAdMobAvailable = false;

try {
  const GoogleMobileAds = require("react-native-google-mobile-ads");
  BannerAd = GoogleMobileAds.BannerAd;
  BannerAdSize = GoogleMobileAds.BannerAdSize;
  TestIds = GoogleMobileAds.TestIds;
  isAdMobAvailable = true;
} catch (error) {
  console.warn("[AdBanner] react-native-google-mobile-ads not available. Run prebuild to enable ads.");
}

interface AdBannerProps {
  placement: AdPlacement;
  size?: any;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  placement,
  size = BannerAdSize?.BANNER || "BANNER",
}) => {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Show placeholder if AdMob is not available
  if (!isAdMobAvailable) {
    return (
      <View style={[styles.container, styles.redBorder, styles.placeholderContainer]}>
        <View style={styles.borderLabel}>
          <Text style={styles.borderLabelText}>AD: {placement}</Text>
        </View>
        <Text style={styles.placeholderText}>Ad Placeholder</Text>
        <Text style={styles.placeholderSubtext}>Run prebuild to enable ads</Text>
      </View>
    );
  }

  const adUnitId = AdUnits[placement];
  const unitId = __DEV__ ? TestIds?.BANNER : adUnitId;

  if (failed) {
    return (
      <View style={[styles.container, styles.redBorder, styles.failedContainer]}>
        <Text style={styles.failedText}>Ad Failed to Load</Text>
        <Text style={styles.placementText}>{placement}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.redBorder]}>
      {/* Red border visualization */}
      <View style={styles.borderLabel}>
        <Text style={styles.borderLabelText}>AD: {placement}</Text>
      </View>
      
      {unitId && BannerAd && (
        <BannerAd
          size={size}
          unitId={unitId}
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
      
      {!loaded && !failed && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Ad...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 0, 0, 0.05)",
    marginVertical: 8,
    position: "relative",
  },
  redBorder: {
    borderWidth: 3,
    borderColor: "#FF0000",
    borderStyle: "dashed",
    borderRadius: 4,
  },
  borderLabel: {
    position: "absolute",
    top: -12,
    left: 8,
    backgroundColor: "#FF0000",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },
  borderLabelText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  loadingContainer: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FF0000",
    fontSize: 12,
  },
  failedContainer: {
    height: 50,
    backgroundColor: "rgba(255, 0, 0, 0.1)",
  },
  failedText: {
    color: "#FF0000",
    fontSize: 12,
    fontWeight: "bold",
  },
  placementText: {
    color: "#FF0000",
    fontSize: 10,
    marginTop: 2,
  },
  placeholderContainer: {
    height: 60,
    backgroundColor: "rgba(255, 0, 0, 0.05)",
  },
  placeholderText: {
    color: "#FF0000",
    fontSize: 14,
    fontWeight: "bold",
  },
  placeholderSubtext: {
    color: "#FF0000",
    fontSize: 10,
    marginTop: 2,
  },
});
