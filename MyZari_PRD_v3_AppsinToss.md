# MyZari (마이자리) - Master PRD v3.0 (Apps in Toss Edition)
> AI 풍수지리 방 진단 서비스 | Toss Mini-App
> Last Updated: 2025-02-15

---

## 0. Revision Notes (v2 → v3 변경사항)

| # | 항목 | v2 상태 | v3 변경 |
|---|------|--------|---------|
| 1 | **배포 플랫폼** | Vercel (standalone web) | Vercel + Apps in Toss (WebView) |
| 2 | **수익 모델** | 쿠팡 파트너스 only | IAP (인앱결제) + IAA (인앱광고). **쿠팡 파트너스 완전 제거** |
| 3 | **결제** | 없음 (PG 미연동) | 앱인토스 IAP SDK (OBT 기간 수수료 0%) |
| 4 | **광고** | 없음 | 앱인토스 IAA SDK (토스 애드몹, OBT 기간 수수료 0%) |
| 5 | **로그인** | 없음 (Stateless) | 토스 로그인 SDK (유저 식별 + 결제 이력 관리) |
| 6 | **유저 플로우** | 전체 무료 | Freemium (간략 분석 무료 / 상세 분석 유료) |
| 7 | **디자인** | Custom Zen theme | + Toss Safe Area, Header 적용 |
| 8 | **법적 고지** | 쿠팡 파트너스 면책 | 쿠팡 문구 삭제 + 통신판매업 신고 번호 추가 |
| 9 | **개인정보처리방침** | 기본형 | 토스 로그인 유저 정보 수집 항목 추가 |
| 10 | **공유** | 카카오톡 + URL 복사 | + 토스 내 공유 기능 추가 |

---

## 1. Role Context

```
You are a Senior Full-Stack Developer and "Korean Pungsu (Geomancy)" Expert
acting as the CTO for Tetra Corp.

Migrate the existing MyZari MVP into an Apps-in-Toss mini-app with IAP monetization.
The existing codebase (Next.js 16 + Tailwind CSS v4 + Vercel) remains as-is.
Add Toss SDK integration, IAP payment flow, and IAA ad placement.
```

### Communication Protocol
- **Thinking & Code:** English (token optimization)
- **UI & User-facing text:** Natural Korean
- **Reports to CEO:** Korean (Polite/Formal)

---

## 2. Project Overview (Updated for v3)

| Field | Value |
|-------|-------|
| Service Name | MyZari (마이자리) - AI 풍수지리 방 진단 |
| Platform | **Apps in Toss (Primary)** + Vercel web (Secondary) |
| Target | 100% Korean market, mobile-first (토스 유저 3,000만) |
| Vibe | Modern Zen - Clean, Trustworthy, Korean tradition reinterpreted |
| Core Feature | Room photo → AI Pungsu diagnosis → Freemium detailed report |
| Legal Entity | Tetra Corp (법인 사업자, 통신판매업 신고 필요) |

---

## 3. Tech Stack (v3 Updated)

| Layer | Technology | v2→v3 Change |
|-------|-----------|-------------|
| Framework | Next.js 16 (App Router) | No change |
| Styling | Tailwind CSS v4 | No change |
| AI | OpenAI GPT-4o (Vision) | No change |
| Hosting | Vercel | No change (WebView loads Vercel URL) |
| DB | Supabase (Free tier) | **Required** (was optional) - user purchase history |
| SDK | **Apps in Toss WebView SDK** | **NEW** - Core integration |
| Payment | **Apps in Toss IAP SDK** | **NEW** - Replaces no-payment model |
| Ads | **Apps in Toss IAA SDK** | **NEW** - Toss AdMob integration |
| Auth | **Toss Login SDK** | **NEW** - Replaces stateless model |
| Analytics | Toss Console Dashboard + Vercel Analytics | **Updated** |
| Share | Toss Share + KakaoTalk | **Updated** |

---

## 4. Revenue Model (v3 - Complete Redesign)

### 4.1 Monetization Strategy: IAP + IAA (No Coupang)

> **CRITICAL DECISION:** Coupang Partners is completely removed from the Apps-in-Toss version.
> No external links. No affiliate disclaimers. Revenue comes from IAP + IAA only.

### 4.2 IAP Products (SKU Registration in Toss Console)

