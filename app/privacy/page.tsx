import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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
                            마이자리(MyZari) 서비스는 아래의 정보를 수집·처리합니다.
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>
                                <strong>업로드 이미지:</strong> 풍수 진단을 위해 업로드된 방
                                사진은 OpenAI API로 전송되며, 분석 완료 즉시 서버에서
                                삭제됩니다.
                            </li>
                            <li>
                                <strong>토스 로그인 정보:</strong> 토스 앱을 통해 로그인 시
                                유저ID와 닉네임이 수집되며, 결제 이력 관리 및 서비스 제공에
                                활용됩니다.
                            </li>
                            <li>
                                <strong>결제 정보:</strong> 인앱결제(IAP) 시
                                결제 토큰, 구매 상품, 금액이 저장됩니다.
                            </li>
                            <li>
                                <strong>분석 로그:</strong> 서비스 개선을 위해
                                분석 점수, 추천 아이템 등의 익명화된 분석 로그가 저장됩니다.
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
                            <li>유료 상세 분석 서비스 제공 및 결제 처리</li>
                            <li>구매 이력 관리 및 상품 제공 확인</li>
                            <li>서비스 이용 통계 분석</li>
                            <li>서비스 품질 개선</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-charcoal mb-2">
                            3. 개인정보의 보유 및 이용 기간
                        </h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>
                                <strong>업로드 이미지:</strong> 분석 완료 직후 즉시 삭제
                            </li>
                            <li>
                                <strong>결제 내역:</strong> 전자상거래 등에서의 소비자 보호에
                                관한 법률에 따라 <strong>5년간 보관</strong> 후 삭제
                            </li>
                            <li>
                                <strong>토스 로그인 정보:</strong> 회원 탈퇴 또는 서비스 종료 시
                                즉시 삭제
                            </li>
                            <li>
                                <strong>분석 로그:</strong> 최대 1년간 보유 후 삭제
                            </li>
                            <li>
                                <strong>접속 로그:</strong> 최대 90일간 보유 후 삭제
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-charcoal mb-2">
                            4. 개인정보의 제3자 제공
                        </h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>
                                업로드된 이미지는 풍수 진단 목적으로 <strong>OpenAI API</strong>에
                                전송됩니다.{" "}
                                <a
                                    href="https://openai.com/privacy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gold underline hover:text-gold-dark"
                                >
                                    OpenAI 개인정보처리방침
                                </a>
                            </li>
                            <li>
                                결제 및 로그인 정보는 <strong>Supabase</strong>(AWS 서울 리전)에
                                안전하게 저장됩니다.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-charcoal mb-2">
                            5. 이용자의 권리
                        </h2>
                        <p>
                            이용자는 언제든 개인정보의 열람, 정정, 삭제를 요청할 수 있습니다.
                            토스 앱을 통해 로그인한 유저는 아래 문의처로 연락하여
                            개인정보 삭제를 요청할 수 있습니다.
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
                        <p className="mt-2 text-xs text-muted">
                            통신판매업 신고번호: 제XXXX-서울XXX-XXXX호
                        </p>
                        <p className="text-xs text-muted">
                            사업자등록번호: XXX-XX-XXXXX
                        </p>
                    </section>

                    <p className="text-xs text-muted pt-4 border-t border-charcoal/5">
                        최종 수정일: 2025년 2월 15일
                    </p>
                </div>

                <div className="mt-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-charcoal transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                        홈으로 돌아가기
                    </Link>
                </div>
            </div>
        </div>
    );
}
