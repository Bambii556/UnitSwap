import {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";
import { useSettings } from "@/providers/SettingsProvider";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  fetchOfferings,
  getCustomerInfo,
  getRemoveAdsPackage,
  hasRemoveAdsEntitlement,
  initializePurchases,
  isRevenueCatConfigured,
  purchasePackage,
  Purchases,
  restorePurchases,
} from "@/utils/purchases";

interface PremiumContextType {
  isLoading: boolean;
  isConfigured: boolean;
  isPremium: boolean;
  offerings: PurchasesOfferings | null;
  removeAdsPackage: PurchasesPackage | undefined;
  purchaseRemoveAds: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  error: string | null;
}

export const PremiumContext = createContext<PremiumContextType | undefined>(
  undefined
);

interface PremiumProviderProps {
  children: ReactNode;
}

/**
 * Provider for managing premium/purchase state
 * Wraps RevenueCat functionality and provides premium status to the app
 */
export const PremiumProvider: React.FC<PremiumProviderProps> = ({
  children,
}) => {
  const { updatePremiumStatus: updateSettingsPremium } = useSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get the remove ads package from current offerings
  const removeAdsPackage = offerings
    ? getRemoveAdsPackage(offerings)
    : undefined;

  /**
   * Update premium status based on customer info
   * Syncs with SettingsProvider for persistence
   */
  const updatePremiumStatus = useCallback((info: CustomerInfo | null) => {
    const hasPremium = hasRemoveAdsEntitlement(info);
    setIsPremium(hasPremium);
    // Sync with SettingsProvider to persist the status
    updateSettingsPremium(hasPremium);
    return hasPremium;
  }, [updateSettingsPremium]);

  /**
   * Refresh customer info from RevenueCat
   */
  const refreshCustomerInfo = useCallback(async () => {
    try {
      const info = await getCustomerInfo();
      setCustomerInfo(info);
      updatePremiumStatus(info);
    } catch (err) {
      console.error("[PremiumProvider] Failed to refresh customer info:", err);
    }
  }, [updatePremiumStatus]);

  /**
   * Initialize RevenueCat and fetch initial data
   */
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if RevenueCat is configured
        const configured = isRevenueCatConfigured();
        setIsConfigured(configured);

        if (!configured) {
          console.log(
            "[PremiumProvider] RevenueCat not configured yet - skipping initialization"
          );
          setIsLoading(false);
          return;
        }

        // Initialize the SDK
        await initializePurchases();

        // Fetch offerings
        const offeringsData = await fetchOfferings();
        setOfferings(offeringsData);

        // Get current customer info
        await refreshCustomerInfo();
      } catch (err) {
        console.error("[PremiumProvider] Initialization error:", err);
        setError("Failed to initialize purchases");
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [refreshCustomerInfo]);

  /**
   * Listen for customer info updates from RevenueCat
   */
  useEffect(() => {
    if (!isConfigured) return;

    // Define listener function
    const customerInfoListener = (info: CustomerInfo) => {
      console.log("[PremiumProvider] Customer info updated");
      setCustomerInfo(info);
      updatePremiumStatus(info);
    };

    // Add listener for customer info updates
    Purchases.addCustomerInfoUpdateListener(customerInfoListener);

    // Cleanup: remove the listener when component unmounts
    return () => {
      Purchases.removeCustomerInfoUpdateListener(customerInfoListener);
    };
  }, [isConfigured, updatePremiumStatus]);

  /**
   * Purchase the remove ads package
   * @returns true if purchase was successful
   */
  const purchaseRemoveAds = useCallback(async (): Promise<boolean> => {
    if (!removeAdsPackage) {
      setError("Remove ads package not available");
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await purchasePackage(removeAdsPackage);

      if (result) {
        // Update premium status after successful purchase
        setCustomerInfo(result);
        updatePremiumStatus(result);
        return true;
      }

      return false;
    } catch (err) {
      console.error("[PremiumProvider] Purchase error:", err);
      setError("Purchase failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [removeAdsPackage, updatePremiumStatus]);

  /**
   * Restore previous purchases
   * @returns true if restore was successful and premium access granted
   */
  const restorePurchasesCallback = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await restorePurchases();

      if (result) {
        setCustomerInfo(result);
        const hasPremium = updatePremiumStatus(result);
        return hasPremium;
      }

      return false;
    } catch (err) {
      console.error("[PremiumProvider] Restore error:", err);
      setError("Failed to restore purchases");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updatePremiumStatus]);

  const contextValue: PremiumContextType = {
    isLoading,
    isConfigured,
    isPremium,
    offerings,
    removeAdsPackage,
    purchaseRemoveAds,
    restorePurchases: restorePurchasesCallback,
    error,
  };

  return (
    <PremiumContext.Provider value={contextValue}>
      {children}
    </PremiumContext.Provider>
  );
};

/**
 * Hook to access premium context
 * Must be used within a PremiumProvider
 */
export const usePremium = (): PremiumContextType => {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error("usePremium must be used within a PremiumProvider");
  }
  return context;
};