| SKU ID | Product Name | Price | Type | Description |
|--------|-------------|-------|------|-------------|
| `myzari_detail_single` | 상세 분석 1회 | ₩1,900 | Consumable | One detailed room analysis |

> **MVP Strategy:** Launch with single product only. Add packages/subscriptions based on user data.
> OBT period: 0% commission. ₩1,900 goes 100% to Tetra Corp.

### 4.3 IAA Ad Placement

| Placement | Screen | Format | Trigger |
|-----------|--------|--------|---------|
| Loading Ad | `analyze/page.tsx` | Banner or Interstitial | During AI analysis wait (5-10 sec) |
| Result Bottom | `result/page.tsx` | Banner | After free summary, before paywall |

### 4.4 Bibo Items (Information Only - No Purchase Links)

> The 10 bibo items remain as informational recommendations in the **paid** detailed report.
> No Coupang links. No external URLs. Display item name + emoji + description only.
> Future: Consider selling bibo items directly via TossPay.

---

## 5. User Flow (v3 Freemium Model)

```
[Toss App] → [전체/검색 탭에서 "마이자리" 발견]
    ↓
[Landing Page] - 서비스 소개 (simplified for mini-app)
    ↓
[Analyze Page] - 사진 업로드 (camera or gallery)
    ↓
[AI Loading] - 5~10초 대기 ← 💰 IAA Ad displayed here
    ↓
[FREE Result] - 점수(0-100) + 한줄 요약 + 좋은점/개선점 (LIMITED)
    ↓
[Paywall CTA] - "🔮 상세 분석 보기 (1,900원)"
    ↓  (IAP Purchase via Toss SDK)
[PAID Result] - 상세 진단 + 비보 아이템 추천 + 상세 이유
    ↓
[Share] - 토스 내 공유 / 카카오톡 공유
```

### 5.1 Free vs Paid Content Split

| Content | Free (간략) | Paid (상세) |
|---------|------------|------------|
| 방운 점수 (0-100) | ✅ | ✅ |
| 한줄 요약 | ✅ | ✅ |
| 좋은 점 (good_points) | ✅ 1개만 표시 | ✅ 전체 (2-3개) |
| 개선할 점 (bad_points) | ❌ 블러 처리 | ✅ 전체 (2-3개) |
| 비보 아이템 추천 | ❌ 잠김 | ✅ 상세 + 이유 |
| 상세 사유 (reason) | ❌ 잠김 | ✅ |

---

## 6. File-by-File Change Specification

> Based on actual GitHub code analysis (2025-02-15).
> Files marked 🆕 are new. Files marked ✏️ need modification. Files marked ✅ need no change.

### 6.1 Files to MODIFY (✏️)

#### `app/layout.tsx` ✏️
**Changes:**
1. Remove Coupang Partners footer disclaimer entirely
2. Add Apps-in-Toss Safe Area padding (env(safe-area-inset-top), env(safe-area-inset-bottom))
3. Add Toss SDK script initialization
4. Update privacy policy link text (remove "쿠팡 파트너스 활동" mention)
5. Add 통신판매업 신고번호 to footer
6. Keep Pretendard font CDN (compatible with Toss design)

```typescript
// Key changes in layout.tsx:
// 1. Body padding for Toss Safe Area
<body className="antialiased" style={{ 
  paddingTop: 'env(safe-area-inset-top)',
  paddingBottom: 'env(safe-area-inset-bottom)' 
}}>

// 2. Remove this line from footer:
// ❌ "이 포스팅은 쿠팡 파트너스 활동의 일환으로..."

// 3. Add Toss SDK init script in <head>
```

#### `app/page.tsx` ✏️ (Landing Page)
**Changes:**
1. Simplify for mini-app context (users already found you in Toss)
2. Remove redundant trust signals (Toss itself is the trust)
3. Change CTA from "무료로 방 진단하기" to "방 진단 시작하기"
4. Remove "완전 무료" messaging (now freemium)
5. Add subtle "상세 분석은 유료" notice
6. Shorten page - mini-app users want speed

#### `app/analyze/page.tsx` ✏️
**Changes:**
1. Add IAA ad component during AI loading state
2. Add Toss SDK camera permission handling (use SDK photo API if available)
3. Keep existing image upload logic (works in WebView)
4. Add Toss login check before analysis (get user ID for purchase tracking)

