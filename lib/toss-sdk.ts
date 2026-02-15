/**
 * Apps-in-Toss SDK Wrapper
 *
 * This module wraps the Apps-in-Toss WebView SDK calls.
 * When the actual @apps-in-toss/web-framework SDK is unavailable,
 * all functions gracefully no-op or return mock data.
 *
 * Replace mock implementations with real SDK calls once Toss Console access is granted.
 */

// ─── Types ───

export interface TossUser {
    userId: string;
    nickname: string;
}

export interface PurchaseResult {
    success: boolean;
    purchaseToken?: string;
    error?: string;
}

// ─── Platform Detection ───

/**
 * Check if running inside Toss mini-app WebView.
 * In production, this checks for the Toss SDK object on window.
 */
export function isTossPlatform(): boolean {
    if (typeof window === "undefined") return false;

    // Check environment variable first
    if (process.env.NEXT_PUBLIC_PLATFORM === "toss") return true;

    // Check for Toss WebView SDK on window (runtime detection)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!(window as any).__APPS_IN_TOSS__;
}

// ─── Toss Login ───

/**
 * Authenticate via Toss Login SDK.
 * Returns user info (userId, nickname) or null if not in Toss.
 */
export async function tossLogin(): Promise<TossUser | null> {
    if (!isTossPlatform()) {
        console.log("[TossSDK] Not in Toss environment, skipping login");
        return null;
    }

    try {
        // TODO: Replace with actual Toss Login SDK call
        // const sdk = await import("@apps-in-toss/web-framework");
        // const user = await sdk.auth.login();
        // return { userId: user.id, nickname: user.nickname };

        console.log("[TossSDK] Mock login - returning null (SDK not installed)");
        return null;
    } catch (error) {
        console.error("[TossSDK] Login failed:", error);
        return null;
    }
}

// ─── IAP (In-App Purchase) ───

/** SKU definitions */
export const IAP_PRODUCTS = {
    DETAIL_SINGLE: "myzari_detail_single",
} as const;

/**
 * Request a purchase via Toss IAP SDK.
 * @param skuId - The product SKU ID to purchase
 */
export async function requestPurchase(skuId: string): Promise<PurchaseResult> {
    if (!isTossPlatform()) {
        console.log("[TossSDK] Not in Toss environment, purchase unavailable");
        return { success: false, error: "토스 앱에서만 결제할 수 있습니다." };
    }

    try {
        // TODO: Replace with actual Toss IAP SDK call
        // const sdk = await import("@apps-in-toss/web-framework");
        // const order = await sdk.iap.createOneTimePurchaseOrder({ skuId });
        // return { success: true, purchaseToken: order.purchaseToken };

        console.log(`[TossSDK] Mock purchase for SKU: ${skuId}`);
        return { success: false, error: "결제 SDK가 아직 연동되지 않았습니다." };
    } catch (error) {
        console.error("[TossSDK] Purchase failed:", error);
        return {
            success: false,
            error: "결제 중 오류가 발생했습니다. 다시 시도해주세요.",
        };
    }
}

// ─── IAA (In-App Advertising) ───

/**
 * Load and show an ad via Toss IAA SDK.
 * Returns true if ad was shown successfully.
 */
export async function showAd(): Promise<boolean> {
    if (!isTossPlatform()) {
        return false; // Silently skip ads outside Toss
    }

    try {
        // TODO: Replace with actual Toss IAA SDK call
        // const sdk = await import("@apps-in-toss/web-framework");
        // await sdk.iaa.loadAd();
        // await sdk.iaa.showAd();
        // return true;

        console.log("[TossSDK] Mock ad display - SDK not installed");
        return false;
    } catch (error) {
        console.error("[TossSDK] Ad failed:", error);
        return false;
    }
}

// ─── Share ───

/**
 * Share content via Toss in-app share.
 */
export async function shareToss(
    title: string,
    description: string,
    _imageUrl?: string
): Promise<boolean> {
    if (!isTossPlatform()) {
        return false;
    }

    try {
        // TODO: Replace with actual Toss Share SDK call
        // const sdk = await import("@apps-in-toss/web-framework");
        // await sdk.share({ title, description, imageUrl });
        // return true;

        console.log("[TossSDK] Mock share:", { title, description });
        return false;
    } catch (error) {
        console.error("[TossSDK] Share failed:", error);
        return false;
    }
}

// ─── Navigation ───

/**
 * Set back button handler for Toss header.
 */
export function setBackButtonHandler(_handler: () => void): void {
    if (!isTossPlatform()) return;

    try {
        // TODO: Replace with actual Toss Navigation SDK call
        // const sdk = await import("@apps-in-toss/web-framework");
        // sdk.navigation.setBackButton(handler);

        console.log("[TossSDK] Mock back button handler set");
    } catch (error) {
        console.error("[TossSDK] setBackButton failed:", error);
    }
}
