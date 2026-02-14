# MyZari (마이자리) - Master PRD v2.0
> AI 풍수지리 방 진단 서비스 | myzari.kr
> Last Updated: 2025-02-14

---

## 0. Revision Notes (v1 → v2 변경사항)

| # | 항목 | v1 문제점 | v2 개선 |
|---|------|-----------|---------|
| 1 | **환경변수/보안** | OpenAI API Key 관리 언급 없음 | `.env.local` 관리 + Vercel 환경변수 설정 명시 |
| 2 | **에러 핸들링** | AI 응답 실패 시 UX 없음 | Fallback UI + 재시도 로직 추가 |
| 3 | **이미지 처리** | 파일 크기/포맷 제한 없음 | 5MB 제한, JPEG/PNG/WebP, 클라이언트 리사이즈 명시 |
| 4 | **SEO/OG** | 언급 없음 | 메타태그, OG 이미지, 카카오톡 공유 최적화 추가 |
| 5 | **쿠팡 파트너스** | Search URL만 사용 | 파트너스 PID 파라미터 + 딥링크 구조 추가 |
| 6 | **분석 결과 공유** | 없음 | 결과 카드 이미지 생성 + SNS 공유 기능 |
| 7 | **모바일 UX** | "Mobile-first" 선언만 | 구체적 브레이크포인트 + 터치 타겟 사이즈 명시 |
| 8 | **데이터/분석** | 없음 | Vercel Analytics 또는 GA4 이벤트 트래킹 |
| 9 | **Rate Limiting** | 없음 | API 호출 제한 (IP당 일 10회) 추가 |
| 10 | **비보 아이템** | 8개 고정 | 10개로 확장 (공기청정기, 무드등 추가) |
| 11 | **DB** | 없음 (Stateless) | Supabase 선택적 도입 (분석 로그, 방문 통계) |
| 12 | **법적 고지** | 쿠팡 파트너스 문구만 | 개인정보처리방침 + 면책조항 추가 |

---

## 1. Role Context

```
You are a Senior Full-Stack Developer and "Korean Pungsu (Geomancy)" Expert
acting as the CTO for Tetra Corp.

Build a high-performance, profitable MVP for "MyZari" using Next.js and Tailwind CSS.
```

### Communication Protocol
- **Thinking & Code:** English (token optimization)
- **UI & User-facing text:** Natural Korean
- **Reports to CEO:** Korean (Polite/Formal)

---

## 2. Project Overview

- **Service Name:** MyZari (마이자리) - AI 풍수지리 방 진단
- **Domain:** `myzari.kr`
- **Target:** 100% Korean market, mobile-first
- **Vibe:** Modern Zen - Clean, Trustworthy, Korean tradition reinterpreted
- **Core Feature:** Room photo upload → AI Pungsu diagnosis → Recommend ONE remedial item from fixed list

---

## 3. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 14+ (App Router) | TypeScript required |
| Styling | Tailwind CSS v3 | Mobile-first, custom theme |
| AI | OpenAI GPT-4o (Vision) | via API route (server-side only) |
| Hosting | Vercel | Free tier for MVP |
| DB (Optional) | Supabase (Free tier) | Analysis logs, visit stats |
| Analytics | Vercel Analytics or GA4 | Conversion tracking |
| Image Optimization | Next.js Image + client-side resize | Max 5MB, WebP preferred |

---

## 4. Project Context & Business Logic

### 4.1 The "Fixed Recommendation Strategy"

We use a **pre-selected item list** instead of dynamic affiliate link generation.

**Why?**
- No broken links (search URLs are always valid)
- Higher conversion (curated high-demand items)
- Simpler MVP (no complex API integration)
- Easier revenue tracking (fixed set of links)

### 4.2 Revenue Model

