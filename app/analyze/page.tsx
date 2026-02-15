"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { resizeImage, validateFile, isTossPlatform } from "@/lib/utils";
import { Upload, X, Compass, AlertCircle } from "lucide-react";

const LOADING_MESSAGES = [
    "공간의 에너지를 읽고 있습니다...",
    "명당(明堂)의 조건을 확인 중입니다...",
    "음양오행의 균형을 분석합니다...",
    "당신에게 필요한 비보(裨補)를 찾고 있습니다...",
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

        setSelectedFile(file);
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

        if (isToss) {
            try {
                const { tossLogin } = await import("@/lib/toss-sdk");
                const user = await tossLogin();
                if (user) {
                    sessionStorage.setItem("tossUserId", user.userId);
                }
            } catch {
                // Ignore login error
            }
        }

        setIsAnalyzing(true);
        setLoadingMsgIndex(0);
        setError(null);

        const msgInterval = setInterval(() => {
            setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 2200);

        try {
            const base64 = await resizeImage(file);

            const headers: Record<string, string> = {
                "Content-Type": "application/json",
            };

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
                throw new Error(data.error || "일시적인 오류가 발생했습니다.");
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
            <div className="flex flex-col items-center justify-center min-h-[90vh] px-6 relative overflow-hidden">
                {/* Aurora Background */}
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[80%] h-[80%] bg-gold/5 rounded-full blur-[100px] aura-glow" />
                </div>

                <div className="relative w-32 h-32 mb-12">
                    <div className="absolute inset-0 rounded-full border border-gold/30 compass-ring" />
                    <div className="absolute inset-4 rounded-full border border-gold/10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_15px_rgba(219,193,136,0.6)]" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center compass-needle">
                        <div className="w-[1px] h-14 bg-gradient-to-b from-gold to-transparent" />
                    </div>
                    {/* Cardinal Points */}
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] text-gold/80 font-medium">N</span>
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-gold/30">S</span>
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] text-gold/30">W</span>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-gold/30">E</span>
                </div>

                <div className="text-center space-y-4 max-w-xs mx-auto relative z-10">
                    <p key={loadingMsgIndex} className="text-base text-offwhite/90 font-light fade-in-up">
                        {LOADING_MESSAGES[loadingMsgIndex]}
                    </p>
                    <div className="w-full h-[1px] bg-white/10 overflow-hidden relative mt-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/50 to-transparent w-full h-full shimmer" />
                    </div>
                </div>

                {isToss && (
                    <div className="mt-12 w-full max-w-sm opacity-80 scale-95 origin-top transition-all">
                        {/* TossAdBanner placeholder or component */}
                    </div>
                )}
            </div>
        );
    }

    // ─── Main View ───
    return (
        <div className="flex flex-col items-center min-h-screen px-6 pt-24 pb-20 sm:pt-36 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none -z-10 bg-gradient-to-b from-transparent to-[#000]/40" />

            <div className="layout-container w-full max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-10 fade-in-up">
                    <div className="inline-flex items-center justify-center w-10 h-10 mb-4 rounded-full border border-white/5 bg-white/5">
                        <Upload className="w-4 h-4 text-gold/80" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-2xl font-medium text-offwhite mb-3 tracking-tight">
                        공간 업로드
                    </h1>
                    <p className="text-muted/60 text-sm font-light leading-relaxed">
                        밝은 곳에서 촬영한 방 사진을 올려주세요.
                    </p>
                </div>

                {/* Upload Area */}
                {!preview ? (
                    <div
                        className={`relative group aspect-[4/5] sm:aspect-square w-full rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden fade-in-up stagger-1 flex flex-col items-center justify-center gap-5
                        ${isDragging
                                ? "border-gold bg-gold/5 scale-[0.98]"
                                : "border-white/10 hover:border-gold/30 hover:bg-white/[0.02]"
                            }`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                    >
                        {/* Frame Corners */}
                        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20 group-hover:border-gold/40 transition-colors" />
                        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20 group-hover:border-gold/40 transition-colors" />
                        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20 group-hover:border-gold/40 transition-colors" />
                        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20 group-hover:border-gold/40 transition-colors" />

                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/5">
                            <Upload className="w-6 h-6 text-muted group-hover:text-gold transition-colors duration-300" strokeWidth={1.2} />
                        </div>
                        <p className="text-sm text-muted/60 font-light group-hover:text-offwhite/80 transition-colors">
                            터치하여 사진 선택
                        </p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                ) : (
                    <div className="fade-in-up w-full">
                        {/* Preview */}
                        <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-2xl overflow-hidden mb-6 border border-white/10 shadow-2xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={preview}
                                alt="Room Preview"
                                className="w-full h-full object-cover opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                            <button
                                onClick={resetUpload}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white/80 flex items-center justify-center hover:bg-black/60 transition-colors border border-white/10"
                            >
                                <X className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Analyze Button */}
                        <button
                            onClick={handleAnalyze}
                            className="w-full py-4 bg-gold text-[#111] rounded-xl text-base font-semibold hover:bg-gold-dark transition-all duration-300 active:scale-[0.98] shadow-[0_0_30px_-5px_rgba(219,193,136,0.2)] flex items-center justify-center gap-2"
                        >
                            <Compass className="w-5 h-5 opacity-80" strokeWidth={1.5} />
                            풍수 진단 시작
                        </button>
                    </div>
                )}

                {/* Subtle Error Toast */}
                {error && (
                    <div className="mt-6 mx-auto max-w-sm p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 fade-in-up">
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" strokeWidth={1.5} />
                        <div>
                            <p className="text-sm text-red-200 font-medium mb-1">분석할 수 없습니다</p>
                            <p className="text-xs text-red-200/60 leading-relaxed">{error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-xs text-red-300 hover:text-white underline decoration-red-300/30 underline-offset-4"
                        >
                            닫기
                        </button>
                    </div>
                )}

                {/* Privacy Text */}
                {!preview && (
                    <p className="mt-8 text-center text-[10px] text-muted/30 font-light tracking-wide fade-in-up stagger-2">
                        MyZari Privacy Protection<br />
                        <span className="opacity-50">이미지는 분석 직후 서버에서 영구 삭제됩니다.</span>
                    </p>
                )}
            </div>
        </div>
    );
}
