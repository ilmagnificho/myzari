"use client";

import { useState } from "react";
import { isTossPlatform, requestPurchase } from "@/lib/toss-sdk";
import { Loader2, Lock, Sparkles } from "lucide-react";

interface PaywallCTAProps {
    onPurchaseSuccess: () => void;
}

export default function PaywallCTA({ onPurchaseSuccess }: PaywallCTAProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUnlock = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const isToss = isTossPlatform();

            if (isToss) {
                // Real Toss IAP Flow
                const purchaseToken = await requestPurchase("myzari_detail_single");

                // Server Verification
                const res = await fetch("/api/purchase/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ purchaseToken }),
                });

                if (!res.ok) {
                    throw new Error("결제 검증에 실패했습니다.");
                }

                const data = await res.json();
                if (data.success) {
                    onPurchaseSuccess();
                } else {
                    throw new Error(data.error || "결제 처리에 실패했습니다.");
                }
            } else {
                // Web Dev Mode: Simulate success
                setTimeout(() => {
                    onPurchaseSuccess();
                }, 1000);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "결제 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto p-1 rounded-2xl bg-gradient-to-br from-gold/30 to-gold-dark/10 shadow-[0_8px_32px_-8px_rgba(219,193,136,0.15)] relative overflow-hidden group">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />

            <div className="bg-[#161618] rounded-xl p-6 text-center relative z-10 h-full flex flex-col items-center justify-center">
                <div className="w-12 h-12 mb-4 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
                    <Lock className="w-5 h-5" strokeWidth={1.5} />
                </div>

                <h3 className="text-lg font-medium text-offwhite mb-2 tracking-tight">
                    상세 분석 잠금해제
                </h3>

                <p className="text-sm text-muted/80 leading-relaxed mb-6 font-light">
                    나에게 딱 맞는 비보(裨補) 솔루션과<br />
                    구체적인 배치 팁을 확인하세요.
                </p>

                <button
                    onClick={handleUnlock}
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-b from-gold to-gold-dark text-[#111] rounded-xl text-base font-semibold hover:brightness-110 transition-all duration-300 active:scale-[0.98] shadow-[0_0_20px_-5px_rgba(219,193,136,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin opacity-80" strokeWidth={2} />
                            처리 중...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 opacity-80" strokeWidth={1.5} />
                            <span>전체 리포트 보기</span>
                            <span className="text-[#111]/60 text-sm font-medium ml-1">₩3,900</span>
                        </>
                    )}
                </button>

                {error && (
                    <p className="mt-4 text-xs text-red-400 font-medium animate-pulse">
                        {error}
                    </p>
                )}

                <p className="mt-4 text-[10px] text-muted/30 font-light">
                    *일회성 결제로, 추가 과금되지 않습니다.
                </p>
            </div>
        </div>
    );
}
