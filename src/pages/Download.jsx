import packageInfo from "../../package.json";

import "../styles/download.css";

const imagePath = "/images/landing/";

const features = [
    {
        number: "01",
        title: "직원 관리",
        description:
            "직원 정보와 급여방식, 입사일 등 매장 운영에 필요한 정보를 한곳에서 관리합니다.",
        image: "employee-list.png",
    },
    {
        number: "02",
        title: "간편한 출결 기록",
        description:
            "직원번호를 입력해 출근, 퇴근, 휴식 시작과 종료를 기록할 수 있습니다.",
        image: "workpad.png",
    },
    {
        number: "03",
        title: "근태 정책과 승인",
        description:
            "지각, 조퇴, 연장근무 등 매장의 근태 기준을 설정하고 승인대기 내역을 처리합니다.",
        image: "policy.png",
    },
    {
        number: "04",
        title: "급여와 퇴직금 현황",
        description:
            "근태 기록과 설정된 정책을 바탕으로 예상 급여와 퇴직금 현황을 확인할 수 있습니다.",
        image: "dashboard.png",
    },
];

const steps = [
    {
        number: "1",
        title: "프로그램 설치",
        description:
            "무료 다운로드 버튼을 누른 뒤 다운로드한 설치파일을 실행합니다.",
    },
    {
        number: "2",
        title: "매장 정보와 정책 설정",
        description:
            "관리자 인증 후 회사 정보와 근태·급여 정책을 매장에 맞게 설정합니다.",
    },
    {
        number: "3",
        title: "직원 등록",
        description:
            "직원 정보와 급여방식, 근무 관련 정보를 등록합니다.",
    },
    {
        number: "4",
        title: "출결 기록 및 관리",
        description:
            "직원은 출결패드를 사용하고 관리자는 대시보드와 승인 관리에서 기록을 확인합니다.",
    },
];

