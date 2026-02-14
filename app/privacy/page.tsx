import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="flex flex-col items-center px-6 py-20 sm:py-32">
            <div className="layout-container">
                <div className="mb-10 fade-in-up">
                    <p className="text-xs text-gold font-semibold tracking-[0.2em] uppercase mb-3">
                        Legal
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
                        개인정보처리방침
                    </h1>
                </div>

                <div className="space-y-8 text-charcoal/70 text-sm leading-relaxed fade-in-up stagger-1">
                    <section>
                        <h2 className="text-base font-bold text-charcoal mb-2">
                            1. 수집하는 개인정보
                        </h2>
                        <p className="mb-2">
                            마이자리(MyZari) 서비스는 최소한의 정보만을 처리하며, 별도의
                            회원가입 절차가 없습니다.
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>
                                <strong>업로드 이미지:</strong> 풍수 진단을 위해 업로드된 방
                                사진은 OpenAI API로 전송되며, 분석 완료 즉시 서버에서
                                삭제됩니다.
                            </li>
                            <li>
                                <strong>접속 정보:</strong> 서비스 개선을 위해 익명화된 접속
                                로그(IP 해시, 접속 시간)가 수집될 수 있습니다.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-charcoal mb-2">
                            2. 개인정보의 처리 목적
                        </h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>AI 풍수 진단 서비스 제공</li>
                            <li>서비스 이용 통계 분석</li>
                            <li>서비스 품질 개선</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-charcoal mb-2">
                            3. 개인정보의 보유 및 이용 기간
                        </h2>
                        <p>
                            업로드된 이미지는 분석 완료 직후 삭제되며, 별도로 보유하지
                            않습니다. 익명화된 접속 로그는 서비스 개선 목적으로 최대
                            90일간 보유 후 삭제됩니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-charcoal mb-2">
                            4. 개인정보의 제3자 제공
                        </h2>
                        <p>
                            업로드된 이미지는 풍수 진단 목적으로 OpenAI API에 전송됩니다.
                            OpenAI의 개인정보처리방침은{" "}
                            <a
                                href="https://openai.com/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gold underline hover:text-gold-dark"
                            >
                                여기
                            </a>
                            에서 확인할 수 있습니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-charcoal mb-2">
                            5. 이용자의 권리
                        </h2>
                        <p>
                            본 서비스는 회원가입 없이 운영되며, 별도의 개인정보를 저장하지
                            않으므로 열람, 수정, 삭제 요청의 대상이 되는 개인정보가
                            없습니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-charcoal mb-2">
                            6. 쿠키 사용
                        </h2>
                        <p>
                            본 서비스는 필수적인 기능 쿠키 외에 별도의 추적 쿠키를
                            사용하지 않습니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-charcoal mb-2">
                            7. 면책조항
                        </h2>
                        <p>
                            본 서비스는 재미와 참고 목적으로 제공되며, 전문 풍수지리
                            상담을 대체하지 않습니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-charcoal mb-2">
                            8. 문의처
                        </h2>
                        <p>개인정보 관련 문의: Tetra Corp.</p>
                    </section>

                    <p className="text-xs text-muted pt-4 border-t border-charcoal/5">
                        최종 수정일: 2025년 2월 14일
                    </p>
                </div>

                <div className="mt-8">
                    <a
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-charcoal transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                        홈으로 돌아가기
                    </a>
                </div>
            </div>
        </div>
    );
}
