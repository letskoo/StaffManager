import "../styles/dashboard.css";

function DashboardAttendanceSummary() {

    return (

        <div className="detail-card">

            <h2>

                이번 달 근태 요약

            </h2>

            <div className="attendance-summary-grid">

                <div>

                    <span>지각</span>

                    <strong>0건</strong>

                </div>

                <div>

                    <span>조퇴</span>

                    <strong>0건</strong>

                </div>

                <div>

                    <span>결근</span>

                    <strong>0건</strong>

                </div>

                <div>

                    <span>연장</span>

                    <strong>0건</strong>

                </div>

            </div>

        </div>

    );

}

export default DashboardAttendanceSummary;