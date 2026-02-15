# Supabase 설정 및 가격 업데이트 가이드

## 1. Supabase 테이블 생성

Supabase 프로젝트의 **SQL Editor** 메뉴에서 아래 코드를 복사해서 붙여넣고 `Run`을 클릭하세요.

```sql
-- purchases 테이블 생성 (결제 내역)
create table public.purchases (
  id uuid not null default gen_random_uuid (),
  toss_user_id text not null,        -- 토스 유저 ID
  sku_id text not null,              -- 상품 ID (예: myzari_detail_single)
  purchase_token text not null,      -- 결제 토큰
  amount integer not null,           -- 결제 금액
  status text not null default 'completed',
  created_at timestamp with time zone not null default now(),
  constraint purchases_pkey primary key (id)
);

-- analyses 테이블 생성 (분석 로그)
create table public.analyses (
  id uuid not null default gen_random_uuid (),
  toss_user_id text null,            -- 토스 유저 ID (로그인 유저인 경우)
  score integer not null,            -- 점수
  recommendation_key text not null,  -- 추천 아이템 키
  is_paid boolean not null default false, -- 유료 여부
  created_at timestamp with time zone not null default now(),
  constraint analyses_pkey primary key (id)
);

-- RLS (Row Level Security) 설정 - 선택사항
-- API 키(service_role)만 접근 가능하도록 설정하는 것이 안전합니다.
alter table public.purchases enable row level security;
alter table public.analyses enable row level security;
```

---

## 2. 가격(Price) 업데이트 방법

현재 가격인 `1,900원`을 변경하려면 아래 **3개 파일**을 수정해야 합니다.

### (1) `components/PaywallCTA.tsx`
유저에게 보여지는 가격 텍스트를 수정합니다.

```tsx
// 58번째 줄 근처
<span className="text-offwhite/60 text-sm font-medium">₩1,900</span> 
// -> 원하시는 가격(예: ₩2,900)으로 변경
```

### (2) `app/page.tsx`
랜딩 페이지의 가격 안내 문구를 수정합니다.

```tsx
// 55번째 줄 근처
<p className="text-xs text-muted/40 mt-1">
  상세 분석은 유료 (₩1,900) 
  {/* -> 원하시는 가격으로 변경 */}
</p>
```

### (3) `app/api/purchase/verify/route.ts`
데이터베이스에 저장되는 결제 금액을 수정합니다.

```ts
// 39번째 줄 근처
await savePurchase({
    // ...
    amount: 1900, // -> 원하시는 가격(예: 2900)으로 변경 (숫자만 입력)
    // ...
});
```

> **참고**: 실제 결제 금액은 **토스 개발자 센터(Toss Developer Console)**에서 상품(SKU)을 등록할 때 설정한 가격을 따릅니다. 코드 상의 가격과 토스 콘솔의 가격을 반드시 일치시켜야 합니다.

---

## 3. 업데이트 배포 방법

수정이 완료되면 터미널에서 아래 명령어로 Vercel에 배포합니다.

```bash
git add .
git commit -m "Update price and add supabase setup"
git push origin main
```
