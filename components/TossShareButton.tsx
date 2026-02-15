"use client";

import { isTossPlatform, shareToss } from "@/lib/toss-sdk";
import { Share2 } from "lucide-react";

interface TossShareButtonProps {
    score?: number;
}

/**
 * Toss in-app share button.
 * Only renders when running inside the Toss mini-app.
 */
export default function TossShareButton({ score }: TossShareButtonProps) {
    const isToss = isTossPlatform();

    if (!isToss) return null;

    const handleShare = async () => {
        const title = "마이자리 - AI 풍수지리 방 진단";
        const description = score
            ? `내 방의 풍수 점수는 ${score}점! 당신의 방은 몇 점일까요?`
            : "AI가 진단하는 풍수지리 서비스. 내 방의 기운을 확인해보세요.";

        const success = await shareToss(
            title,
            description,
            "https://myzari.kr/og-image.png"
        );

        if (!success) {
            // Fallback: try native share API
            if (navigator.share) {
                try {
                    await navigator.share({
                        title,
                        text: description,
                        url: window.location.origin,
                    });
                } catch {
                    // User cancelled
                }
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0064FF]/8 text-sm font-medium text-[#0064FF] hover:bg-[#0064FF]/15 transition-all duration-200"
        >
            <Share2 className="w-4 h-4" strokeWidth={1.5} />
            토스 공유
        </button>
    );
}
