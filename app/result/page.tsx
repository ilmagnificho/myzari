"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BIBO_ITEMS } from "@/constants/items";
import { getScoreColor, getScoreLabel, isTossPlatform } from "@/lib/utils";
import type { AnalysisResult } from "@/lib/validation";
import {
    Copy,
    Check,
    RotateCcw,
    ArrowLeft,
    Sparkles,
    AlertTriangle,
    Lock,
    Eye,
} from "lucide-react";

export default function ResultPage() {
    const router = useRouter();
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [copied, setCopied] = useState(false);
    const [isPaid, setIsPaid] = useState(false);

    useEffect(() => {
        const stored = sessionStorage.getItem("analysisResult");
        if (!stored) {
            router.push("/analyze");
            return;
        }

        try {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setResult(JSON.parse(stored));
        } catch {
            router.push("/analyze");
        }

        // Check if user already purchased (from sessionStorage for now)
        const purchaseStatus = sessionStorage.getItem("purchaseStatus");
        if (purchaseStatus === "paid") {
            setIsPaid(true);
        }
    }, [router]);

    if (!result) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const item = BIBO_ITEMS[result.recommendation_key];
    const scoreColor = getScoreColor(result.score);
    const scoreLabel = getScoreLabel(result.score);
    const isToss = isTossPlatform();

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.origin);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
        }
    };

    const handleRetry = () => {
        sessionStorage.removeItem("analysisResult");
        sessionStorage.removeItem("purchaseStatus");
        router.push("/analyze");
    };

    const handlePurchase = async () => {
        if (isToss) {
            // TODO: Integrate with Toss IAP SDK
            // const { requestPurchase } = await import("@/lib/toss-sdk");
            // const token = await requestPurchase("myzari_detail_single");
            // Verify purchase server-side, then unlock
        }

        // For now (dev/web): unlock directly for testing
        setIsPaid(true);
        sessionStorage.setItem("purchaseStatus", "paid");
    };

    return (
        <div className="flex flex-col items-center px-6 pt-20 pb-28 sm:pt-32 overflow-x-hidden">
            <div className="layout-container">

                {/* ─── Score Section (FREE) ─── */}
                <section className="text-center mb-14 fade-in-up flex flex-col items-center">
                    <p className="text-xs text-gold font-semibold tracking-[0.2em] uppercase mb-6">
                        Analysis Result
                    </p>

                    <p className="text-sm text-muted mb-3 font-medium">
                        당신의 방운(房運) 점수
                    </p>

                    <div className="relative inline-flex items-baseline">
                        <span
                            className="text-7xl sm:text-8xl font-bold leading-none tracking-tighter"
                            style={{ color: scoreColor }}
                        >
                            {result.score}
                        </span>
                        <span
                            className="text-2xl sm:text-3xl font-bold ml-1"
                            style={{ color: scoreColor }}
                        >
                            점
                        </span>
                    </div>

                    <p
                        className="mt-4 text-lg font-bold"
                        style={{ color: scoreColor }}
                    >
                        {scoreLabel}
                    </p>

                    {/* Score Bar */}
                    <div className="mt-8 w-full max-w-xs">
                        <div className="h-2 rounded-full bg-cream overflow-hidden">
                            <div
                                className="h-full rounded-full score-bar-fill"
                                style={
                                    {
                                        backgroundColor: scoreColor,
                                        "--score-width": `${result.score}%`,
                                    } as React.CSSProperties
                                }
                            />
                        </div>
                        <div className="flex justify-between mt-2 px-0.5">
                            <span className="text-[10px] font-medium text-muted/50 uppercase tracking-wider">Low</span>
                            <span className="text-[10px] font-medium text-muted/50 uppercase tracking-wider">High</span>
                        </div>
                    </div>
                </section>

                {/* ─── Summary (FREE) ─── */}
                <section className="mb-10 fade-in-up stagger-1">
                    <div className="p-6 sm:p-8 rounded-2xl glass-card text-center">
                        <p className="text-charcoal leading-relaxed text-base sm:text-lg font-medium">
                            {result.summary}
                        </p>
                    </div>
                </section>

                {/* ─── Good Points ─── */}
                <div className="space-y-8 mb-14">
                    {result.good_points.length > 0 && (
                        <section className="fade-in-up stagger-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-lg bg-score-green/10 flex items-center justify-center">
                                    <Sparkles className="w-3.5 h-3.5 text-score-green" strokeWidth={2} />
                                </div>
                                <h3 className="text-base font-bold text-charcoal">좋은 점</h3>
                            </div>
                            <div className="space-y-3">
                                {/* FREE: show only first point, PAID: show all */}
                                {(isPaid ? result.good_points : result.good_points.slice(0, 1)).map((point, i) => (
                                    <div
                                        key={i}
                                        className="p-5 rounded-xl glass-card"
                                    >
                                        <p className="text-sm text-charcoal/80 leading-relaxed">
                                            {point}
                                        </p>
                                    </div>
                                ))}
                                {/* Locked indicator for remaining good points */}
                                {!isPaid && result.good_points.length > 1 && (
                                    <div className="p-5 rounded-xl glass-card opacity-50 relative overflow-hidden">
                                        <div className="absolute inset-0 backdrop-blur-sm bg-cream/60 flex items-center justify-center z-10">
                                            <Lock className="w-4 h-4 text-muted mr-1.5" strokeWidth={1.5} />
                                            <span className="text-xs text-muted font-medium">
                                                +{result.good_points.length - 1}개 더 보기
                                            </span>
                                        </div>
                                        <p className="text-sm text-charcoal/30 leading-relaxed blur-sm select-none">
                                            상세 분석에서 더 많은 좋은 점을 확인하세요.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Bad Points - Locked for free, visible for paid */}
                    {result.bad_points.length > 0 && (
                        <section className="fade-in-up stagger-3">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-lg bg-score-amber/10 flex items-center justify-center">
                                    <AlertTriangle className="w-3.5 h-3.5 text-score-amber" strokeWidth={2} />
                                </div>
                                <h3 className="text-base font-bold text-charcoal">개선할 점</h3>
                                {!isPaid && (
                                    <span className="ml-auto text-xs text-muted flex items-center gap-1">
                                        <Lock className="w-3 h-3" strokeWidth={1.5} />
                                        상세 분석 필요
                                    </span>
                                )}
                            </div>
                            <div className="space-y-3">
                                {isPaid ? (
                                    result.bad_points.map((point, i) => (
                                        <div
                                            key={i}
                                            className="p-5 rounded-xl glass-card"
                                        >
                                            <p className="text-sm text-charcoal/80 leading-relaxed">
                                                {point}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    /* Blurred locked state */
                                    <div className="relative rounded-xl overflow-hidden">
                                        <div className="p-5 glass-card">
                                            <p className="text-sm text-charcoal/20 leading-relaxed blur-[6px] select-none pointer-events-none">
                                                방의 동북쪽 모서리에 기운이 정체되어 있어 순환이 필요합니다. 침대 방향이 문과 일직선상에 있어 기운의 직접적인 충돌이 발생할 수 있습니다.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>

                {/* ─── Recommendation Card ─── */}
                {item && (
                    <section className="mb-10 fade-in-up stagger-4">
                        <div className="p-6 sm:p-8 rounded-2xl glass-card border border-gold/15 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-[60px] -z-0" />

                            <div className="relative z-10">
                                <p className="text-xs text-gold font-semibold tracking-[0.15em] uppercase mb-5">
                                    비보 추천
                                </p>

                                <div className="flex items-start gap-5 mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-cream flex items-center justify-center shrink-0">
                                        <span className="text-3xl">{item.emoji}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-charcoal mb-1">
                                            {item.nameKo}
                                        </h4>
                                        <span className="text-xs text-gold font-semibold">
                                            {item.purposeKo}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-sm text-charcoal/70 leading-relaxed mb-2 italic">
                                    &ldquo;{item.description}&rdquo;
                                </p>

                                {/* Reason - only visible when paid */}
                                {isPaid ? (
                                    <>
                                        <div className="p-4 rounded-xl bg-cream/50 mb-4">
                                            <p className="text-sm text-charcoal leading-relaxed">
                                                {result.reason}
                                            </p>
                                        </div>
                                        {/* Detail Tip - paid exclusive */}
                                        <div className="p-4 rounded-xl bg-gold/5 border border-gold/10">
                                            <p className="text-xs text-gold font-semibold mb-1">💡 전문가 팁</p>
                                            <p className="text-sm text-charcoal/70 leading-relaxed">
                                                {item.detailTip}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="relative rounded-xl overflow-hidden">
                                        <div className="p-4 bg-cream/50">
                                            <p className="text-sm text-charcoal/20 leading-relaxed blur-[6px] select-none pointer-events-none">
                                                이 방에 특별히 필요한 이유와 배치 팁을 상세 분석에서 확인하세요.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* ─── Paywall CTA (Free users only) ─── */}
                {!isPaid && (
                    <section className="mb-14 fade-in-up stagger-5">
                        <button
                            onClick={handlePurchase}
                            className="w-full py-4.5 bg-charcoal text-offwhite rounded-2xl text-base font-semibold hover:bg-charcoal/90 transition-all duration-300 active:scale-[0.98] shadow-[0_8px_30px_-8px_rgba(0,0,0,0.25)] flex items-center justify-center gap-2.5"
                        >
                            <Eye className="w-5 h-5" strokeWidth={1.5} />
                            🔮 상세 분석 보기
                            <span className="text-offwhite/60 text-sm font-medium">₩1,900</span>
                        </button>
                        <p className="text-center text-xs text-muted mt-3">
                            개선할 점 · 비보 아이템 상세 · 전문가 배치 팁
                        </p>
                    </section>
                )}

                {/* ─── Paid Badge ─── */}
                {isPaid && (
                    <div className="mb-10 flex items-center justify-center gap-2 py-3 fade-in-up">
                        <div className="w-4 h-4 rounded-full bg-score-green/10 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-score-green" strokeWidth={2.5} />
                        </div>
                        <p className="text-xs text-score-green font-medium">
                            상세 분석이 해제되었습니다
                        </p>
                    </div>
                )}

                {/* ─── Actions ─── */}
                <section className="mb-14 text-center fade-in-up stagger-5">
                    <p className="text-xs text-muted mb-5 font-medium">공유 & 재진단</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-2 px-6 py-3 rounded-full border border-charcoal/10 text-sm font-medium text-charcoal hover:bg-cream/50 transition-all duration-200"
                        >
                            {copied ? (
                                <Check className="w-4 h-4 text-score-green" strokeWidth={2} />
                            ) : (
                                <Copy className="w-4 h-4" strokeWidth={1.5} />
                            )}
                            {copied ? "복사됨" : "링크 복사"}
                        </button>
                        <button
                            onClick={handleRetry}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gold/8 text-sm font-medium text-gold hover:bg-gold/15 transition-all duration-200"
                        >
                            <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
                            다시 진단
                        </button>
                    </div>
                </section>

                {/* ─── Footer Link ─── */}
                <div className="text-center pt-6 border-t border-charcoal/5">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-charcoal transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                        홈으로 돌아가기
                    </Link>
                </div>
            </div>
        </div>
    );
}
