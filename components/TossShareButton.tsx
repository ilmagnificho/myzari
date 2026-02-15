"use client";

import { useEffect, useState } from "react";
import { isTossPlatform, shareToss } from "@/lib/toss-sdk";
import { Share2 } from "lucide-react";

interface TossShareButtonProps {
    score: number;
}

export default function TossShareButton({ score }: TossShareButtonProps) {
    const [isToss, setIsToss] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (isTossPlatform()) {
            setIsToss(true);
        }
    }, []);

    const handleShare = async () => {
        if (isToss) {
            await shareToss(
                `내 방의 풍수지리 점수는 ${score}점!`,
                "당신의 방에도 흐르는 기운이 있을까요? 지금 바로 확인해보세요.",
                "https://myzari.kr/og-image.png"
            );
        } else {
            // Web Share API Fallback
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: `내 방의 풍수지리 점수는 ${score}점!`,
                        text: "당신의 방에도 흐르는 기운이 있을까요? 확인해보세요.",
                        url: window.location.href,
                    });
                } catch {
                    // Ignore share error
                }
            } else {
                alert("공유하기를 지원하지 않는 브라우저입니다. 링크를 복사해주세요.");
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-gold/10 border border-gold/20 text-gold font-medium text-sm hover:bg-gold/20 transition-all duration-300 active:scale-[0.98]"
        >
            <Share2 className="w-4 h-4" strokeWidth={1.5} />
            {isToss ? "토스로 공유" : "결과 공유"}
        </button>
    );
}
