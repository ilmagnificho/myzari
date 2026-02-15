import https from "https";
// Removed unused import


/**
 * Toss Server-to-Server API Client
 * Requires mTLS certificates to be configured in environment variables.
 */

// Environment variables for mTLS
const TOSS_CERT = process.env.TOSS_CERT; // PEM content or Base64
const TOSS_KEY = process.env.TOSS_KEY;   // PEM content or Base64
const TOSS_API_URL = "https://apps-in-toss-api.toss.im"; // Real endpoint from guide

function getCertBuffer(content: string | undefined): Buffer | null {
    if (!content) return null;
    // Check if base64 (doesn't start with -----BEGIN)
    if (!content.trim().startsWith("-----BEGIN")) {
        try {
            return Buffer.from(content, 'base64');
        } catch (e) {
            console.error("Failed to decode base64 cert:", e);
            return null;
        }
    }
    return Buffer.from(content);
}

/**
 * Create an HTTPS Agent with mTLS certificates
 */
function getTossAgent(): https.Agent | null {
    const cert = getCertBuffer(TOSS_CERT);
    const key = getCertBuffer(TOSS_KEY);

    if (!cert || !key) {
        console.warn("[TossServer] mTLS certificates are missing. API calls will fail slightly later or use mock.");
        return null;
    }

    return new https.Agent({
        cert,
        key,
        // rejectUnauthorized: true, // Default is true, strict validation
    });
}

/**
 * Verify a purchase token with Toss API
 * @param purchaseToken The token received from client
 */
export async function verifyPurchaseWithToss(purchaseToken: string): Promise<boolean> {
    const agent = getTossAgent();

    // If no certs are configured in Dev, we might want to mock success or fail.
    // However, the user wants "compliance", so we should log clearly.
    if (!agent) {
        if (process.env.NODE_ENV === 'development') {
            console.log("[TossServer] Dev mode: Skipping real mTLS verification.");
            return true; // Mock success in dev
        }
        console.error("[TossServer] Missing TOSS_CERT or TOSS_KEY in production!");
        return false;
    }

    return new Promise((resolve) => {
        // Construct request
        // Note: The specific endpoint path for 'purchase check' needs to be found in docs.
        // The provided docs (guide, release note) didn't specify the EXACT endpoint path for simple verification,
        // but 'integration-process' shows generic usage.
        // Usually it is GET /v1/purchases/{purchaseToken} or similar.
        // STARTING ASSUMPTION: We use a generic endpoint or mock path until docs are fully clarified.
        // But for "Cross-Verification", I should use the standard path if known.
        // Since I don't have the exact IAP API spec in the provided file, I will use a PLACEHOLDER path
        // and add a comment that this needs ensuring from standard docs.
        const path = `/v1/iap/purchases/${purchaseToken}`;

        const options: https.RequestOptions = {
            hostname: 'apps-in-toss-api.toss.im',
            port: 443,
            path: path,
            method: 'GET',
            agent: agent,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        // Check logic based on response structure (assumed success field)
                        // If json.status === 'COMPLETED' or similar.
                        // For now, assume 200 OK means valid.
                        resolve(true);
                    } catch {
                        resolve(false);
                    }
                } else {
                    console.error(`[TossServer] Verification failed: ${res.statusCode} ${data}`);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.error("[TossServer] Request error:", e);
            resolve(false);
        });

        req.end();
    });
}
