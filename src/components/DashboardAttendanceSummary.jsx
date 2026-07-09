import "../styles/dashboard.css";

import useEmployees from "../hooks/useEmployees";

import {
    getAttendanceRecords,
} from "../services/attendanceService";

import {
    getMonthlyAbsentCount,
} from "../services/salaryService";

function DashboardAttendanceSummary() {

    const { employees } = useEmployees();

    const records = getAttendanceRecords();

    const late =
        records.filter(
            item => item.late
        ).length;

    const early =
        records.filter(
            item => item.earlyLeave
        ).length;

    const overtime =
        records.filter(
            item => item.overtime
        ).length;

    const absent =
        employees.reduce(
            (sum, employee) =>
                sum + getMonthlyAbsentCount(employee),
            0
        );

    return (

        <div className="detail-card">

            <h2>

                이번 달 근태 요약

            </h2>

            <div className="attendance-summary-grid">

                <div>

                    <span>지각</span>

                    <strong>{late}건</strong>

                </div>

                <div>

                    <span>조퇴</span>

                    <strong>{early}건</strong>

                </div>

                <div>

                    <span>결근</span>

                    <strong>{absent}건</strong>

                </div>

                <div>

                    <span>연장</span>

                    <strong>{overtime}건</strong>

                </div>

            </div>

        </div>

    );

}

export default DashboardAttendanceSummary;