#### `app/result/page.tsx` ✏️ (MAJOR CHANGES)
**Changes:**
1. Split into FREE and PAID sections
2. FREE: Show score, summary, 1 good_point only
3. PAID gate: Blur/lock bad_points, recommendation, reason
4. Add paywall CTA button: "🔮 상세 분석 보기 (₩1,900)"
5. On CTA click: trigger Apps-in-Toss IAP SDK purchase flow
6. On successful purchase: unlock full content, save to Supabase
7. Remove Coupang CTA button ("최저가로 기운 채우러 가기" → DELETE)
8. Remove `getCoupangUrl()` call
9. Keep bibo item display (emoji + name + description) but as info only, no link
10. Update share: add Toss in-app share alongside KakaoTalk
11. Add IAA banner ad at bottom of free result

#### `app/api/analyze/route.ts` ✏️
**Changes:**
1. Add Toss user authentication header validation
2. Return expanded response structure with `free_preview` and `paid_detail` separation
3. Keep OpenAI GPT-4o Vision logic unchanged

#### `constants/items.ts` ✏️
**Changes:**
1. Remove `searchQuery` field (was for Coupang URL generation)
2. Keep all 10 bibo items with nameKo, purpose, purposeKo, emoji, description
3. Add `detailTip` field (Korean tip for the paid result page)

```typescript
// Updated BiboItem interface
export interface BiboItem {
  key: string;
  nameKo: string;
  // searchQuery: string;  ← REMOVED (was Coupang)
  purpose: string;
  purposeKo: string;
  emoji: string;
  description: string;
  detailTip: string;  // ← NEW: Extra tip shown in paid result
}
```

#### `lib/utils.ts` ✏️
**Changes:**
1. Remove `getCoupangUrl()` function entirely
2. Keep `getScoreColor()`, `getScoreLabel()` - no change

#### `components/KakaoShareButton.tsx` ✏️
**Changes:**
1. Update share URL from `myzari.kr` to Toss deep link (앱인토스 공유 URL)
2. Add TossShareButton component alongside

#### `app/privacy/page.tsx` ✏️
**Changes:**
1. Add Toss Login data collection disclosure
2. Add IAP purchase history retention policy
3. Remove Coupang Partners mention
4. Add 통신판매업 신고번호

### 6.2 Files to ADD (🆕)

#### `lib/toss-sdk.ts` 🆕
```typescript
// Apps-in-Toss SDK wrapper
// - Initialize SDK on app mount
// - Toss Login: get user info (userId, nickname)
// - IAP: requestPurchase(skuId) → purchaseToken
// - IAA: loadAd(), showAd()
// - Navigation: setBackButton handler
// - Share: shareToss(title, description, imageUrl)
```

#### `app/api/purchase/verify/route.ts` 🆕
```typescript
// Server-side purchase verification
// 1. Receive purchaseToken from client
// 2. Verify with Apps-in-Toss API (server-to-server)
// 3. Save purchase record to Supabase
// 4. Return unlock status
```

#### `components/PaywallCTA.tsx` 🆕
```typescript
// Paywall component for result page
// - "🔮 상세 분석 보기" button
// - Price display (₩1,900)
// - Loading state during purchase
// - Success → unlock content
// - Error → retry with message
```

#### `components/TossAdBanner.tsx` 🆕
```typescript
// IAA Ad banner component
// - Load Toss AdMob ad unit
// - Show during analysis loading
// - Show at bottom of free result
// - Graceful fallback if ad fails
```

#### `components/TossShareButton.tsx` 🆕
```typescript
// Toss in-app share button
// - Uses Toss SDK share API
// - Shares result with deep link back to mini-app
```

#### `lib/supabase.ts` 🆕 (Upgrade from optional to required)
```typescript
// Supabase client for:
// - Purchase history (userId, skuId, purchaseToken, createdAt)
// - Analysis logs (userId, score, recommendation_key)
// - Rate limiting per user (replaces IP-based)
```

### 6.3 Files with NO CHANGES (✅)

| File | Reason |
|------|--------|
| `lib/openai.ts` | OpenAI client setup unchanged |
| `lib/prompts.ts` | GPT-4o system prompt unchanged |
| `lib/validation.ts` | Response validation unchanged |
| `app/globals.css` | Styles compatible with Toss WebView |
| `next.config.ts` | No changes needed |
| `tsconfig.json` | No changes needed |
| `public/*` | Static assets unchanged |

