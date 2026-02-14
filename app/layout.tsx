import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "마이자리 - AI 풍수지리 방 진단",
  description:
    "풍수지리 AI가 당신의 방을 무료로 진단합니다. 3초 만에 방운 점수 확인!",
  keywords: ["풍수지리", "방 진단", "AI", "마이자리", "방운", "인테리어", "풍수"],
  openGraph: {
    title: "마이자리 - 내 방의 풍수 점수는?",
    description: "AI가 진단하는 무료 풍수지리 서비스",
    url: "https://myzari.kr",
    siteName: "마이자리",
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">
        <main className="min-h-screen">{children}</main>
        <footer className="py-8 px-6 text-center border-t border-charcoal/5">
          <p className="text-[11px] text-muted max-w-md mx-auto leading-relaxed">
            이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
            수수료를 제공받습니다.
          </p>
          <p className="text-[11px] text-muted mt-2">
            본 서비스는 재미와 참고 목적으로 제공되며, 전문 풍수지리 상담을
            대체하지 않습니다.
          </p>
          <div className="mt-3">
            <a
              href="/privacy"
              className="text-[11px] text-muted hover:text-charcoal transition-colors underline underline-offset-4"
            >
              개인정보처리방침
            </a>
          </div>
          <p className="text-[11px] text-muted/50 mt-3">
            © 2025 마이자리 — Tetra Corp.
          </p>
        </footer>
      </body>
    </html>
  );
}
