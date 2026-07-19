import {
    getEmployeeMonthlyAttendanceStatus,
} from "../services/attendanceService";

import "../styles/employee-attendance-status.css";

function EmployeeAttendanceStatus({
    employee,
    month,
    monthLabel,
    moveMonth,
    selectedMonth,
}) {

    const attendanceDays =
        getEmployeeMonthlyAttendanceStatus(
            employee,
            month
        );

    const now = new Date();

    const currentMonth =
        `${now.getFullYear()}-${String(
            now.getMonth() + 1
        ).padStart(2, "0")}`;

    const renderStatusDot = (status) => {

        if (!status) {

            return null;

        }

        if (status === "off") {

            return (

                <span className="attendance-off">
                    ✕
                </span>

            );

        }

        return (

            <span
                className={`attendance-dot ${status}`}
            />

        );

    };

    return (

        <div className="employee-attendance-status">

            <div className="attendance-header">

                <div className="attendance-month-nav">

                    <button
                        type="button"
                        aria-label="이전 달"
                        onClick={() => moveMonth(-1)}
                    >
                        〈
                    </button>

                    <span>
                        {monthLabel}
                    </span>

                    <button
                        type="button"
                        aria-label="다음 달"
                        disabled={
                            selectedMonth === currentMonth
                        }
                        onClick={() => moveMonth(1)}
                    >
                        〉
                    </button>

                </div>

                <div className="attendance-legend">

                    <span>
                        <i className="normal"></i>
                        정상근무
                    </span>

                    <span>
                        <i className="absent"></i>
                        결근
                    </span>

                    <span>
                        <i className="off">✕</i>
                        비번
                    </span>

                    <span>
                        <i className="approved"></i>
                        승인
                    </span>

                    <span>
                        <i className="waiting"></i>
                        승인대기
                    </span>

                    <span>
                        <i className="empty"></i>
                        미입력
                    </span>

                </div>

            </div>

            <table className="attendance-table">

                <thead>

                    <tr>

                        <th
                            style={{
                                width: "65px",
                            }}
                        ></th>

                        {attendanceDays.map(
                            item => (

                                <th key={item.day}>

                                    {item.isToday ? (

                                        <span className="attendance-today-circle">

                                            {item.day}

                                        </span>

                                    ) : (

                                        item.day

                                    )}

                                </th>

                            )
                        )}

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td className="attendance-label">

                            출근

                        </td>

                        {attendanceDays.map(
                            item => (

                                <td key={item.day}>

                                    {renderStatusDot(
                                        item.checkIn
                                    )}

                                </td>

                            )
                        )}

                    </tr>

                    <tr>

                        <td className="attendance-label">

                            퇴근

                        </td>

                        {attendanceDays.map(
                            item => (

                                <td key={item.day}>

                                    {renderStatusDot(
                                        item.checkOut
                                    )}

                                </td>

                            )
                        )}

                    </tr>

                </tbody>

            </table>

        </div>

    );

}

export default EmployeeAttendanceStatus;