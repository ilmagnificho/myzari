import { VALID_KEYS } from "@/constants/items";

export interface AnalysisResult {
    score: number;
    summary: string;
    good_points: string[];
    bad_points: string[];
    recommendation_key: string;
    reason: string;
}

export function validateResponse(data: Record<string, unknown>): AnalysisResult {
    const result = { ...data } as Record<string, unknown>;

    // Validate recommendation_key
    if (
        typeof result.recommendation_key !== "string" ||
        !VALID_KEYS.includes(result.recommendation_key)
    ) {
        result.recommendation_key = "plant"; // safe fallback
    }

    // Clamp score
    const rawScore = Number(result.score);
    result.score = Math.max(0, Math.min(100, Math.round(isNaN(rawScore) ? 50 : rawScore)));

    // Validate arrays
    result.good_points = Array.isArray(result.good_points)
        ? (result.good_points as string[]).slice(0, 3)
        : [];
    result.bad_points = Array.isArray(result.bad_points)
        ? (result.bad_points as string[]).slice(0, 3)
        : [];

    // Validate strings
    result.summary = typeof result.summary === "string" ? result.summary : "풍수 진단이 완료되었습니다.";
    result.reason = typeof result.reason === "string" ? result.reason : "이 아이템으로 방의 기운을 개선해보세요.";

    return result as unknown as AnalysisResult;
}
