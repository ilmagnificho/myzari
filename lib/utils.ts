/**
 * Client-side image resize utility.
 * Resizes image to max 1024px on its longest edge, outputs as JPEG base64.
 */
export async function resizeImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const MAX_SIZE = 1024;
                let { width, height } = img;

                if (width > MAX_SIZE || height > MAX_SIZE) {
                    if (width > height) {
                        height = Math.round((height * MAX_SIZE) / width);
                        width = MAX_SIZE;
                    } else {
                        width = Math.round((width * MAX_SIZE) / height);
                        height = MAX_SIZE;
                    }
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Canvas context not available"));
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);

                // Get base64 without the data URL prefix
                const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
                const base64 = dataUrl.split(",")[1];
                resolve(base64);
            };
            img.onerror = () => reject(new Error("이미지를 불러올 수 없습니다."));
            img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error("파일을 읽을 수 없습니다."));
        reader.readAsDataURL(file);
    });
}

/**
 * Validate file type and size before processing.
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    if (!ALLOWED_TYPES.includes(file.type)) {
        return { valid: false, error: "JPEG, PNG, WebP 형식만 지원됩니다." };
    }

    if (file.size > MAX_SIZE) {
        return { valid: false, error: "파일 크기는 5MB 이하여야 합니다." };
    }

    return { valid: true };
}

/**
 * Build Coupang search URL for a given query.
 */
export function getCoupangUrl(searchQuery: string): string {
    return `https://www.coupang.com/np/search?q=${encodeURIComponent(searchQuery)}&channel=user&component=&eventCategory=SRP`;
}

/**
 * Get score color based on value.
 */
export function getScoreColor(score: number): string {
    if (score < 40) return "#D94F4F";
    if (score < 70) return "#C9A84C";
    return "#4A9D5B";
}

/**
 * Get score label based on value.
 */
export function getScoreLabel(score: number): string {
    if (score < 40) return "개선이 필요해요";
    if (score < 70) return "보통이에요";
    return "좋은 기운이에요";
}
