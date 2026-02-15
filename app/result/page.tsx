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
} from "lucide-react";
import PaywallCTA from "@/components/PaywallCTA";
import TossShareButton from "@/components/TossShareButton";
import TossAdBanner from "@/components/TossAdBanner";

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

        const purchaseStatus = sessionStorage.getItem("purchaseStatus");
        if (purchaseStatus === "paid") {
            setIsPaid(true);
        }
    }, [router]);

    if (!result) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#111]">
                <div className="w-10 h-10 border border-gold/30 border-t-gold rounded-full animate-spin" />
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

    const handlePurchaseSuccess = () => {
        setIsPaid(true);
        sessionStorage.setItem("purchaseStatus", "paid");
    };

    return (
        <div className="flex flex-col items-center min-h-screen px-6 pt-24 pb-28 sm:pt-36 overflow-x-hidden relative">
            {/* Background Glow */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-gold/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold-dark/5 rounded-full blur-[100px]" />
            </div>

            <div className="layout-container w-full max-w-md mx-auto">

                {/* ─── Score Section (FREE) ─── */}
                <section className="text-center mb-16 fade-in-up flex flex-col items-center">
                    <p className="text-[10px] text-gold/80 font-medium tracking-[0.25em] uppercase mb-8 opacity-80">
                        Analysis Result
                    </p>

                    <div className="relative inline-flex flex-col items-center">
                        <span
                            className="text-[6rem] sm:text-[7rem] font-light leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60"
                            style={{ textShadow: `0 0 40px ${scoreColor}40` }}
                        >
                            {result.score}
                        </span>
                        <span className="text-xl sm:text-2xl font-light text-muted/60 mt-2">
                            / 100
                        </span>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-3 px-5 py-2.5 rounded-full border border-white/5 bg-white/[0.03]">
                        <div
                            className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
                            style={{ backgroundColor: scoreColor, color: scoreColor }}
                        />
                        <p className="text-lg font-medium text-offwhite tracking-tight">
                            {scoreLabel}
                        </p>
                    </div>

                    {/* Score Bar */}
                    <div className="mt-10 w-full max-w-xs opacity-80">
                        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                            <div
                                className="h-full rounded-full score-bar-fill shadow-[0_0_10px_currentColor]"
                                style={{
                                    backgroundColor: scoreColor,
                                    color: scoreColor,
                                    "--score-width": `${result.score}%`,
                                } as React.CSSProperties}
                            />
                        </div>
                        <div className="flex justify-between mt-2 px-0.5">
                            <span className="text-[10px] text-muted/30 uppercase tracking-widest">Low</span>
                            <span className="text-[10px] text-muted/30 uppercase tracking-widest">High</span>
                        </div>
                    </div>
                </section>

                {/* ─── Summary (FREE) ─── */}
                <section className="mb-12 fade-in-up stagger-1">
                    <div className="p-8 rounded-2xl glass-card text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                        <p className="text-offwhite/90 leading-relaxed text-base sm:text-lg font-light">
                            &quot;{result.summary}&quot;
                        </p>
                    </div>
                </section>

                {/* ─── Good Points ─── */}
                <div className="space-y-10 mb-16">
                    {result.good_points.length > 0 && (
                        <section className="fade-in-up stagger-2">
                            <div className="flex items-center gap-3 mb-5 pl-1">
                                <Sparkles className="w-4 h-4 text-gold/80" strokeWidth={1.5} />
                                <h3 className="text-sm font-medium text-offwhite/80 tracking-wide">좋은 점</h3>
                            </div>
                            <div className="space-y-3">
                                {/* FREE: show only first point, PAID: show all */}
                                {(isPaid ? result.good_points : result.good_points.slice(0, 1)).map((point, i) => (
                                    <div
                                        key={i}
                                        className="p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                                    >
                                        <p className="text-sm text-offwhite/80 leading-relaxed font-light">
                                            {point}
                                        </p>
                                    </div>
                                ))}
                                {/* Locked indicator for remaining good points */}
                                {!isPaid && result.good_points.length > 1 && (
                                    <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] relative overflow-hidden group">
                                        <div className="absolute inset-0 backdrop-blur-[2px] bg-[#111]/40 flex items-center justify-center z-10 transition-backdrop-filter duration-500 group-hover:backdrop-blur-[1px]">
                                            <Lock className="w-3.5 h-3.5 text-muted/50 mr-2" strokeWidth={1.5} />
                                            <span className="text-xs text-muted/50 font-medium">
                                                +{result.good_points.length - 1}개 더 보기
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted/20 leading-relaxed blur-sm select-none">
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
                            <div className="flex items-center justify-between mb-5 pl-1">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-4 h-4 text-muted/60" strokeWidth={1.5} />
                                    <h3 className="text-sm font-medium text-offwhite/80 tracking-wide">개선할 점</h3>
                                </div>
                                {!isPaid && (
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-muted/60">
                                        <Lock className="w-2.5 h-2.5" strokeWidth={1.5} />
                                        Locked
                                    </span>
                                )}
                            </div>
                            <div className="space-y-3">
                                {isPaid ? (
                                    result.bad_points.map((point, i) => (
                                        <div
                                            key={i}
                                            className="p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                                        >
                                            <p className="text-sm text-offwhite/80 leading-relaxed font-light">
                                                {point}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    /* Blurred locked state */
                                    <div className="relative rounded-xl overflow-hidden border border-white/5">
                                        <div className="p-5 bg-white/[0.02]">
                                            <p className="text-sm text-muted/20 leading-relaxed blur-[5px] select-none pointer-events-none">
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
                    <section className="mb-12 fade-in-up stagger-4">
                        <div className="p-8 rounded-2xl glass-card-gold bg-[#161618]/60 relative overflow-hidden">
                            {/* Decorative glow */}
                            <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-gold/5 rounded-full blur-[60px]" />

                            <div className="relative z-10">
                                <p className="text-[10px] text-gold font-medium tracking-[0.2em] uppercase mb-6 opacity-80">
                                    Recommended Solution
                                </p>

                                <div className="flex items-start gap-6 mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/10 flex items-center justify-center shrink-0 text-3xl shadow-[0_8px_16px_-4px_rgba(219,193,136,0.1)]">
                                        {item.emoji}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-medium text-offwhite mb-1.5">
                                            {item.nameKo}
                                        </h4>
                                        <span className="text-xs text-gold/80 font-medium tracking-wide">
                                            {item.purposeKo}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-sm text-offwhite/70 leading-relaxed mb-6 italic font-light pl-4 border-l-2 border-gold/20">
                                    &ldquo;{item.description}&rdquo;
                                </p>

                                {/* Reason - only visible when paid */}
                                {isPaid ? (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                                        <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                                            <p className="text-sm text-offwhite/80 leading-relaxed font-light">
                                                {result.reason}
                                            </p>
                                        </div>
                                        {/* Detail Tip - paid exclusive */}
                                        <div className="p-5 rounded-xl bg-gold/5 border border-gold/10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs text-gold font-semibold">💡 Expert Tip</span>
                                            </div>
                                            <p className="text-sm text-offwhite/80 leading-relaxed font-light">
                                                {item.detailTip}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative rounded-xl overflow-hidden border border-white/5">
                                        <div className="p-5 bg-white/[0.02]">
                                            <p className="text-sm text-muted/20 leading-relaxed blur-[5px] select-none pointer-events-none">
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
                    <section className="mb-16 fade-in-up stagger-5">
                        <PaywallCTA onPurchaseSuccess={handlePurchaseSuccess} />
                    </section>
                )}

                {/* ─── Paid Badge ─── */}
                {isPaid && (
                    <div className="mb-12 flex items-center justify-center gap-2 py-3 fade-in-up px-4 rounded-full bg-green-500/10 border border-green-500/20 max-w-fit mx-auto">
                        <Check className="w-3.5 h-3.5 text-green-400" strokeWidth={2} />
                        <p className="text-xs text-green-400 font-medium tracking-wide">
                            상세 분석이 해제되었습니다
                        </p>
                    </div>
                )}

                {/* ─── Actions ─── */}
                <section className="mb-16 text-center fade-in-up stagger-5">
                    <div className="flex gap-3 justify-center">
                        <TossShareButton score={result.score} />

                        <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-offwhite hover:bg-white/10 transition-all duration-300"
                        >
                            {copied ? (
                                <Check className="w-4 h-4 text-green-400" strokeWidth={1.5} />
                            ) : (
                                <Copy className="w-4 h-4 opacity-70" strokeWidth={1.5} />
                            )}
                            {copied ? "복사완료" : "링크복사"}
                        </button>
                    </div>

                    <button
                        onClick={handleRetry}
                        className="mt-6 flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-muted/50 hover:text-offwhite transition-colors duration-300 mx-auto"
                    >
                        <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
                        다시 진단하기
                    </button>
                </section>

                {/* ─── IAA Ad (Toss only) ─── */}
                {isToss && (
                    <section className="mb-12">
                        <TossAdBanner placement="result-bottom" />
                    </section>
                )}

                {/* ─── Footer Link ─── */}
                <div className="text-center pt-8 border-t border-white/5">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs text-muted/50 hover:text-offwhite transition-colors tracking-wide"
                    >
                        <ArrowLeft className="w-3 h-3" strokeWidth={1.5} />
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