function Download() {

    const downloadUrl =
        "https://github.com/letskoo/StaffManager/releases/download/v0.7.10/Staff.Manager_0.7.10_x64-setup.exe";

    const installButton = (
        <a
            href={downloadUrl}
            className="download-btn"
        >
            무료 다운로드
        </a>
    );

    return (

        <div className="download-page">

            <header className="download-header">

                <div className="download-header-inner">

                    <a
                        href="#top"
                        className="download-brand"
                    >
                        <img
                            src="/pwa-192x192-v2.png"
                            alt=""
                        />

                        <span>Staff Manager</span>
                    </a>

                    <nav className="download-nav">

                        <a href="#features">
                            주요 기능
                        </a>

                        <a href="#guide">
                            사용방법
                        </a>

                        <a href="#download">
                            다운로드
                        </a>

                    </nav>

                </div>

            </header>

            <main>

                <section
                    className="download-hero"
                    id="top"
                >

                    <div className="download-container download-hero-grid">

                        <div className="download-hero-copy">

                            <span className="download-eyebrow">
                                FREE STAFF MANAGEMENT
                            </span>

                            <h1>
                                복잡한 직원관리,
                                <br />
                                프로그램으로 단순하게.
                            </h1>

                            <p className="download-hero-description">
                                직원 · 출결 · 승인 · 급여를
                                <br />
                                하나의 프로그램에서 관리하세요.
                            </p>

                            <div className="download-hero-actions">

                                {installButton}

                                <a
                                    href="#guide"
                                    className="download-outline-btn"
                                >
                                    사용방법 보기
                                </a>

                            </div>

                            <div className="download-hero-meta">

                                <span>무료 사용</span>
                                <span>로컬 데이터 저장</span>
                                <span>Windows 프로그램</span>

                            </div>

                        </div>

                        <div className="download-hero-visual">

                            <div className="download-preview-top">

                                <span className="download-preview-dot" />
                                <span className="download-preview-dot" />
                                <span className="download-preview-dot" />

                                <span className="download-preview-name">
                                    Staff Manager
                                </span>

                            </div>

                            <img
                                src={`${imagePath}dashboard.png`}
                                alt="Staff Manager 대시보드 화면"
                            />

                        </div>

                    </div>

                </section>

                <section
                    className="download-section download-intro"
                >

                    <div className="download-container">

                        <div className="download-section-heading">

                            <span className="download-eyebrow">
                                WHY STAFF MANAGER
                            </span>

                            <h2>
                                매장 운영에 필요한 기능을
                                <br />
                                한곳에 모았습니다.
                            </h2>

                            <p>
                                여러 장부와 엑셀을 오가며 관리하던 업무를
                                하나의 흐름으로 연결합니다.
                            </p>

                        </div>

                        <div className="download-benefits">

                            <div className="download-benefit">

                                <span className="download-benefit-icon">
                                    01
                                </span>

                                <h3>간편한 출결</h3>

                                <p>
                                    직원번호로 빠르게 출퇴근과 휴식 기록
                                </p>

                            </div>

                            <div className="download-benefit">

                                <span className="download-benefit-icon">
                                    02
                                </span>

                                <h3>정책 기반 관리</h3>

                                <p>
                                    매장별 근태 기준과 승인 내역을 체계적으로
                                </p>

                            </div>

                            <div className="download-benefit">

                                <span className="download-benefit-icon">
                                    03
                                </span>

                                <h3>급여 현황 확인</h3>

                                <p>
                                    근태 기록을 바탕으로 예상 급여를 한눈에
                                </p>

                            </div>

                        </div>

                    </div>

                </section>

                <section
                    className="download-section download-features"
                    id="features"
                >

                    <div className="download-container">

                        <div className="download-section-heading">

                            <span className="download-eyebrow">
                                FEATURES
                            </span>

                            <h2>Staff Manager 주요 기능</h2>

                            <p>
                                실제 프로그램 화면으로 주요 기능을 살펴보세요.
                            </p>

                        </div>

                        <div className="download-feature-list">

                            {features.map((feature, index) => (

                                <div
                                    className={`download-feature ${index % 2 === 1
                                        ? "download-feature-reverse"
                                        : ""
                                        }`}
                                    key={feature.number}
                                >

                                    <div className="download-feature-copy">

                                        <span className="download-feature-number">
                                            {feature.number}
                                        </span>

                                        <h3>{feature.title}</h3>

                                        <p>{feature.description}</p>

                                    </div>

                                    <div className="download-feature-image">

                                        <img
                                            src={`${imagePath}${feature.image}`}
                                            alt={`${feature.title} 화면`}
                                            loading="lazy"
                                        />

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                </section>

                <section className="download-section download-more">

                    <div className="download-container">

                        <div className="download-section-heading">

                            <span className="download-eyebrow">
                                MORE FEATURES
                            </span>

                            <h2>일상적인 관리 업무도 간편하게</h2>

                        </div>

                        <div className="download-more-grid">

                            <div className="download-more-card">

                                <img
                                    src={`${imagePath}employee-form.png`}
                                    alt="직원 등록 화면"
                                    loading="lazy"
                                />

                                <div>
                                    <h3>직원 정보 등록</h3>
                                    <p>
                                        직원의 기본 정보와 급여 관련 정보를
                                        등록하고 관리합니다.
                                    </p>
                                </div>

                            </div>

                            <div className="download-more-card">

                                <img
                                    src={`${imagePath}notice-form.png`}
                                    alt="공지 등록 화면"
                                    loading="lazy"
                                />

                                <div>
                                    <h3>공지와 칭찬</h3>
                                    <p>
                                        공지사항, 보너스, 개인메모, 칭찬 등
                                        매장 내 소식을 기록합니다.
                                    </p>
                                </div>

                            </div>

                            <div className="download-more-card">

                                <img
                                    src={`${imagePath}setting.png`}
                                    alt="설정 화면"
                                    loading="lazy"
                                />

                                <div>
                                    <h3>매장 설정</h3>
                                    <p>
                                        회사 정보와 관리 설정을 매장 운영
                                        방식에 맞게 구성합니다.
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                <section
                    className="download-section download-guide"
                    id="guide"
                >

                    <div className="download-container">

                        <div className="download-section-heading">

                            <span className="download-eyebrow">
                                GETTING STARTED
                            </span>

                            <h2>처음 시작하는 방법</h2>

                            <p>
                                설치부터 출결 관리까지 순서대로 진행하세요.
                            </p>

                        </div>

                        <div className="download-steps">

                            {steps.map((step) => (

                                <div
                                    className="download-step"
                                    key={step.number}
                                >

                                    <span className="download-step-number">
                                        {step.number}
                                    </span>

                                    <h3>{step.title}</h3>

                                    <p>{step.description}</p>

                                </div>

                            ))}

                        </div>

                    </div>

                </section>

                <section className="download-section download-storage">

                    <div className="download-container download-storage-grid">

                        <div>

                            <span className="download-eyebrow">
                                LOCAL FIRST
                            </span>

                            <h2>
                                데이터는 사용하는
                                <br />
                                기기에 저장됩니다.
                            </h2>

                            <p>
                                현재 무료 버전은 별도의 계정 서버에
                                직원 정보를 보관하는 방식이 아닌,
                                로컬 저장형 프로그램입니다.
                            </p>

                            <p>
                                매장 PC에서 직원과 근태를 관리하고,
                                필요한 자료는 프로그램의 다운로드
                                기능을 통해 별도로 보관할 수 있습니다.
                            </p>

                        </div>

                        <div className="download-storage-card">

                            <h3>사용 전 알아두세요</h3>

                            <div className="download-storage-item">

                                <strong>데이터 보관</strong>

                                <span>
                                    설치된 PC의 로컬 저장공간을 사용합니다.
                                </span>

                            </div>

                            <div className="download-storage-item">

                                <strong>기기 간 동기화</strong>

                                <span>
                                    현재 무료 버전에서는 제공하지 않습니다.
                                </span>

                            </div>

                            <div className="download-storage-item">

                                <strong>백업</strong>

                                <span>
                                    중요한 자료는 정기적으로 별도 보관하는
                                    것을 권장합니다.
                                </span>

                            </div>

                        </div>

                    </div>

                </section>

                <section
                    className="download-section download-final"
                    id="download"
                >

                    <div className="download-container">

                        <h2>
                            직원관리, 이제 더 간편하게.
                        </h2>

                        <p>
                            Staff Manager를 무료로 시작하세요.
                        </p>

                        {installButton}

                        <div className="download-install-help">

                            <p>
                                무료 다운로드 버튼을 누르면 Windows 설치파일이 다운로드됩니다.
                            </p>

                            <p>
                                다운로드한 설치파일을 실행해 Staff Manager를 설치해 주세요.
                            </p>

                        </div>

                    </div>

                </section>

            </main>

            <footer className="download-footer">

                <div className="download-container download-footer-inner">

                    <div>

                        <strong>Staff Manager</strong>

                        <p>
                            Developer Projects
                        </p>

                    </div>

                    <span>
                        v{packageInfo.version}
                    </span>

                </div>

            </footer>

        </div>

    );

}

export default Download;