- **Primary:** Coupang Partners affiliate commission
- **Link Format:** `https://link.coupang.com/a/XXXXXX` (Partners short link preferred)
- **Fallback:** `https://www.coupang.com/np/search?q={query}&channel=user&component=&eventCategory=SRP` with `subId` tracking parameter
- **Legal Requirement:** Footer disclaimer on every page with affiliate link

---

## 5. Constants: The "Bib-o (비보)" Item List

> Define as `constants/items.ts` - this is the single source of truth.

```typescript
// constants/items.ts
export interface BiboItem {
  key: string;
  nameKo: string;
  searchQuery: string;
  purpose: string;
  purposeKo: string;
  emoji: string;
  description: string; // One-line Korean description for result card
}

export const BIBO_ITEMS: Record<string, BiboItem> = {
  sunflower: {
    key: "sunflower",
    nameKo: "황금 해바라기 액자",
    searchQuery: "해바라기액자",
    purpose: "Wealth",
    purposeKo: "재물운 상승",
    emoji: "🌻",
    description: "황금빛 해바라기는 재물의 기운을 끌어당기는 대표 풍수 아이템입니다.",
  },
  plant: {
    key: "plant",
    nameKo: "공기정화 식물 (금전수)",
    searchQuery: "금전수",
    purpose: "Vitality",
    purposeKo: "생기 보충",
    emoji: "🪴",
    description: "살아있는 식물은 정체된 기운을 순환시키고 생기를 불어넣습니다.",
  },
  light: {
    key: "light",
    nameKo: "코너 스탠드 조명",
    searchQuery: "장스탠드",
    purpose: "Yang Energy",
    purposeKo: "양기 보충",
    emoji: "💡",
    description: "어두운 구석은 음기가 정체됩니다. 빛으로 양기를 채워야 합니다.",
  },
  curtain: {
    key: "curtain",
    nameKo: "현관/방문 가림막 커튼",
    searchQuery: "가림막커튼",
    purpose: "Blocking Bad Energy",
    purposeKo: "살기 차단",
    emoji: "🪟",
    description: "문을 통해 들어오는 직선 기운(살기)을 부드럽게 분산시킵니다.",
  },
  chime: {
    key: "chime",
    nameKo: "현관 풍경종",
    searchQuery: "현관풍경",
    purpose: "Sound Purification",
    purposeKo: "맑은 기운",
    emoji: "🔔",
    description: "맑은 소리는 탁한 기운을 깨뜨리고 공간을 정화합니다.",
  },
  poster: {
    key: "poster",
    nameKo: "감성 패브릭 포스터",
    searchQuery: "패브릭포스터",
    purpose: "Covering/Softening",
    purposeKo: "비보 (가림)",
    emoji: "🖼️",
    description: "거울, 빈 벽, 흉한 것을 가려 기운의 흐름을 안정시킵니다.",
  },
  diffuser: {
    key: "diffuser",
    nameKo: "천연 아로마 디퓨저",
    searchQuery: "아로마디퓨저",
    purpose: "Scent Purification",
    purposeKo: "공간 정화",
    emoji: "🕯️",
    description: "천연 향은 공간의 탁한 기운을 정화하고 안정감을 줍니다.",
  },
  bedding: {
    key: "bedding",
    nameKo: "호텔식 화이트 침구",
    searchQuery: "호텔침구",
    purpose: "Health/Sleep",
    purposeKo: "건강운 강화",
    emoji: "🛏️",
    description: "깨끗한 침구는 수면의 질을 높이고 건강운을 회복시킵니다.",
  },
  air_purifier: {
    key: "air_purifier",
    nameKo: "공기청정기",
    searchQuery: "공기청정기",
    purpose: "Air Purification",
    purposeKo: "탁기 제거",
    emoji: "🌬️",
    description: "탁한 공기는 기의 흐름을 방해합니다. 과학적으로 공기를 정화하세요.",
  },
  mood_light: {
    key: "mood_light",
    nameKo: "LED 무드등",
    searchQuery: "무드등",
    purpose: "Sleep/Relaxation",
    purposeKo: "수면 안정",
    emoji: "🌙",
    description: "은은한 조명은 수면 환경을 개선하고 불안한 기운을 진정시킵니다.",
  },
};

export const VALID_KEYS = Object.keys(BIBO_ITEMS);
```

