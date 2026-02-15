"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { resizeImage, validateFile, isTossPlatform } from "@/lib/utils";
import { Upload, X, Compass } from "lucide-react";

const LOADING_MESSAGES = [
    "기의 흐름을 읽는 중...",
    "명당 조건을 분석 중...",
    "음양의 균형을 확인 중...",
    "비보 아이템을 찾는 중...",
];

export default function AnalyzePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const isToss = isTossPlatform();

    const handleFile = useCallback(async (file: File) => {
        setError(null);

        const validation = validateFile(file);
        if (!validation.valid) {
            setError(validation.error || "파일을 처리할 수 없습니다.");
            return;
        }

        // Store file reference for later use
        setSelectedFile(file);

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        },
        [handleFile]
    );

    const handleAnalyze = async () => {
        const file = selectedFile || fileInputRef.current?.files?.[0];
        if (!file) {
            setError("사진을 먼저 선택해주세요.");
            return;
        }

        // Toss login check (optional, for user tracking)
        if (isToss) {
            try {
                const { tossLogin } = await import("@/lib/toss-sdk");
                const user = await tossLogin();
                if (user) {
                    sessionStorage.setItem("tossUserId", user.userId);
                }
            } catch {
                // Continue without login - non-blocking
            }
        }

        setIsAnalyzing(true);
        setLoadingMsgIndex(0);
        setError(null);

        const msgInterval = setInterval(() => {
            setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 2000);

        try {
            const base64 = await resizeImage(file);

            const headers: Record<string, string> = {
                "Content-Type": "application/json",
            };

            // Add Toss user ID header if available
            const tossUserId = sessionStorage.getItem("tossUserId");
            if (tossUserId) {
                headers["X-Toss-User-Id"] = tossUserId;
            }

            const response = await fetch("/api/analyze", {
                method: "POST",
                headers,
                body: JSON.stringify({ image: base64 }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "분석에 실패했습니다.");
            }

            const result = await response.json();
            sessionStorage.setItem("analysisResult", JSON.stringify(result));
            router.push("/result");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "분석 중 문제가 발생했습니다. 다시 시도해주세요."
            );
        } finally {
            clearInterval(msgInterval);
            setIsAnalyzing(false);
        }
    };

    const resetUpload = () => {
        setPreview(null);
        setSelectedFile(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // ─── Loading State ───
    if (isAnalyzing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
                <div className="relative w-28 h-28 mb-10">
                    <div className="absolute inset-0 rounded-full border border-gold/20 compass-ring" />
                    <div className="absolute inset-3 rounded-full border border-gold/10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center compass-needle">
                        <div className="w-0.5 h-10 bg-gradient-to-b from-score-red to-charcoal/60 rounded-full" />
                    </div>
                    <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-gold/60">N</span>
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-charcoal/20">S</span>
                    <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] text-charcoal/20">W</span>
                    <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-charcoal/20">E</span>
                </div>
                <p className="text-base font-medium text-charcoal mb-3">
                    {LOADING_MESSAGES[loadingMsgIndex]}
                </p>
                <div className="w-40 h-1 rounded-full bg-cream overflow-hidden">
                    <div className="h-full bg-gold shimmer rounded-full" />
                </div>
                {/* IAA Ad placeholder during loading (Toss only) */}
                {isToss && (
                    <div className="mt-8 w-full max-w-sm">
                        {/* TossAdBanner will be rendered here when SDK is available */}
                    </div>
                )}
            </div>
        );
    }

    // ─── Main View ───
    return (
        <div className="flex flex-col items-center px-6 pt-20 pb-24 sm:pt-32">
            <div className="layout-container">
                {/* Header */}
                <div className="text-center mb-10 fade-in-up">
                    <p className="text-xs text-gold font-semibold tracking-[0.2em] uppercase mb-3">
                        Upload
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mb-3 tracking-tight">
                        방 사진을 올려주세요
                    </h1>
                    <p className="text-muted text-sm sm:text-base leading-relaxed">
                        AI가 공간의 기운을 읽어<br />최적의 비보 솔루션을 찾아드립니다.
                    </p>
                </div>

                <div className="w-full max-w-lg mx-auto">
                    {/* Upload Area */}
                    {!preview ? (
                        <div
                            className={`relative border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-300 fade-in-up stagger-1 ${isDragging
                                ? "border-gold bg-gold/5 scale-[1.01]"
                                : "border-charcoal/10 hover:border-gold/40 hover:bg-cream/30"
                                }`}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-cream flex items-center justify-center">
                                    <Upload className="w-6 h-6 text-gold" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="font-semibold text-charcoal mb-1 text-sm">
                                        사진을 촬영하거나 선택하세요
                                    </p>
                                    <p className="text-xs text-muted">
                                        JPEG, PNG, WebP · 최대 5MB
                                    </p>
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                capture="environment"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    ) : (
                        <div className="fade-in-up">
                            {/* Preview */}
                            <div className="relative rounded-2xl overflow-hidden mb-5 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.1)]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={preview}
                                    alt="업로드한 방 사진"
                                    className="w-full h-auto max-h-[380px] object-cover"
                                />
                                <button
                                    onClick={resetUpload}
                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-charcoal/50 text-white flex items-center justify-center hover:bg-charcoal/70 transition-colors backdrop-blur-sm"
                                >
                                    <X className="w-4 h-4" strokeWidth={2} />
                                </button>
                            </div>

                            {/* Analyze Button */}
                            <button
                                onClick={handleAnalyze}
                                className="w-full py-4 bg-charcoal text-offwhite rounded-xl text-base font-semibold hover:bg-charcoal/90 transition-all duration-300 active:scale-[0.98] touch-target shadow-[0_6px_20px_-6px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2"
                            >
                                <Compass className="w-5 h-5" strokeWidth={1.5} />
                                풍수 진단 시작
                            </button>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="mt-5 p-4 rounded-xl bg-score-red/8 border border-score-red/15 text-center">
                            <p className="text-score-red text-sm font-medium">{error}</p>
                            <button
                                onClick={resetUpload}
                                className="mt-2 text-sm text-muted underline hover:text-charcoal transition-colors"
                            >
                                다시 시도하기
                            </button>
                        </div>
                    )}

                    {/* Privacy Badge */}
                    <div className="mt-8 flex items-center justify-center gap-2 py-3 fade-in-up stagger-2">
                        <div className="w-4 h-4 rounded-full bg-score-green/10 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-score-green" />
                        </div>
                        <p className="text-xs text-muted">
                            이미지는 분석 즉시 서버에서 영구 삭제됩니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
