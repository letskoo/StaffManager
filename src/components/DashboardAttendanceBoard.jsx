import {
    Fragment,
    useMemo,
    useState,
} from "react";

import useEmployees from "../hooks/useEmployees";

import {
    getEmployeeMonthlyAttendanceStatus,
} from "../services/attendanceService";

import "../styles/employee-attendance-status.css";

function DashboardAttendanceBoard() {

    const [selectedMonth, setSelectedMonth] = useState(() => {

        const now = new Date();

        return `${now.getFullYear()}-${String(
            now.getMonth() + 1
        ).padStart(2, "0")}`;

    });

    const moveMonth = (offset) => {

        const [year, month] =
            selectedMonth.split("-").map(Number);

        const date = new Date(year, month - 1 + offset);

        setSelectedMonth(
            `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`
        );

    };

    const monthLabel = (() => {

        const [year, month] =
            selectedMonth.split("-");

        return `${year}년 ${Number(month)}월`;

    })();

    const {

        employees,

    } = useEmployees();

    const now = new Date();

    const currentMonth =
        `${now.getFullYear()}-${String(
            now.getMonth() + 1
        ).padStart(2, "0")}`;

    const attendanceDays = useMemo(() => {

        const [year, month] =
            selectedMonth.split("-").map(Number);

        const totalDays =
            new Date(year, month, 0).getDate();

        return Array.from(
            { length: totalDays },
            (_, index) => {

                const day = index + 1;

                const date = new Date(
                    year,
                    month - 1,
                    day
                );

                return {

                    day,

                    isToday:
                        date.toDateString() ===
                        new Date().toDateString(),

                };

            }
        );

    }, [selectedMonth]);

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

            <h2 className="dashboard-attendance-title">

                전체 직원 출석부

            </h2>

            <div className="attendance-header">

                <div className="attendance-month-nav">

                    <button
                        type="button"
                        onClick={() => moveMonth(-1)}
                    >
                        〈
                    </button>

                    <span>

                        {monthLabel}

                    </span>

                    <button
                        type="button"
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
                                width: "180px",
                            }}
                        >

                            직원

                        </th>

                        <th
                            style={{
                                width: "70px",
                            }}
                        >

                            구분

                        </th>

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

                    {employees.map(employee => {

                        const employeeAttendance =
                            getEmployeeMonthlyAttendanceStatus(
                                employee,
                                selectedMonth
                            );

                        return (

                            <Fragment key={employee.no}>

                                <tr className="attendance-row-small attendance-checkin-row">

                                    <td
                                        className="attendance-label"
                                        rowSpan={2}
                                    >

                                        {employee.name}

                                    </td>

                                    <td className="attendance-label">

                                        출근

                                    </td>

                                    {employeeAttendance.map(item => (

                                        <td
                                            key={`checkin-${item.day}`}
                                        >

                                            {renderStatusDot(
                                                item.checkIn
                                            )}

                                        </td>

                                    ))}

                                </tr>

                                <tr className="attendance-row-small attendance-checkout-row">

                                    <td className="attendance-label">

                                        퇴근

                                    </td>

                                    {employeeAttendance.map(item => (

                                        <td
                                            key={`checkout-${item.day}`}
                                        >

                                            {renderStatusDot(
                                                item.checkOut
                                            )}

                                        </td>

                                    ))}

                                </tr>

                            </Fragment>

                        );

                    })}

                </tbody>

            </table>

        </div>

    );

}

export default DashboardAttendanceBoard;