---

## 6. User Flow & Features

### 6.1 Landing Page (`/`)

**Hero Section:**
- Headline: **"당신의 방, 복이 들어오는 자리인가요?"**
- Subtext: **"풍수지리 AI가 3초 만에 진단하고, 부족한 기운을 채워드립니다."**
- CTA: **"무료로 방운(房運) 확인하기"** (Primary button)

**Design Tokens:**
- Background: Off-White `#FDFBF7`
- Primary Text: Deep Charcoal `#2C2C2C`
- Accent: Warm Gold `#C9A84C`
- CTA Button: Deep Charcoal bg + Off-White text
- Font: Pretendard (Korean) / fallback system-ui

**Below-the-fold Content (SEO):**
- "풍수지리란?" brief explainer (3 sentences max)
- "이런 분께 추천합니다" - 3 use cases with icons
- Trust badges: "10,000+ 방 진단 완료" (after launch, real numbers)

**Mobile Breakpoints:**
- `< 640px`: Single column, CTA full-width, min touch target 48px
- `640-1024px`: Slightly wider layout
- `> 1024px`: Centered max-width 720px

### 6.2 Upload Page (`/analyze`)

**Upload UI:**
- Camera capture (mobile primary) OR file upload
- Accepted: JPEG, PNG, WebP
- Max file size: 5MB (client-side validation + resize if needed)
- Client-side image resize to max 1024px (long edge) before upload to save tokens

**Privacy Badge:**
- "🔒 이미지는 분석 즉시 서버에서 영구 삭제됩니다."
- Must be visible at all times on the upload page

**Loading State (while AI processes):**
- Mystical compass animation (CSS only, no heavy assets)
- Rotating messages (2s interval):
  1. "기의 흐름을 읽는 중..."
  2. "명당 조건을 계산 중..."
  3. "음양의 균형을 분석 중..."
  4. "비보 아이템을 선정하는 중..."
- Expected duration: 3-8 seconds

### 6.3 AI Analysis (API Route: `app/api/analyze/route.ts`)

**Input:** Base64 encoded image (resized to max 1024px)

**Rate Limiting:**
- IP-based: Max 10 analyses per day per IP
- Implementation: Vercel Edge Config or Supabase counter
- Exceeded message: "오늘 무료 진단 횟수를 모두 사용했습니다. 내일 다시 시도해주세요!"

**System Prompt (GPT-4o Vision):**

```
You are "MyZari AI", an expert in Korean Pungsu-jiri (풍수지리).
Analyze the provided room photo and return a JSON diagnosis.

STRICT RULES:
1. "recommendation_key" MUST be exactly one of these values:
   ["sunflower", "plant", "light", "curtain", "chime", "poster", "diffuser", "bedding", "air_purifier", "mood_light"]
2. Choose the MOST URGENT item that would have the biggest positive impact.
3. All Korean text must be natural and warm, not robotic.
4. Score should reflect genuine assessment (avoid always giving 50-70).
5. Each point in good_points and bad_points should be 1 sentence, max 2.

Return ONLY valid JSON, no markdown fences, no extra text:
{
  "score": <integer 0-100>,
  "summary": "<one sentence Korean summary of the room's pungsu status>",
  "good_points": ["<point1>", "<point2>"],
  "bad_points": ["<point1>", "<point2>"],
  "recommendation_key": "<one key from the allowed list>",
  "reason": "<2-3 sentences in Korean explaining why this item is needed for this specific room>"
}
```