---

## 7. Updated Folder Structure (v3)

```
myzari/
├── app/
│   ├── layout.tsx            # ✏️ Safe Area + Toss SDK init + remove Coupang footer
│   ├── page.tsx              # ✏️ Simplified landing for mini-app
│   ├── analyze/
│   │   └── page.tsx          # ✏️ + IAA ad during loading + Toss login check
│   ├── result/
│   │   └── page.tsx          # ✏️ MAJOR: Free/Paid split + paywall + remove Coupang
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.ts      # ✏️ + Toss auth validation
│   │   └── purchase/
│   │       └── verify/
│   │           └── route.ts  # 🆕 IAP purchase verification
│   ├── privacy/
│   │   └── page.tsx          # ✏️ + Toss data + 통신판매업 번호
│   └── globals.css           # ✅ No change
├── components/
│   ├── KakaoShareButton.tsx  # ✏️ Update share URL
│   ├── TossShareButton.tsx   # 🆕 Toss in-app share
│   ├── PaywallCTA.tsx        # 🆕 Purchase gate component
│   └── TossAdBanner.tsx      # 🆕 IAA ad component
├── constants/
│   └── items.ts              # ✏️ Remove searchQuery, add detailTip
├── lib/
│   ├── openai.ts             # ✅ No change
│   ├── prompts.ts            # ✅ No change
│   ├── validation.ts         # ✅ No change
│   ├── utils.ts              # ✏️ Remove getCoupangUrl()
│   ├── toss-sdk.ts           # 🆕 Apps-in-Toss SDK wrapper
│   └── supabase.ts           # 🆕 Supabase client (required)
├── public/
│   ├── og-image.png          # ✅ No change
│   └── favicon.ico           # ✅ No change
├── .env.local                # ✏️ Add Toss + Supabase keys
├── .gitignore                # ✅ No change
├── next.config.ts            # ✅ No change
├── tailwind.config.ts        # ✅ No change (Toss compat)
├── tsconfig.json             # ✅ No change
└── package.json              # ✏️ Add @apps-in-toss/sdk dependency
```

---

## 8. Environment Variables (v3)

```bash
# .env.local

# === EXISTING (keep) ===
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_KAKAO_API_KEY=...

# === NEW: Supabase (now required) ===
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# === NEW: Apps in Toss ===
NEXT_PUBLIC_TOSS_APP_ID=...          # From Toss Console
TOSS_MTLS_KEY=...                    # For server-to-server API (optional)

# === REMOVED ===
# NEXT_PUBLIC_GA_ID (replaced by Toss Console Dashboard)
```

---

## 9. Supabase Schema (v3 - Required)

```sql
-- User purchase history (REQUIRED for IAP)
CREATE TABLE purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  toss_user_id TEXT NOT NULL,
  sku_id TEXT NOT NULL,
  purchase_token TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Analysis logs (track usage per user)
CREATE TABLE analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  toss_user_id TEXT,
  score INTEGER,
  recommendation_key TEXT,
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_purchases_user ON purchases(toss_user_id);
CREATE INDEX idx_analyses_user ON analyses(toss_user_id);
```

---

## 10. Legal & Compliance (v3)

### 10.1 Required Before Launch
- [x] 법인 사업자등록증 (Tetra Corp) - **완료**
- [ ] 통신판매업 신고 (관할 구청, 1-3일 소요) - **필수! 유료 서비스 판매 시**
- [ ] 앱인토스 콘솔 사업자 정보 등록

### 10.2 Updated Privacy Policy Must Include
- Toss Login으로 수집하는 정보 (토스 유저ID, 닉네임)
- IAP 결제 이력 보관 (결제 내역 5년 보관 - 전자상거래법)
- Supabase에 저장되는 분석 로그
- OpenAI API 이미지 전송 (기존과 동일)

### 10.3 Footer Changes
```
// ❌ REMOVE:
"이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다."

// ✅ KEEP:
"본 서비스는 재미와 참고 목적으로 제공되며, 전문 풍수지리 상담을 대체하지 않습니다."

// ✅ ADD:
"통신판매업 신고번호: 제XXXX-서울XXX-XXXX호"
"© 2025 마이자리 — Tetra Corp. | 사업자등록번호: XXX-XX-XXXXX"
```

---

## 11. Implementation Priority (v3)

