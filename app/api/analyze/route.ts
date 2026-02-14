import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { ANALYSIS_SYSTEM_PROMPT } from "@/lib/prompts";
import { validateResponse } from "@/lib/validation";
import type { AnalysisResult } from "@/lib/validation";

export async function POST(request: NextRequest) {
    try {
        const { image } = await request.json();

        if (!image || typeof image !== "string") {
            return NextResponse.json(
                { error: "이미지가 필요합니다." },
                { status: 400 }
            );
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey || apiKey === "sk-your-api-key-here" || apiKey.length < 20) {
            return NextResponse.json(
                { error: "OpenAI API 키가 설정되지 않았습니다. .env.local 파일에 유효한 OPENAI_API_KEY를 입력해주세요." },
                { status: 500 }
            );
        }

        let analysisResult: AnalysisResult | null = null;
        let lastError: Error | null = null;

        // Try up to 2 times (initial + 1 retry)
        for (let attempt = 0; attempt < 2; attempt++) {
            try {
                const response = await openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [
                        {
                            role: "system",
                            content: ANALYSIS_SYSTEM_PROMPT,
                        },
                        {
                            role: "user",
                            content: [
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: `data:image/jpeg;base64,${image}`,
                                        detail: "low",
                                    },
                                },
                                {
                                    type: "text",
                                    text: "이 방의 풍수를 분석해주세요.",
                                },
                            ],
                        },
                    ],
                    max_tokens: 800,
                    temperature: 0.7,
                });

                const content = response.choices[0]?.message?.content;
                if (!content) {
                    throw new Error("AI 응답이 비어있습니다.");
                }

                // Try to parse JSON (handle potential markdown fences)
                const cleanContent = content
                    .replace(/```json\s*/g, "")
                    .replace(/```\s*/g, "")
                    .trim();

                const parsed = JSON.parse(cleanContent);
                analysisResult = validateResponse(parsed);
                break; // Success, exit retry loop
            } catch (err) {
                lastError = err instanceof Error ? err : new Error(String(err));
                // If this was the first attempt with a parse error, retry
                if (attempt === 0) {
                    continue;
                }
            }
        }

        if (!analysisResult) {
            console.error("Analysis failed after retries:", lastError);
            return NextResponse.json(
                { error: "분석 중 문제가 발생했습니다. 다시 시도해주세요." },
                { status: 500 }
            );
        }

        return NextResponse.json(analysisResult);
    } catch (error) {
        console.error("API route error:", error);
        const errMsg = error instanceof Error ? error.message : String(error);
        if (errMsg.includes("401") || errMsg.includes("Incorrect API key")) {
            return NextResponse.json(
                { error: "OpenAI API 키가 유효하지 않습니다. .env.local을 확인해주세요." },
                { status: 500 }
            );
        }
        if (errMsg.includes("429") || errMsg.includes("Rate limit")) {
            return NextResponse.json(
                { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
                { status: 429 }
            );
        }
        return NextResponse.json(
            { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
            { status: 500 }
        );
    }
}