**Error Handling:**
- If GPT-4o returns invalid JSON → retry once with stricter prompt
- If `recommendation_key` is not in `VALID_KEYS` → fallback to `"plant"` (safest default)
- If API timeout (>15s) → show friendly error: "분석 중 문제가 발생했습니다. 다시 시도해주세요."
- If OpenAI API error → log error, show retry button

**Response Validation (server-side):**

```typescript
// Validate and sanitize AI response
function validateResponse(data: any): AnalysisResult {
  if (!VALID_KEYS.includes(data.recommendation_key)) {
    data.recommendation_key = "plant"; // safe fallback
  }
  data.score = Math.max(0, Math.min(100, Math.round(data.score)));
  data.good_points = data.good_points?.slice(0, 3) || [];
  data.bad_points = data.bad_points?.slice(0, 3) || [];
  return data as AnalysisResult;
}
```

### 6.4 Result Page (`/result`)

**Score Display:**
- Large typography (64px+), centered
- Color coded: 0-39 Red `#D94F4F`, 40-69 Amber `#C9A84C`, 70-100 Green `#4A9D5B`
- Label: "당신의 방운(房運) 점수"

**Diagnosis Card:**
- "✨ 좋은 점" section (green accent)
- "⚠️ 고칠 점" section (amber accent)

**The Solution (Revenue Section):**
- Section title: **"이 방에 부족한 기운을 채우는 비보(裨補) 아이템"**
- Card: Emoji icon + item name + Korean reason
- CTA Button: **"최저가로 기운 채우러 가기"** → Links to Coupang
- Button subtext: "쿠팡에서 확인하기" (smaller, gray)

**Share Section:**
- "친구 방도 진단해보세요!" + Copy link button
- KakaoTalk share button (use Kakao JS SDK)
- Share generates OG image with score + summary

**Legal Footer (on all pages with affiliate links):**
- Text: "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다."
- Style: 11px, color `#999999`, centered

---

## 7. Folder Structure

```
myzari/
├── app/
│   ├── layout.tsx          # Root layout (fonts, metadata, analytics)
│   ├── page.tsx            # Landing page
│   ├── analyze/
│   │   └── page.tsx        # Upload + Loading + trigger analysis
│   ├── result/
│   │   └── page.tsx        # Result display
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts    # GPT-4o Vision API endpoint
│   ├── privacy/
│   │   └── page.tsx        # 개인정보처리방침
│   └── globals.css
├── components/
│   ├── ui/                 # Reusable UI (Button, Card, Badge, etc.)
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   └── FeatureSection.tsx
│   ├── analyze/
│   │   ├── ImageUploader.tsx
│   │   ├── LoadingAnimation.tsx
│   │   └── PrivacyBadge.tsx
│   └── result/
│       ├── ScoreDisplay.tsx
│       ├── DiagnosisCard.tsx
│       ├── RecommendationCard.tsx
│       └── ShareSection.tsx
├── constants/
│   └── items.ts            # BIBO_ITEMS (single source of truth)
├── lib/
│   ├── openai.ts           # OpenAI client setup
│   ├── prompts.ts          # System prompt for GPT-4o
│   ├── validation.ts       # Response validation
│   └── utils.ts            # Image resize, helpers
├── public/
│   ├── og-image.png        # Default OG image
│   └── favicon.ico
├── .env.local              # OPENAI_API_KEY (NEVER commit)
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 8. Environment Variables

```bash
# .env.local (NEVER commit this file)
OPENAI_API_KEY=sk-...

