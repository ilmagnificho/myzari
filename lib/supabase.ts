/**
 * Supabase Client
 *
 * Client and server-side Supabase helpers for:
 * - Purchase history (userId, skuId, purchaseToken, createdAt)
 * - Analysis logs (userId, score, recommendation_key)
 *
 * Supabase is optional until environment variables are configured.
 * All functions gracefully return null/false when Supabase is unavailable.
 */

// ─── Types ───

export interface Purchase {
    id?: string;
    toss_user_id: string;
    sku_id: string;
    purchase_token: string;
    amount: number;
    status?: string;
    created_at?: string;
}

export interface AnalysisLog {
    id?: string;
    toss_user_id?: string;
    score: number;
    recommendation_key: string;
    is_paid?: boolean;
    created_at?: string;
}

// ─── Client Detection ───

function getSupabaseConfig() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        return null;
    }

    return { url, key };
}

/**
 * Check if Supabase is configured.
 */
export function isSupabaseConfigured(): boolean {
    return getSupabaseConfig() !== null;
}

// ─── Purchase Functions ───

/**
 * Save a purchase record to Supabase.
 */
export async function savePurchase(purchase: Purchase): Promise<boolean> {
    const config = getSupabaseConfig();
    if (!config) {
        console.log("[Supabase] Not configured, skipping savePurchase");
        return false;
    }

    try {
        const response = await fetch(`${config.url}/rest/v1/purchases`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                apikey: config.key,
                Authorization: `Bearer ${config.key}`,
                Prefer: "return=minimal",
            },
            body: JSON.stringify(purchase),
        });

        return response.ok;
    } catch (error) {
        console.error("[Supabase] savePurchase failed:", error);
        return false;
    }
}

/**
 * Check if a user has purchased a specific SKU for a given analysis.
 */
export async function checkPurchase(
    tossUserId: string,
    skuId: string
): Promise<boolean> {
    const config = getSupabaseConfig();
    if (!config) {
        return false;
    }

    try {
        const response = await fetch(
            `${config.url}/rest/v1/purchases?toss_user_id=eq.${encodeURIComponent(tossUserId)}&sku_id=eq.${encodeURIComponent(skuId)}&status=eq.completed&select=id&limit=1`,
            {
                headers: {
                    apikey: config.key,
                    Authorization: `Bearer ${config.key}`,
                },
            }
        );

        if (!response.ok) return false;

        const data = await response.json();
        return Array.isArray(data) && data.length > 0;
    } catch (error) {
        console.error("[Supabase] checkPurchase failed:", error);
        return false;
    }
}

// ─── Analysis Log Functions ───

/**
 * Save an analysis log to Supabase.
 */
export async function saveAnalysis(log: AnalysisLog): Promise<boolean> {
    const config = getSupabaseConfig();
    if (!config) {
        console.log("[Supabase] Not configured, skipping saveAnalysis");
        return false;
    }

    try {
        const response = await fetch(`${config.url}/rest/v1/analyses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                apikey: config.key,
                Authorization: `Bearer ${config.key}`,
                Prefer: "return=minimal",
            },
            body: JSON.stringify(log),
        });

        return response.ok;
    } catch (error) {
        console.error("[Supabase] saveAnalysis failed:", error);
        return false;
    }
}
