import {
    isHoliday,
} from "../HolidayService";

import {
    getAttendanceHistory,
} from "../history/historyService";

/*
 * 월별 근태 요약
 */
export function getMonthlyAttendanceSummary(
    employeeNo
) {

    const history =
        getAttendanceHistory() || [];

    const employees =
        JSON.parse(
            localStorage.getItem("employees")
        ) || [];

    const employee =
        employees.find(
            item =>
                item.no === employeeNo
        );

    const now =
        new Date();

    const month =
        `${now.getFullYear()}-${String(
            now.getMonth() + 1
        ).padStart(2, "0")}`;

    const records =
        history.filter(
            (record) =>
                record.employeeNo === employeeNo &&
                record.date.startsWith(month)
        );

    return {

        checkIn:
            records.length,

        checkOut:
            records.filter(
                record =>
                    record.checkOut
            ).length,

        late:
            records.filter(
                record =>
                    record.late
            ).length,

        earlyLeave:
            records.filter(
                record =>
                    record.earlyLeave
            ).length,

        absent:
            employee
                ? getMonthlyAbsentCount(
                    employee,
                    month
                )
                : 0,

    };

}

/*
 * 월별 결근 횟수
 *
 * 결근 승인 완료된 기록만
 * 실제 결근으로 계산한다.
 */
export function getMonthlyAbsentCount(
    employee,
    month = null
) {

    const history =
        getAttendanceHistory() || [];

    const now =
        new Date();

    const targetMonth =
        month ||
        `${now.getFullYear()}-${String(
            now.getMonth() + 1
        ).padStart(2, "0")}`;

    const weekSchedule =
        employee.weekSchedule || {};

    if (
        Object.keys(
            weekSchedule
        ).length === 0
    ) {

        return 0;

    }

    const dayKeys = [
        "sun",
        "mon",
        "tue",
        "wed",
        "thu",
        "fri",
        "sat",
    ];

    const monthStart =
        new Date(
            `${targetMonth}-01T00:00:00`
        );

    const monthEnd =
        new Date(
            monthStart.getFullYear(),
            monthStart.getMonth() + 1,
            0
        );

    const today =
        new Date();

    const endDate =

        today.getFullYear() ===
            monthStart.getFullYear() &&

            today.getMonth() ===
            monthStart.getMonth()

            ? new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - 1
            )

            : monthEnd;

    const joinDate =
        employee.join

            ? new Date(
                `${employee.join}T00:00:00`
            )

            : monthStart;

    let absent = 0;

    const current =
        new Date(
            monthStart
        );

    while (
        current <= endDate
    ) {

        if (
            current >= joinDate
        ) {

            const dayKey =
                dayKeys[
                current.getDay()
                ];

            if (
                weekSchedule[
                dayKey
                ]
            ) {

                const dateText =
                    `${current.getFullYear()}-${String(
                        current.getMonth() + 1
                    ).padStart(2, "0")}-${String(
                        current.getDate()
                    ).padStart(2, "0")}`;

                const absentRecord =
                    history.find(
                        record =>
                            record.employeeNo ===
                            employee.no &&

                            record.date ===
                            dateText &&

                            record.status ===
                            "결근"
                    );

                if (
                    absentRecord &&

                    absentRecord
                        .approval
                        ?.absent
                        ?.status ===
                    "approved"
                ) {

                    absent++;

                }

            }

        }

        current.setDate(
            current.getDate() + 1
        );

    }

    return absent;

}

/*
 * 직원 월별 근태 상태
 *
 * 월간 캘린더에서 사용할
 * 날짜별 출근/퇴근 상태를 생성한다.
 */