# Optional: Supabase (if using DB)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional: Kakao Share
NEXT_PUBLIC_KAKAO_JS_KEY=...
```

**Vercel Environment Variables:**
Set all of the above in Vercel Dashboard → Project Settings → Environment Variables.

---

## 9. SEO & Social Sharing

**Meta Tags (layout.tsx):**

```typescript
export const metadata: Metadata = {
  title: "마이자리 - AI 풍수지리 방 진단",
  description: "풍수지리 AI가 당신의 방을 무료로 진단합니다. 3초 만에 방운 점수 확인!",
  openGraph: {
    title: "마이자리 - 내 방의 풍수 점수는?",
    description: "AI가 진단하는 무료 풍수지리 서비스",
    url: "https://myzari.kr",
    siteName: "마이자리",
    locale: "ko_KR",
    type: "website",
  },
};
```

**KakaoTalk Share Template:**
- Title: "내 방의 풍수 점수: {score}점!"
- Description: "{summary}"
- Button: "나도 진단받기"

---

## 10. Supabase Schema (Optional - Phase 2)

> Only implement if tracking analytics or adding features like history.

```sql
-- Analysis logs (for business intelligence)
CREATE TABLE analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  score INTEGER,
  recommendation_key TEXT,
  ip_hash TEXT,           -- hashed IP for rate limiting (not raw IP)
  user_agent TEXT
);

-- Daily rate limit counter
CREATE TABLE rate_limits (
  ip_hash TEXT PRIMARY KEY,
  count INTEGER DEFAULT 1,
  reset_date DATE DEFAULT CURRENT_DATE
);
```

---

## 11. Legal & Compliance

### 11.1 Required Pages
- `/privacy` - 개인정보처리방침 (image is not stored, no personal data collected)
- Coupang Partners disclaimer on all pages with affiliate links

### 11.2 Image Handling Policy
- Images are sent directly to OpenAI API via base64
- No server-side storage at any point
- No database storage of images
- User must be informed before upload

### 11.3 Disclaimer
- "본 서비스는 재미와 참고 목적으로 제공되며, 전문 풍수지리 상담을 대체하지 않습니다."
- Display on result page (small text)

---

## 12. Implementation Priority

| Phase | Task | Priority |
|-------|------|----------|
| **Phase 1 (MVP)** | Landing + Upload + AI Analysis + Result + Coupang Link | Must Have |
| **Phase 1** | Mobile responsive design | Must Have |
| **Phase 1** | Error handling & fallbacks | Must Have |
| **Phase 1** | .env + Vercel deployment | Must Have |
| **Phase 1** | Privacy page + legal disclaimers | Must Have |
| **Phase 2** | KakaoTalk share | Should Have |
| **Phase 2** | Supabase integration (analytics) | Should Have |
| **Phase 2** | Rate limiting (IP-based) | Should Have |
| **Phase 2** | OG image generation for results | Nice to Have |
| **Phase 3** | GA4 event tracking (CTA clicks, conversions) | Should Have |
| **Phase 3** | A/B test different item recommendations | Nice to Have |
| **Phase 3** | "재진단" (re-analysis) feature | Nice to Have |

---

## 13. Deployment Checklist

```
[ ] .env.local configured locally
[ ] Vercel project created and linked to GitHub repo
[ ] Environment variables set in Vercel dashboard
[ ] Domain myzari.kr connected to Vercel
[ ] OpenAI API key has sufficient credits
[ ] Coupang Partners account approved and links tested
[ ] Mobile tested on iOS Safari + Android Chrome
[ ] Privacy page accessible
[ ] Affiliate disclaimer visible on result page
[ ] OG meta tags verified (use https://developers.kakao.com/tool/debugger/sharing)
[ ] Lighthouse score > 80 (Performance, Accessibility)
```

---

## 14. Instructions to AI Developer

1. **Acknowledge** the Fixed List Strategy - all recommendations MUST come from `BIBO_ITEMS`.
2. **Create** the project folder structure as specified in Section 7.
3. **Write** the System Prompt (Section 6.3) that strictly enforces item selection.
4. **Implement** Phase 1 tasks first, in this order: constants → API route → pages → styling → deployment.
5. **Validate** every AI response server-side before sending to client.
6. **Never** expose `OPENAI_API_KEY` to the client/browser.
7. **Always** use TypeScript with strict types.
8. **Test** the Coupang search URLs manually before deployment.
