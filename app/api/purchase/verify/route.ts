import { NextRequest, NextResponse } from "next/server";
import { savePurchase, isSupabaseConfigured } from "@/lib/supabase";

/**
 * POST /api/purchase/verify
 *
 * Server-side purchase verification endpoint.
 * 1. Receives purchaseToken from client
 * 2. Verifies with Apps-in-Toss API (when available)
 * 3. Saves purchase record to Supabase
 * 4. Returns unlock status
 */
export async function POST(request: NextRequest) {
    try {
        const { purchaseToken, userId } = await request.json();

        if (!purchaseToken || typeof purchaseToken !== "string") {
            return NextResponse.json(
                { error: "purchaseToken이 필요합니다." },
                { status: 400 }
            );
        }

        // ─── Step 1: Verify with Toss Server API ───
        // TODO: Implement server-to-server verification with Toss API
        // const tossVerified = await verifyWithTossAPI(purchaseToken);
        // For now, accept all tokens (will be replaced with real verification)
        const isVerified = true;

        if (!isVerified) {
            return NextResponse.json(
                { error: "결제 확인에 실패했습니다." },
                { status: 400 }
            );
        }

        // ─── Step 2: Save to Supabase ───
        if (isSupabaseConfigured()) {
            await savePurchase({
                toss_user_id: userId || "anonymous",
                sku_id: "myzari_detail_single",
                purchase_token: purchaseToken,
                amount: 3900,
                status: "completed",
            });
        }

        // ─── Step 3: Return unlock status ───
        return NextResponse.json({
            unlocked: true,
            message: "상세 분석이 해제되었습니다.",
        });
    } catch (error) {
        console.error("Purchase verification error:", error);
        return NextResponse.json(
            { error: "서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
