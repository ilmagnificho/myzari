import Link from "next/link";
import { Compass, Home, Moon, TrendingUp, ArrowRight, Camera } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 pt-24 pb-20 sm:pt-40 sm:pb-32">
        <div className="layout-container text-center">
          {/* Logo */}
          <div className="mb-16 fade-in-up flex flex-col items-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full border-2 border-gold/20 flex items-center justify-center float">
                <Compass className="w-9 h-9 text-gold" strokeWidth={1.5} />
              </div>
              <div className="absolute inset-0 rounded-full bg-gold/8 blur-2xl -z-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-charcoal tracking-tight">
              마이자리
            </h1>
            <p className="text-[11px] text-muted mt-1.5 font-medium tracking-[0.25em] uppercase">
              MyZari — AI Feng Shui
            </p>
          </div>

          {/* Headline */}
          <div className="fade-in-up stagger-1 mx-auto max-w-lg">
            <h2 className="text-3xl sm:text-[2.75rem] font-bold text-charcoal leading-[1.25] mb-6 tracking-tight">
              당신의 방,<br />
              <span className="text-gold">좋은 기운</span>이 흐르고 있나요?
            </h2>
            <p className="text-base sm:text-lg text-muted mb-14 leading-relaxed">
              풍수지리 AI가 방 사진 한 장으로 진단하고,<br />
              부족한 기운을 채우는 비보(裨補) 솔루션을 추천합니다.
            </p>
          </div>

          {/* CTA */}
          <div className="fade-in-up stagger-2 flex flex-col items-center">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-3 px-10 py-4.5 bg-charcoal text-offwhite rounded-full text-base font-semibold hover:bg-charcoal/90 transition-all duration-300 active:scale-[0.97] touch-target shadow-[0_8px_30px_-8px_rgba(0,0,0,0.25)]"
            >
              <Camera className="w-5 h-5" strokeWidth={1.8} />
              방 진단 시작하기
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
            <p className="text-sm text-muted/60 mt-5 font-medium">
              사진 한 장 · 3초 · 간략 분석 무료
            </p>
            <p className="text-xs text-muted/40 mt-1">
              상세 분석은 유료 (₩3,900)
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center py-4">
        <div className="w-12 h-px bg-gold/15" />
      </div>

      {/* Use Cases */}
      <section className="px-6 py-20 sm:py-28">
        <div className="layout-container">
          <h3 className="text-2xl sm:text-3xl font-bold text-charcoal text-center mb-14 tracking-tight">
            이런 분께 추천합니다
          </h3>
          <div className="grid grid-cols-1 gap-5">
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
                title: "운의 흐름을 바꾸고 싶을 때",
                desc: "소품 하나로 공간의 에너지를 개선하고 싶은 분",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-5 p-6 rounded-2xl glass-card hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold/8 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-charcoal mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted leading-relaxed">
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
      <section className="px-6 py-24 sm:py-32 bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div className="absolute top-[-40%] left-[-10%] w-[60%] h-[120%] bg-gold rotate-[30deg] blur-[100px]" />
          <div className="absolute bottom-[-40%] right-[-10%] w-[60%] h-[120%] bg-white rotate-[30deg] blur-[100px]" />
        </div>
        <div className="relative z-10 text-center layout-container">
          <h4 className="text-2xl sm:text-3xl font-bold text-offwhite mb-4 tracking-tight">
            지금 바로 당신의 방을<br />명당으로 만들어보세요.
          </h4>
          <p className="text-offwhite/40 text-sm mb-10">
            이미지 즉시 삭제 · 간략 분석 무료
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-10 py-4 bg-gold text-white rounded-full text-base font-semibold hover:bg-gold-dark transition-all duration-300 active:scale-[0.97] shadow-[0_8px_30px_-8px_rgba(197,160,89,0.3)]"
          >
            진단 시작하기
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>
      </section>
    </div>
  );
}
