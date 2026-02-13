import { ENABLE_REAL_ADS } from "@/config/app.config";
import { useEffect, useRef, useState } from "react";

let mobileAdsInstance: any = null;

const getMobileAds = async () => {
  if (!mobileAdsInstance) {
    try {
      const module = await import("react-native-google-mobile-ads");
      mobileAdsInstance = module.default || module;
    } catch (e) {
      console.warn("[useAdMob] Failed to load mobile ads module:", e);
      return null;
    }
  }
  return mobileAdsInstance;
};

export const useAdMob = () => {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMobileAdsStartCalledRef = useRef(false);

  useEffect(() => {
    if (!ENABLE_REAL_ADS) {
      setInitialized(true);
      return;
    }

    const initializeAds = async () => {
      try {
        if (!isMobileAdsStartCalledRef.current) {
          isMobileAdsStartCalledRef.current = true;
          const ads = await getMobileAds();
          if (ads && typeof ads.initialize === 'function') {
            await ads.initialize();
            console.log("[useAdMob] AdMob initialized successfully");
          } else if (ads && typeof ads === 'function') {
            await ads().initialize();
            console.log("[useAdMob] AdMob initialized successfully");
          } else {
            console.log("[useAdMob] AdMob module not properly loaded");
          }
          setInitialized(true);
        }
      } catch (err) {
        setError(err as Error);
        console.error("[useAdMob] Failed to initialize AdMob:", err);
        setInitialized(true);
      }
    };

    initializeAds();
  }, []);

  return { initialized, error, isAvailable: ENABLE_REAL_ADS };
};
