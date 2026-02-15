"use client";

import { useState } from "react";
import { Eye, Loader2, Check, AlertCircle } from "lucide-react";
import { isTossPlatform, requestPurchase, IAP_PRODUCTS } from "@/lib/toss-sdk";

interface PaywallCTAProps {
    onPurchaseSuccess: () => void;
}

export default function PaywallCTA({ onPurchaseSuccess }: PaywallCTAProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const isToss = isTossPlatform();

    const handlePurchase = async () => {
        setStatus("loading");
        setErrorMsg("");

        if (isToss) {
            // Real Toss IAP purchase flow
            const result = await requestPurchase(IAP_PRODUCTS.DETAIL_SINGLE);

            if (result.success && result.purchaseToken) {
                // Verify purchase server-side
                try {
                    const verifyRes = await fetch("/api/purchase/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            purchaseToken: result.purchaseToken,
                        }),
                    });

                    if (verifyRes.ok) {
                        setStatus("success");
                        setTimeout(() => onPurchaseSuccess(), 500);
                        return;
                    }
                } catch {
                    // Verification failed
                }

                setStatus("error");
                setErrorMsg("구매 확인 중 문제가 발생했습니다.");
            } else {
                setStatus("error");
                setErrorMsg(result.error || "결제에 실패했습니다.");
            }
        } else {
            // Web fallback: direct unlock for testing
            setStatus("success");
            setTimeout(() => onPurchaseSuccess(), 500);
        }
    };

    if (status === "success") {
        return (
            <div className="w-full py-4.5 rounded-2xl bg-score-green/10 border border-score-green/20 flex items-center justify-center gap-2.5 fade-in-up">
                <Check className="w-5 h-5 text-score-green" strokeWidth={2} />
                <span className="text-base font-semibold text-score-green">
                    상세 분석이 해제되었습니다!
                </span>
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={handlePurchase}
                disabled={status === "loading"}
                className="w-full py-4.5 bg-charcoal text-offwhite rounded-2xl text-base font-semibold hover:bg-charcoal/90 transition-all duration-300 active:scale-[0.98] shadow-[0_8px_30px_-8px_rgba(0,0,0,0.25)] flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {status === "loading" ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} />
                        결제 진행 중...
                    </>
                ) : (
                    <>
                        <Eye className="w-5 h-5" strokeWidth={1.5} />
                        🔮 상세 분석 보기
                        <span className="text-offwhite/60 text-sm font-medium">₩3,900</span>
                    </>
                )}
            </button>

            {status === "error" && (
                <div className="mt-3 flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-score-red" strokeWidth={2} />
                    <p className="text-xs text-score-red font-medium">{errorMsg}</p>
                    <button
                        onClick={() => setStatus("idle")}
                        className="ml-2 text-xs text-muted underline hover:text-charcoal"
                    >
                        다시 시도
                    </button>
                </div>
            )}

            <p className="text-center text-xs text-muted mt-3">
                개선할 점 · 비보 아이템 상세 · 전문가 배치 팁
            </p>
        </div>
    );
}
