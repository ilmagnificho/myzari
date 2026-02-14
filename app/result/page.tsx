"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BIBO_ITEMS } from "@/constants/items";
import { getCoupangUrl, getScoreColor, getScoreLabel } from "@/lib/utils";
import type { AnalysisResult } from "@/lib/validation";
import { Copy, Check, RotateCcw, ExternalLink, ArrowLeft, Sparkles, AlertTriangle } from "lucide-react";

export default function ResultPage() {
    const router = useRouter();
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const stored = sessionStorage.getItem("analysisResult");
        if (!stored) {
            router.push("/analyze");
            return;
        }

        try {
            setResult(JSON.parse(stored));
        } catch {
            router.push("/analyze");
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
    const coupangUrl = item ? getCoupangUrl(item.searchQuery) : "#";

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
        router.push("/analyze");
    };

    return (
        <div className="flex flex-col items-center px-6 pt-20 pb-28 sm:pt-32 overflow-x-hidden">
            <div className="layout-container">

                {/* ─── Score Section ─── */}
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

                {/* ─── Summary ─── */}
                <section className="mb-10 fade-in-up stagger-1">
                    <div className="p-6 sm:p-8 rounded-2xl glass-card text-center">
                        <p className="text-charcoal leading-relaxed text-base sm:text-lg font-medium">
                            {result.summary}
                        </p>
                    </div>
                </section>

                {/* ─── Diagnosis ─── */}
                <div className="space-y-8 mb-14">
                    {/* Good Points */}
                    {result.good_points.length > 0 && (
                        <section className="fade-in-up stagger-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-lg bg-score-green/10 flex items-center justify-center">
                                    <Sparkles className="w-3.5 h-3.5 text-score-green" strokeWidth={2} />
                                </div>
                                <h3 className="text-base font-bold text-charcoal">좋은 점</h3>
                            </div>
                            <div className="space-y-3">
                                {result.good_points.map((point, i) => (
                                    <div
                                        key={i}
                                        className="p-5 rounded-xl glass-card"
                                    >
                                        <p className="text-sm text-charcoal/80 leading-relaxed">
                                            {point}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Bad Points */}
                    {result.bad_points.length > 0 && (
                        <section className="fade-in-up stagger-3">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-lg bg-score-amber/10 flex items-center justify-center">
                                    <AlertTriangle className="w-3.5 h-3.5 text-score-amber" strokeWidth={2} />
                                </div>
                                <h3 className="text-base font-bold text-charcoal">개선할 점</h3>
                            </div>
                            <div className="space-y-3">
                                {result.bad_points.map((point, i) => (
                                    <div
                                        key={i}
                                        className="p-5 rounded-xl glass-card"
                                    >
                                        <p className="text-sm text-charcoal/80 leading-relaxed">
                                            {point}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* ─── Recommendation Card ─── */}
                {item && (
                    <section className="mb-16 fade-in-up stagger-4">
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

                                <div className="p-4 rounded-xl bg-cream/50 mb-6">
                                    <p className="text-sm text-charcoal leading-relaxed">
                                        {result.reason}
                                    </p>
                                </div>

                                <a
                                    href={coupangUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-4 bg-charcoal text-offwhite rounded-xl text-center text-base font-semibold hover:bg-charcoal/90 transition-all duration-300 active:scale-[0.98] shadow-[0_6px_20px_-6px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2"
                                >
                                    최저가로 기운 채우기
                                    <ExternalLink className="w-4 h-4" strokeWidth={1.8} />
                                </a>
                                <p className="text-[10px] text-muted font-medium tracking-[0.2em] uppercase mt-3 text-center opacity-40">
                                    Coupang Partners
                                </p>
                            </div>
                        </div>
                    </section>
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
