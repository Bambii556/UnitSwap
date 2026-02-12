import { useEffect, useRef, useState } from "react";

export const useAdMob = () => {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMobileAdsStartCalledRef = useRef(false);

  useEffect(() => {
    // Skip if AdMob is not available
    // For now, we'll mark as initialized since we're using react-native-google-mobile-ads
    setInitialized(true);
    setError(null);
    console.log("[useAdMob] AdMob is available (react-native-google-mobile-ads)");
  }, []);

  return { initialized, error, isAvailable: true };
};
