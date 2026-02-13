import {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";
import { useCallback, useEffect, useState } from "react";
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

interface UsePurchasesReturn {
  isLoading: boolean;
  isConfigured: boolean;
  isPremium: boolean;
  offerings: PurchasesOfferings | null;
  removeAdsPackage: PurchasesPackage | undefined;
  customerInfo: CustomerInfo | null;
  purchaseRemoveAds: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  refreshCustomerInfo: () => Promise<void>;
  error: string | null;
}

/**
 * Hook for managing RevenueCat purchases
 * Handles initialization, offerings, purchases, and premium status
 */
export const usePurchases = (): UsePurchasesReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get the remove ads package from current offerings
  const removeAdsPackage = offerings
    ? getRemoveAdsPackage(offerings)
    : undefined;

  /**
   * Update premium status based on customer info
   */
  const updatePremiumStatus = useCallback((info: CustomerInfo | null) => {
    const hasPremium = hasRemoveAdsEntitlement(info);
    setIsPremium(hasPremium);
    return hasPremium;
  }, []);

  /**
   * Refresh customer info from RevenueCat
   */
  const refreshCustomerInfo = useCallback(async () => {
    try {
      const info = await getCustomerInfo();
      setCustomerInfo(info);
      updatePremiumStatus(info);
    } catch (err) {
      console.error("[usePurchases] Failed to refresh customer info:", err);
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
            "[usePurchases] RevenueCat not configured yet - skipping initialization"
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
        console.error("[usePurchases] Initialization error:", err);
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
      console.log("[usePurchases] Customer info updated");
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
      console.error("[usePurchases] Purchase error:", err);
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
      console.error("[usePurchases] Restore error:", err);
      setError("Failed to restore purchases");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updatePremiumStatus]);

  return {
    isLoading,
    isConfigured,
    isPremium,
    offerings,
    removeAdsPackage,
    customerInfo,
    purchaseRemoveAds,
    restorePurchases: restorePurchasesCallback,
    refreshCustomerInfo,
    error,
  };
};
