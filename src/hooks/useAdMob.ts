import { useEffect, useRef, useState } from "react";

// Safely import the AdMob module
let mobileAds: any;
let AdsConsent: any;
let isAdMobAvailable = false;

try {
  const GoogleMobileAds = require("react-native-google-mobile-ads");
  mobileAds = GoogleMobileAds.default;
  AdsConsent = GoogleMobileAds.AdsConsent;
  isAdMobAvailable = true;
} catch (error) {
  console.warn("[useAdMob] react-native-google-mobile-ads not available.");
}

export const useAdMob = () => {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMobileAdsStartCalledRef = useRef(false);

  useEffect(() => {
    // Skip if AdMob is not available
    if (!isAdMobAvailable) {
      console.log("[useAdMob] AdMob not available, skipping initialization");
      return;
    }

    const initAdMob = async () => {
      try {
        // Request consent information and load/present a consent form if necessary
        AdsConsent.gatherConsent()
          .then(() => startGoogleMobileAdsSDK())
          .catch((err: any) => {
            console.error("[AdMob] Consent gathering failed:", err);
            // Still try to initialize even if consent fails
            startGoogleMobileAdsSDK();
          });

        // This sample attempts to load ads using consent obtained in the previous session
        startGoogleMobileAdsSDK();
      } catch (err) {
        console.error("[AdMob] Initialization failed:", err);
        setError(err as Error);
      }
    };

    async function startGoogleMobileAdsSDK() {
      try {
        const { canRequestAds } = await AdsConsent.getConsentInfo();
        
        if (!canRequestAds || isMobileAdsStartCalledRef.current) {
          return;
        }

        isMobileAdsStartCalledRef.current = true;

        // Initialize the Google Mobile Ads SDK
        const adapterStatuses = await mobileAds().initialize();
        console.log("[AdMob] Initialization complete:", adapterStatuses);
        setInitialized(true);
      } catch (err) {
        console.error("[AdMob] SDK initialization failed:", err);
        setError(err as Error);
      }
    }

    initAdMob();
  }, []);

  return { initialized, error, isAvailable: isAdMobAvailable };
};
