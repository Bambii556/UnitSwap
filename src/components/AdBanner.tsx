import { AdPlacement, AdUnits } from "@/utils/admob";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

interface AdBannerProps {
  placement: AdPlacement;
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement }) => {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isTestMode, setIsTestMode] = useState(true); // Test mode for development

  useEffect(() => {
    const setupTestDevices = async () => {
      if (__DEV__ && isTestMode) {
        try {
          // Test device setup - in development, we can use TestIds directly
          console.log("[AdBanner] Development mode detected - test ads will be used");
        } catch (err) {
          console.warn("[AdBanner] Failed to set up test devices:", err);
        }
      }
    };
    setupTestDevices();
  }, [isTestMode]);

  const adUnitId = AdUnits[placement];
  // Use test ID in development mode, otherwise use real ad unit ID
  const unitId = __DEV__ ? TestIds?.BANNER : adUnitId;

  if (!BannerAd) {
    return (
      <View
        style={[
          styles.container,
          styles.redBorder,
          styles.placeholderContainer,
        ]}
      >
        <View style={styles.borderLabel}>
          <Text style={styles.borderLabelText}>AD: {placement}</Text>
        </View>
        <Text style={styles.placeholderText}>AdMob Not Initialized</Text>
        <Text style={styles.placeholderSubtext}>
          Ensure react-native-google-mobile-ads is installed and configured.
        </Text>
      </View>
    );
  }

  if (failed) {
    return (
      <View
        style={[styles.container, styles.redBorder, styles.failedContainer]}
      >
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

      {unitId && (
        <BannerAd
          size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
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