export function getEmployeeMonthlyAttendanceStatus(
    employee,
    month = null
) {

    const history =
        getAttendanceHistory() || [];

    const now = new Date();

    const targetMonth =
        month ||
        `${now.getFullYear()}-${String(
            now.getMonth() + 1
        ).padStart(2, "0")}`;

    const [year, monthNumber] =
        targetMonth
            .split("-")
            .map(Number);

    const monthIndex =
        monthNumber - 1;

    const daysInMonth =
        new Date(
            year,
            monthNumber,
            0
        ).getDate();

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    const dayKeys = [
        "sun",
        "mon",
        "tue",
        "wed",
        "thu",
        "fri",
        "sat",
    ];

    /*
     * 승인 상태 확인
     */
    const getApprovalState = (
        approval,
        types
    ) => {

        const items =
            types
                .map(
                    type =>
                        approval?.[type]
                )
                .filter(Boolean);

        const waiting =
            items.some(
                item =>
                    item.required &&
                    !item.resolved
            );

        if (waiting) {

            return "waiting";

        }

        const approved =
            items.some(
                item =>
                    item.required &&
                    item.resolved &&
                    item.status ===
                    "approved"
            );

        if (approved) {

            return "approved";

        }

        return null;

    };

    /*
     * 날짜 상태 공통 생성
     */
    const createDayStatus = ({

        day,

        date,

        dateText,

        dayKey,

        isWorkDay,

        checkIn,

        checkOut,

    }) => {

        const dayNumber =
            date.getDay();

        return {

            day,

            date:
                dateText,

            dayKey,

            isWorkDay,

            isPast:
                date < today,

            isToday:
                date.getTime() ===
                today.getTime(),

            isFuture:
                date > today,

            isWeekend:
                dayNumber === 0 ||
                dayNumber === 6,

            isHoliday:
                isHoliday(date),

            checkIn,

            checkOut,

        };

    };

    return Array.from(
        {
            length:
                daysInMonth,
        },
        (_, index) => {

            const day =
                index + 1;

            const date =
                new Date(
                    year,
                    monthIndex,
                    day
                );

            date.setHours(
                0,
                0,
                0,
                0
            );

            const dateText =
                `${year}-${String(
                    monthNumber
                ).padStart(2, "0")}-${String(
                    day
                ).padStart(2, "0")}`;

            const dayKey =
                dayKeys[
                date.getDay()
                ];

            const isWorkDay =
                Boolean(
                    employee
                        .weekSchedule?.[
                    dayKey
                    ]
                );

            /*
             * 공통 날짜 정보를 포함한
             * 상태 생성
             */
            const createStatus = (
                checkIn,
                checkOut
            ) => {

                return createDayStatus({

                    day,

                    date,

                    dateText,

                    dayKey,

                    isWorkDay,

                    checkIn,

                    checkOut,

                });

            };

            /*
             * 미래 날짜
             */
            if (
                date > today
            ) {

                return createStatus(
                    null,
                    null
                );

            }

            /*
             * 휴무일
             */
            if (
                !isWorkDay
            ) {

                return createStatus(
                    "off",
                    "off"
                );

            }

            const record =
                history.find(
                    item =>
                        item.employeeNo ===
                        employee.no &&
                        item.date ===
                        dateText
                );

            /*
             * 근무일이지만 기록 없음
             */
            if (
                !record
            ) {

                return createStatus(
                    "empty",
                    "empty"
                );

            }

            /*
             * 결근 기록
             */
            if (
                record.status ===
                "결근"
            ) {

                const absentApproval =
                    record
                        .approval
                        ?.absent;

                /*
                 * 결근 승인대기
                 */
                if (
                    absentApproval
                        ?.required &&
                    !absentApproval
                        ?.resolved
                ) {

                    return createStatus(
                        "waiting",
                        "waiting"
                    );

                }

                /*
                 * 결근 승인
                 */
                if (
                    absentApproval
                        ?.status ===
                    "approved"
                ) {

                    return createStatus(
                        "absent",
                        "absent"
                    );

                }

                /*
                 * 결근 거절
                 */
                if (
                    absentApproval
                        ?.status ===
                    "rejected"
                ) {

                    return createStatus(
                        "approved",
                        "approved"
                    );

                }

                /*
                 * 승인 정보가 없는 결근
                 */
                return createStatus(
                    "empty",
                    "empty"
                );

            }

            /*
             * 출근 관련 승인 상태
             */
            const checkInApprovalState =
                getApprovalState(
                    record.approval,
                    [
                        "earlyCheckIn",
                        "late",
                    ]
                );

            /*
             * 퇴근 관련 승인 상태
             */
            const checkOutApprovalState =
                getApprovalState(
                    record.approval,
                    [
                        "earlyLeave",
                        "overtime",
                        "night",
                        "holiday",
                    ]
                );

            const checkInStatus =
                checkInApprovalState ||
                (
                    record.checkIn
                        ? "normal"
                        : "empty"
                );

            const checkOutStatus =
                checkOutApprovalState ||
                (
                    record.checkOut
                        ? "normal"
                        : "empty"
                );

            return createStatus(
                checkInStatus,
                checkOutStatus
            );

        }
    );

}