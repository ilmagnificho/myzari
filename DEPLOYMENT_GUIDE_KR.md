# 마이자리(MyZari) 배포 및 운영 가이드

마이자리를 정상적으로 운영하기 위해 필요한 **데이터베이스(Supabase)**, **토스(Toss)**, **배포(Vercel)** 설정을 안내합니다.

---

## 1. 데이터베이스 설정 (Supabase)

결제 내역과 분석 로그를 저장하기 위한 설정입니다.

1. [Supabase](https://supabase.com)에 로그인하고 새 프로젝트를 생성합니다.
2. 좌측 메뉴의 **SQL Editor**로 이동합니다.
3. 아래 SQL 코드를 복사하여 붙여넣고 **Run** 버튼을 눌러 실행합니다.

```sql
-- 구매 내역 테이블
create table purchases (
  id uuid default gen_random_uuid() primary key,
  toss_user_id text not null,
  sku_id text not null,
  purchase_token text not null,
  amount integer not null,
  status text default 'completed',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 분석 로그 테이블 (선택 사항)
create table analyses (
  id uuid default gen_random_uuid() primary key,
  user_id text, -- toss_user_id or anonymous
  image_url text, -- uploaded image (optional)
  result_summary text,
  score integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) 설정 (선택 사항: 필요한 경우 활성화)
alter table purchases enable row level security;
alter table analyses enable row level security;
```

4. **Project Settings > API** 메뉴에서 `Project URL`과 `service_role key` (secret)를 복사해둡니다.

---

## 2. 토스 디벨로퍼스 설정 (Toss Developers)

앱인토스 미니앱 연동을 위한 설정입니다.

### 2-1. 앱 생성 및 ID 확인
1. [토스 개발자 센터](https://developers.toss.im/)에 로그인합니다.
2. **미니앱 만들기**를 진행합니다.
3. 발급된 **App ID**를 복사해둡니다.

### 2-2. mTLS 인증서 발급 (필수: 결제 검증용)
인앱 결제 검증(Server-to-Server)을 위해 인증서가 필요합니다.

1. 토스 개발자 센터 > 해당 앱 > **mTLS 인증서** 메뉴로 이동합니다.
2. **인증서 발급하기**를 누릅니다.
3. 다운로드된 `client-cert.pem` (인증서)과 `client-key.pem` (키) 파일을 엽니다 (메모장 등).
4. 각 파일의 내용을 **전체 복사**해둡니다. (나중에 Vercel 환경변수에 입력)
   - `-----BEGIN CERTIFICATE-----` 부터 `-----END CERTIFICATE-----` 까지 모두 포함해야 합니다.

---

## 3. Vercel 환경변수 설정

서버가 정상 작동하려면 환경변수가 필요합니다.
Vercel 프로젝트 대시보드 > **Settings** > **Environment Variables**에 다음 값들을 추가하세요.

| 변수명 (Key) | 값 (Value) 설명 | 예시 |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_PLATFORM` | 플랫폼 식별자 | `toss` |
| `OPENAI_API_KEY` | OpenAI API 키 | `sk-...` |
| `NEXT_PUBLIC_TOSS_APP_ID` | 토스 앱 ID | `W1234...` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | `https://xyz.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key | `eyJ...` |
| `TOSS_CERT` | `client-cert.pem` 내용 전체 | `-----BEGIN CERTIFICATE...` |
| `TOSS_KEY` | `client-key.pem` 내용 전체 | `-----BEGIN PRIVATE KEY...` |

> **팁:** `TOSS_CERT`와 `TOSS_KEY`는 줄바꿈이 포함되어 있습니다. Vercel 환경변수 입력창에 그대로 붙여넣으면 됩니다.

---

## 4. 최종 확인 및 배포

1. 모든 환경변수가 입력되면 Vercel에서 **Redeploy**를 수행합니다.
2. 배포된 URL을 토스 개발자 센터의 **개발/운영 URL**에 등록합니다.
3. 토스 앱 내 '개발자 설정'을 통해 미니앱을 테스트합니다.

---

### 🚨 AI 생성 콘텐츠 표시 의무 (준수 완료)
앱인토스 정책에 따라 생성형 AI 사용 시 사용자에게 이를 고지해야 합니다.
- **조치 완료**: 모든 페이지 하단(Footer)에 **"본 서비스는 생성형 AI를 활용하여..."** 문구를 추가했습니다.

### 🚨 외부 링크 제한 (준수 완료)
앱 내에서 외부 브라우저로 이탈하는 링크가 없어야 합니다.
- **조치 완료**: 개인정보처리방침 외에는 외부 링크가 없도록 구성했습니다.
