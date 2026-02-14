"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        Kakao: any;
    }
}

export default function KakaoShareButton() {
    useEffect(() => {
        // Kakao SDK Init
        if (typeof window !== "undefined" && window.Kakao) {
            if (!window.Kakao.isInitialized()) {
                window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY);
            }
        }
    }, []);

    const handleShare = () => {
        if (typeof window !== "undefined" && window.Kakao) {
            if (!window.Kakao.isInitialized()) {
                window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY);
            }

            window.Kakao.Share.sendDefault({
                objectType: "feed",
                content: {
                    title: "마이자리 - AI 풍수지리 방 진단",
                    description: "내 방의 기운은 몇 점일까요? AI가 진단하고 비보(裨補) 솔루션을 드립니다.",
                    imageUrl: "https://myzari.kr/og-image.png", // Replace with actual OG image URL
                    link: {
                        mobileWebUrl: "https://myzari.kr",
                        webUrl: "https://myzari.kr",
                    },
                },
                buttons: [
                    {
                        title: "내 방 진단받기",
                        link: {
                            mobileWebUrl: "https://myzari.kr",
                            webUrl: "https://myzari.kr",
                        },
                    },
                ],
            });
        } else {
            alert("카카오톡 공유 기능을 불러오지 못했습니다.");
        }
    };

    return (
        <button
            onClick={handleShare}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#FEE500] text-[#000000] font-bold hover:bg-[#FDD835] transition-all duration-300 touch-target flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
        >
            <span className="text-xl">💬</span> 카카오톡 공유
        </button>
    );
}