| Phase | Task | Priority | Estimated Time |
|-------|------|----------|---------------|
| **Phase 0** | 통신판매업 신고 | **BLOCKER** | 1-3 days |
| **Phase 0** | 앱인토스 콘솔 가입 + 앱 등록 | **BLOCKER** | 1 day |
| **Phase 1** | Remove all Coupang code (items.ts, utils.ts, layout.tsx, result) | Must Have | 1 day |
| **Phase 1** | Add Safe Area + Toss header handling | Must Have | 1 day |
| **Phase 1** | Integrate Toss WebView SDK | Must Have | 2-3 days |
| **Phase 1** | Implement Toss Login | Must Have | 1-2 days |
| **Phase 2** | Implement free/paid split on result page | Must Have | 2-3 days |
| **Phase 2** | Integrate IAP SDK + PaywallCTA component | Must Have | 2-3 days |
| **Phase 2** | Build purchase verification API + Supabase | Must Have | 1-2 days |
| **Phase 2** | Add IAA ad placements | Should Have | 1-2 days |
| **Phase 3** | QA in Toss environment | Must Have | 3-5 days |
| **Phase 3** | Submit for review | Must Have | 1 day |
| **Phase 3** | Handle review feedback & resubmit | Should Have | 1-5 days |

**Total estimated: 3-5 weeks** (faster than typical 4-6 weeks because codebase already exists)

---

## 12. Deployment Checklist (v3)

```
[ ] 통신판매업 신고 완료
[ ] 앱인토스 콘솔 가입 + 워크스페이스 생성
[ ] 앱인토스 콘솔에 앱 정보 등록 (이름, 카테고리, 아이콘, 스크린샷)
[ ] 사업자 정보 등록 (법인, 통신판매업 번호, 정산 계좌)
[ ] Supabase 프로젝트 생성 + 테이블 생성
[ ] .env.local에 Toss App ID + Supabase keys 추가
[ ] Vercel 환경변수에 동일하게 추가
[ ] Coupang 관련 코드 전부 제거 확인
[ ] Toss WebView SDK 초기화 동작 확인
[ ] Toss Login 동작 확인 (userId 받아오기)
[ ] IAP 결제 테스트 (테스트 모드)
[ ] IAA 광고 노출 테스트
[ ] Safe Area 렌더링 확인 (상단/하단 겹침 없음)
[ ] 개인정보처리방침 업데이트 완료
[ ] 푸터 문구 업데이트 완료 (통신판매업 번호 포함)
[ ] 번들 사이즈 50MB 이하 확인
[ ] 앱인토스 심사 제출
```

---

## 13. Instructions to AI Developer (v3)

1. **Read** the Apps-in-Toss developer docs (developers-apps-in-toss.toss.im) FIRST before coding.
2. **Remove** ALL Coupang Partners references - searchQuery in items, getCoupangUrl in utils, footer disclaimer, CTA buttons.
3. **Implement** Toss SDK integration following the official WebView guide.
4. **Split** the result page into free/paid sections as defined in Section 5.1.
5. **Build** the PaywallCTA component that triggers IAP SDK purchase.
6. **Verify** purchases server-side before unlocking content.
7. **Save** all purchase records to Supabase (legal requirement: 5 year retention).
8. **Test** in Toss WebView environment (not just browser).
9. **Keep** the existing Modern Zen design - only add Toss-specific adaptations.
10. **Never** expose any API keys or Toss SDK secrets to the client.

---

## 14. Dual Deployment Strategy

> MyZari will exist in TWO forms simultaneously:

| Aspect | Vercel Web (myzari.kr) | Apps in Toss |
|--------|----------------------|--------------|
| URL | myzari.kr | Toss App > 전체 탭 |
| Revenue | None (free promo) or future affiliate | IAP + IAA |
| Auth | None (stateless) | Toss Login |
| Payment | None | IAP (₩1,900) |
| Purpose | SEO + organic traffic + brand awareness | Primary revenue channel |
| Codebase | Same repo, environment-based branching | Same repo |

**Implementation:** Use `NEXT_PUBLIC_PLATFORM` env var to conditionally render:
```typescript
const isToss = process.env.NEXT_PUBLIC_PLATFORM === 'toss';
// Show IAP button only in Toss, show Coupang only in web (or nothing)
```

---

*End of PRD v3.0*
