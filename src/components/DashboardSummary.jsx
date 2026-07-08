import "../styles/dashboard.css";

function DashboardSummary() {

    return (

        <div className="dashboard-summary">

            <div className="detail-card dashboard-card">

                <span className="dashboard-card-title">
                    직원수
                </span>

                <strong className="dashboard-card-value">
                    0명
                </strong>

            </div>

            <div className="detail-card dashboard-card">

                <span className="dashboard-card-title">
                    미승인 현황
                </span>

                <strong className="dashboard-card-value">
                    0건
                </strong>

            </div>

            <div className="detail-card dashboard-card">

                <span className="dashboard-card-title">
                    이달의 예상 총 급여
                </span>

                <strong className="dashboard-card-value">
                    0원
                </strong>

            </div>

            <div className="detail-card dashboard-card">

                <span className="dashboard-card-title">
                    예상 누적 퇴직금
                </span>

                <strong className="dashboard-card-value">
                    0원
                </strong>

            </div>

        </div>

    );

}

export default DashboardSummary;