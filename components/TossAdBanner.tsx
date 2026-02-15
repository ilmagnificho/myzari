"use client";

import { useEffect, useState } from "react";
import { isTossPlatform, showAd } from "@/lib/toss-sdk";

interface TossAdBannerProps {
    /** Where the ad is being displayed */
    placement: "loading" | "result-bottom";
}

/**
 * Toss IAA Ad Banner component.
 * Only renders in Toss environment. Gracefully hidden otherwise.
 */
export default function TossAdBanner({ placement }: TossAdBannerProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isTossPlatform()) return;

        const loadAd = async () => {
            const shown = await showAd();
            setIsVisible(shown);
        };

        loadAd();
    }, [placement]);

    // Don't render anything if not in Toss or ad failed
    if (!isVisible) return null;

    return (
        <div className="w-full flex justify-center py-4">
            {/* Ad container — Toss IAA SDK will inject ad content here */}
            <div
                id={`toss-ad-${placement}`}
                className="w-full max-w-md min-h-[50px] rounded-xl bg-cream/30 flex items-center justify-center"
            >
                <p className="text-[10px] text-muted/40">AD</p>
            </div>
        </div>
    );
}
