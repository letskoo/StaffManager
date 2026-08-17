import {
    createAbsentApproval,
} from "./absentApprovalService";

import {
    getAttendanceRecords,
    saveAttendanceRecords,
} from "../attendance/attendanceRecordService";

import {
    saveAttendanceHistory,
    updateAttendanceHistory,
} from "../history/historyService";

const APPROVAL_MONTH_KEY =
    "approvalMonth";

/*
 * 오늘 날짜
 *
 * YYYY-MM-DD
 */
function getTodayText() {

    const now = new Date();

    return `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}-${String(
        now.getDate()
    ).padStart(2, "0")}`;

}

/*
 * 승인 대기 목록
 */
export function getApprovalList() {

    const records =
        getAttendanceRecords();

    generateAbsentApprovals();

    const latestRecords =
        getAttendanceRecords();

    const result = [];

    latestRecords.forEach((record) => {

        const approval =
            record.approval || {};

        Object.entries(
            approval
        ).forEach(([type, item]) => {

            if (
                item.required &&
                !item.resolved
            ) {

                result.push({

                    ...record,

                    approvalId:
                        `${record.id}-${type}`,

                    recordId:
                        record.id,

                    approvalType:
                        type,

                    approvalStatus:
                        item.status,

                });

            }

        });

    });

    return result;

}

/*
 * 승인 상태 처리
 */
export function updateApprovalStatus(
    id,
    type,
    status
) {

    const records =
        getAttendanceRecords();

    const updated =
        records.map((record) =>

            record.id === id

                ? {

                    ...record,

                    approval: {

                        ...record.approval,

                        [type]: {

                            ...record
                                .approval?.[type],

                            resolved: true,

                            status,

                        },

                    },

                }

                : record

        );

    saveAttendanceRecords(
        updated
    );

    const updatedRecord =
        updated.find(
            record =>
                record.id === id
        );

    if (!updatedRecord) {

        return;

    }

    updateAttendanceHistory(

        updatedRecord.employeeNo,

        updatedRecord.date,

        () => updatedRecord

    );

}

/*
 * 승인 처리 복원
 */
export function restoreApprovalStatus(
    id,
    type
) {

    const records =
        getAttendanceRecords();

    const updated =
        records.map((record) =>

            record.id === id

                ? {

                    ...record,

                    approval: {

                        ...record.approval,

                        [type]: {

                            ...record
                                .approval?.[type],

                            resolved: false,

                            status: null,

                        },

                    },

                }

                : record

        );

    saveAttendanceRecords(
        updated
    );

    const updatedRecord =
        updated.find(
            record =>
                record.id === id
        );

    if (!updatedRecord) {

        return;

    }

    updateAttendanceHistory(

        updatedRecord.employeeNo,

        updatedRecord.date,

        () => updatedRecord

    );

}

/*
 * 처리 완료 승인 목록
 */
export function getResolvedApprovalList() {

    const records =
        getAttendanceRecords();

    const result = [];

    records.forEach((record) => {

        const approval =
            record.approval || {};

        Object.entries(
            approval
        ).forEach(([type, item]) => {

            if (
                item.required &&
                item.resolved
            ) {

                result.push({

                    ...record,

                    approvalId:
                        `${record.id}-${type}`,

                    recordId:
                        record.id,

                    approvalType:
                        type,

                    approvalStatus:
                        item.status,

                });

            }

        });

    });

    return result;

}

/*
 * 결근 승인대기 자동 생성
 */
export function generateAbsentApprovals() {

    clearOldPendingApprovals();

    const employees =
        JSON.parse(
            localStorage.getItem(
                "employees"
            )
        ) || [];

    const records =
        getAttendanceRecords();

    const dayKeys = [
        "sun",
        "mon",
        "tue",
        "wed",
        "thu",
        "fri",
        "sat",
    ];

    employees.forEach(employee => {

        const joinDate =
            employee.join

                ? new Date(
                    `${employee.join}T00:00:00`
                )

                : null;

        if (!joinDate) {

            return;

        }

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );

        for (

            let current =
                new Date(joinDate);

            current <= today;

            current.setDate(
                current.getDate() + 1
            )

        ) {

            const dayKey =
                dayKeys[
                    current.getDay()
                ];

            const schedule =
                employee
                    .weekSchedule?.[
                        dayKey
                    ];

            if (!schedule) {

                continue;

            }

            const dateText =
                `${current.getFullYear()}-${String(
                    current.getMonth() + 1
                ).padStart(2, "0")}-${String(
                    current.getDate()
                ).padStart(2, "0")}`;

            /*
             * 오늘은 계약 출근시간 +30분 이후부터
             * 결근 승인대기를 생성한다.
             */
            if (
                dateText ===
                getTodayText()
            ) {

                const [
                    hour,
                    minute,
                ] =
                    schedule.start
                        .split(":")
                        .map(Number);

                const absentTime =
                    new Date();

                absentTime.setHours(
                    hour
                );

                absentTime.setMinutes(
                    minute + 30
                );

                absentTime.setSeconds(
                    0
                );

                absentTime.setMilliseconds(
                    0
                );

                if (
                    new Date() <=
                    absentTime
                ) {

                    continue;

                }

            }

            const hasOpenAttendance =
                records.some(

                    record =>

                        record.employeeNo ===
                        employee.no &&

                        record.checkIn &&

                        !record.checkOut

                );

            if (hasOpenAttendance) {

                continue;

            }

            const exists =
                records.some(

                    record =>

                        record.employeeNo ===
                        employee.no &&

                        record.date ===
                        dateText

                );

            if (exists) {

                continue;

            }

            const absentRecord =
                createAbsentApproval(

                    employee,

                    dateText

                );

            records.unshift(
                absentRecord
            );

            saveAttendanceHistory(
                absentRecord
            );

        }

    });

    const before =
        JSON.stringify(
            getAttendanceRecords()
        );

    const after =
        JSON.stringify(
            records
        );

    if (
        before !== after
    ) {

        saveAttendanceRecords(
            records
        );

    }

}

/*
 * 월 변경 확인
 *
 * 근태기록 자체는 삭제하지 않는다.
 */
export function clearOldPendingApprovals() {

    const currentMonth =
        getTodayText()
            .slice(0, 7);

    const savedMonth =
        localStorage.getItem(
            APPROVAL_MONTH_KEY
        );

    if (
        savedMonth ===
        currentMonth
    ) {

        return;

    }

    localStorage.setItem(

        APPROVAL_MONTH_KEY,

        currentMonth

    );

}