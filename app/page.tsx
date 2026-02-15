import Link from "next/link";
import { Compass, Home, Moon, TrendingUp, ArrowRight, Camera } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden relative">
      {/* Aurora Background Effect */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-gold/5 rounded-full blur-[120px] aura-glow" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-gold-dark/5 rounded-full blur-[100px] aura-glow" style={{ animationDelay: '-4s' }} />
      </div>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 pt-32 pb-28 sm:pt-48 sm:pb-40 relative z-10">
        <div className="layout-container text-center">
          {/* Logo */}
          <div className="mb-14 fade-in-up flex flex-col items-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full border border-gold/20 flex items-center justify-center float bg-cream/30 backdrop-blur-md">
                <Compass className="w-8 h-8 text-gold" strokeWidth={1.2} />
              </div>
              <div className="absolute inset-0 rounded-full bg-gold/10 blur-xl -z-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-medium text-offwhite tracking-tight">
              마이자리
            </h1>
            <p className="text-[10px] text-gold/80 mt-2 font-medium tracking-[0.3em] uppercase opacity-80">
              MyZari — AI Feng Shui
            </p>
          </div>

          {/* Headline */}
          <div className="fade-in-up stagger-1 mx-auto max-w-lg mb-14">
            <h2 className="text-[2rem] sm:text-[2.75rem] font-bold text-offwhite leading-[1.2] mb-6 tracking-tight">
              당신의 방,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light">좋은 기운</span>이 흐르나요?
            </h2>
            <p className="text-base sm:text-lg text-muted/80 leading-relaxed font-light">
              풍수지리 AI가 공간의 에너지를 읽고,<br />
              부족한 기운을 채우는 <span className="text-gold/90 font-medium">비보(裨補) 솔루션</span>을 제안합니다.
            </p>
          </div>

          {/* CTA */}
          <div className="fade-in-up stagger-2 flex flex-col items-center w-full">
            <Link
              href="/analyze"
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4.5 bg-gradient-to-b from-gold to-gold-dark text-[#111] rounded-full text-base font-semibold hover:brightness-110 transition-all duration-300 active:scale-[0.98] bg-[length:100%_200%] shadow-[0_0_40px_-10px_rgba(219,193,136,0.3)]"
            >
              <Camera className="w-5 h-5 opacity-80" strokeWidth={2} />
              방 진단 시작하기
              <ArrowRight className="w-4 h-4 opacity-60" strokeWidth={2} />
            </Link>
            <div className="flex items-center gap-3 mt-6 text-xs text-muted/50 font-medium">
              <span>사진 1장</span>
              <span className="w-1 h-1 rounded-full bg-muted/20" />
              <span>3초 분석</span>
              <span className="w-1 h-1 rounded-full bg-muted/20" />
              <span>간략 결과 무료</span>
            </div>
            <p className="text-[10px] text-muted/30 mt-1.5">
              상세 분석은 유료 (₩3,900)
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-6 py-24 relative z-10">
        <div className="layout-container">
          <div className="flex items-center gap-4 mb-10 opacity-60">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-xs text-offwhite/40 font-medium tracking-widest uppercase">For Whom</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <div className="grid grid-cols-1 gap-6">
            {[
              {
                icon: Home,
                title: "이사 · 입주 예정",
                desc: "새 공간의 기운을 미리 확인하고 싶은 분",
              },
              {
                icon: Moon,
                title: "숙면이 필요할 때",
                desc: "침실 배치가 수면에 영향을 주는지 궁금한 분",
              },
              {
                icon: TrendingUp,
                title: "운의 흐름 개선",
                desc: "소품 하나로 공간의 에너지를 바꾸고 싶은 분",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-5 p-6 rounded-2xl glass-card hover:bg-white/[0.03] transition-colors duration-300 group"
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-gold/20 transition-colors">
                    <Icon className="w-4 h-4 text-gold/80" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-offwhite mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted/80 leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gold-dark/10 to-transparent pointer-events-none" />

        <div className="relative z-10 text-center layout-container">
          <h4 className="text-2xl sm:text-3xl font-bold text-offwhite mb-4 tracking-tight leading-tight">
            지금 바로 당신의 방을<br />
            <span className="text-gold">명당</span>으로 만들어보세요.
          </h4>
          <p className="text-muted/50 text-xs mb-10 tracking-wide font-medium">
            365일 24시간 · AI 즉시 분석
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-gold/30 text-gold hover:bg-gold/10 rounded-full text-sm font-medium transition-all duration-300"
          >
            진단 시작하기
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </div>
  );
}
