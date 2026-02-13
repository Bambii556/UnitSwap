import Constants from "expo-constants";
import { Platform } from "react-native";
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";

/**
 * Get RevenueCat API keys from environment variables or app config
 * Priority:
 * 1. Environment variables (EXPO_PUBLIC_REVENUECAT_*)
 * 2. Single shared key (EXPO_PUBLIC_REVENUE_CAT_API_KEY or REVENUE_CAT_API_KEY)
 * 3. App config extra field (for EAS builds)
 * 4. Fallback placeholder (will show warning)
 */
const getRevenueCatApiKeys = () => {
  // Try platform-specific environment variables first (works in EAS builds and dev builds)
  const envIosKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
  const envAndroidKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;

  if (envIosKey && envAndroidKey) {
    return {
      ios: envIosKey,
      android: envAndroidKey,
    };
  }

  // Try single shared key (EAS secrets often use this format)
  const sharedKey =
    process.env.EXPO_PUBLIC_REVENUE_CAT_API_KEY ||
    process.env.REVENUE_CAT_API_KEY;

  if (sharedKey) {
    return {
      ios: sharedKey,
      android: sharedKey,
    };
  }

  // Fallback to app config extra (works in all environments if configured in app.json)
  const extraConfig = Constants.expoConfig?.extra || {};
  const configIosKey = extraConfig.revenueCatIosApiKey;
  const configAndroidKey = extraConfig.revenueCatAndroidApiKey;

  if (configIosKey && configAndroidKey) {
    return {
      ios: configIosKey,
      android: configAndroidKey,
    };
  }

  // Placeholder - will be caught by isRevenueCatConfigured()
  return {
    ios: "",
    android: "",
  };
};

const REVENUECAT_API_KEYS = getRevenueCatApiKeys();

// Entitlement identifier for remove ads
export const REMOVE_ADS_ENTITLEMENT = "remove_ads";

// Check if running in Expo Go
const isExpoGo = async (): Promise<boolean> => {
  try {
    // Expo Go has a specific module that's only available in that environment
    const Constants = await import("expo-constants");
    return Constants.default.appOwnership === "expo";
  } catch {
    return false;
  }
};

/**
 * Initialize RevenueCat SDK
 * Call this once when the app starts
 */
export const initializePurchases = async (): Promise<void> => {
  try {
    // Set log level for debugging (remove in production)
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);

    // Determine platform and select appropriate API key
    const apiKey = Platform.select({
      ios: REVENUECAT_API_KEYS.ios,
      android: REVENUECAT_API_KEYS.android,
    });

    if (!apiKey) {
      console.warn("[Purchases] No API key configured for platform");
      return;
    }

    // Check if API keys are still placeholder values
    if (apiKey.includes("YOUR_")) {
      console.warn(
        "[Purchases] Please configure your RevenueCat API keys in purchases.ts",
      );
      return;
    }

    Purchases.configure({ apiKey });
    console.log("[Purchases] SDK initialized successfully");
  } catch (error) {
    console.error("[Purchases] Failed to initialize SDK:", error);
  }
};

/**
 * Check if user has purchased remove ads entitlement
 * @param customerInfo - CustomerInfo object from RevenueCat
 * @returns boolean indicating if user has premium access
 */
export const hasRemoveAdsEntitlement = (
  customerInfo: CustomerInfo | null,
): boolean => {
  if (!customerInfo) return false;

  const entitlement = customerInfo.entitlements.active[REMOVE_ADS_ENTITLEMENT];
  return typeof entitlement !== "undefined";
};

/**
 * Fetch available offerings from RevenueCat
 * @returns Offerings object or null if error
 */
export const fetchOfferings = async (): Promise<PurchasesOfferings | null> => {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings;
  } catch (error) {
    console.error("[Purchases] Failed to fetch offerings:", error);
    return null;
  }
};

/**
 * Get the remove ads package from offerings
 * @param offerings - PurchasesOfferings object
 * @returns PurchasesPackage or undefined
 */
export const getRemoveAdsPackage = (
  offerings: PurchasesOfferings | null,
): PurchasesPackage | undefined => {
  if (!offerings) return undefined;

  // Look for the remove_ads package in the current offering
  return offerings.current?.availablePackages.find(
    (pkg) =>
      pkg.product.identifier === "remove_ads_permanent" ||
      pkg.product.identifier.includes("remove_ads"),
  );
};

/**
 * Purchase a package
 * @param pkg - PurchasesPackage to purchase
 * @returns CustomerInfo after purchase or null if failed
 */
export const purchasePackage = async (
  pkg: PurchasesPackage,
): Promise<CustomerInfo | null> => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo;
  } catch (error: any) {
    // User cancelled or purchase failed
    if (error.code === "1" || error.code === "PURCHASE_CANCELLED") {
      console.log("[Purchases] Purchase cancelled by user");
    } else {
      console.error("[Purchases] Purchase failed:", error);
    }
    return null;
  }
};

/**
 * Restore previous purchases
 * @returns CustomerInfo after restore or null if failed
 */
export const restorePurchases = async (): Promise<CustomerInfo | null> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    console.log("[Purchases] Purchases restored successfully");
    return customerInfo;
  } catch (error) {
    console.error("[Purchases] Failed to restore purchases:", error);
    return null;
  }
};

/**
 * Get current customer info
 * @returns CustomerInfo or null if error
 */
export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error("[Purchases] Failed to get customer info:", error);
    return null;
  }
};

/**
 * Check if RevenueCat is properly configured and ready
 * @returns boolean
 */
export const isRevenueCatConfigured = (): boolean => {
  const apiKey = Platform.select({
    ios: REVENUECAT_API_KEYS.ios,
    android: REVENUECAT_API_KEYS.android,
  });

  return !!apiKey && !apiKey.includes("YOUR_");
};

export { isExpoGo, Purchases };
