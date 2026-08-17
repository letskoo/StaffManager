import {
    createAttendanceApproval,
    analyzeAttendance,
} from "../approval/approvalService";

import {
    calculateBreak,
    getScheduledWorkMinutes,
} from "../break/breakService";

import {
    calculateWorkMinutes,
} from "../pay/workMinuteService";

import {
    removeAttendanceHistory,
    saveAttendanceHistory,
    updateAttendanceHistory,
} from "../history/historyService";

import {
    getAttendanceRecords,
    saveAttendanceRecords,
    getOpenAttendance,
    getAttendanceType,
} from "./attendanceRecordService";

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
 * 출근 처리
 */
export function saveCheckIn(employee) {

    let records =
        getAttendanceRecords();

    /*
     * 같은 날짜에 자동 생성된 결근 기록이 있다면
     * 실제 출근 시 제거한다.
     */
    records = records.filter(

        record =>
            !(
                record.employeeNo === employee.no &&
                record.date === getTodayText() &&
                record.status === "결근"
            )

    );

    removeAttendanceHistory(

        employee.no,

        getTodayText()

    );

    const now = new Date();

    const record = {

        id:
            Date.now(),

        employeeNo:
            employee.no,

        employeeName:
            employee.name,

        date:
            getTodayText(),

        checkIn:
            now.toISOString(),

        checkOut:
            null,

        breaks: [],

        workMinutes: 0,

        status:
            "출근",

        late:
            false,

        earlyLeave:
            false,

        overtime:
            false,

    };

    record.approval =
        createAttendanceApproval({

            record,

            employee,

            absent: false,

        });

    records.unshift(
        record
    );

    saveAttendanceRecords(
        records
    );

    saveAttendanceHistory(
        record
    );

    return record;

}

/*
 * 퇴근 처리
 */
export function saveCheckOut(employee) {

    const records =
        getAttendanceRecords();

    const openRecord =
        getOpenAttendance(
            employee.no
        );

    if (!openRecord) {

        return null;

    }

    const now = new Date();

    let updatedRecord =
        analyzeAttendance(

            {

                ...openRecord,

                checkOut:
                    now.toISOString(),

                status:
                    "퇴근",

            },

            employee

        );

    updatedRecord.workMinutes =
        calculateWorkMinutes(

            updatedRecord,

            employee

        );

    const updatedRecords =
        records.map(

            record =>

                record.id === openRecord.id

                    ? updatedRecord

                    : record

        );

    saveAttendanceRecords(
        updatedRecords
    );

    updateAttendanceHistory(

        updatedRecord.employeeNo,

        updatedRecord.date,

        () => updatedRecord

    );

    return updatedRecord;

}

/*
 * 휴게 시작
 */
export function saveBreakStart(employee) {

    const records =
        getAttendanceRecords();

    const openRecord =
        getOpenAttendance(
            employee.no
        );

    if (!openRecord) {

        return null;

    }

    const totalMinutes =
        getScheduledWorkMinutes(
            employee
        );

    const breakInfo =
        calculateBreak(

            totalMinutes,

            openRecord.breaks || []

        );

    const updatedRecord = {

        ...openRecord,

        breaks: [

            ...(openRecord.breaks || []),

            {

                start:
                    new Date().toISOString(),

                end:
                    null,

            },

        ],

    };

    const updatedRecords =
        records.map(

            record =>

                record.id === openRecord.id

                    ? updatedRecord

                    : record

        );

    saveAttendanceRecords(
        updatedRecords
    );

    return {

        ...updatedRecord,

        breakInfo,

    };

}

/*
 * 휴게 종료
 */
export function saveBreakEnd(employee) {

    const records =
        getAttendanceRecords();

    const openRecord =
        getOpenAttendance(
            employee.no
        );

    if (!openRecord) {

        return null;

    }

    const breaks = [

        ...(openRecord.breaks || []),

    ];

    const lastBreak =
        breaks[
            breaks.length - 1
        ];

    if (
        !lastBreak ||
        lastBreak.end
    ) {

        return null;

    }

    lastBreak.end =
        new Date().toISOString();

    const updatedRecord = {

        ...openRecord,

        breaks,

    };

    const updatedRecords =
        records.map(

            record =>

                record.id === openRecord.id

                    ? updatedRecord

                    : record

        );

    const totalMinutes =
        getScheduledWorkMinutes(
            employee
        );

    const breakInfo =
        calculateBreak(

            totalMinutes,

            updatedRecord.breaks || []

        );

    saveAttendanceRecords(
        updatedRecords
    );

    return {

        ...updatedRecord,

        breakInfo,

    };

}

/*
 * 출퇴근 처리
 *
 * 현재 열린 근태기록이 있으면 퇴근,
 * 없으면 출근 처리한다.
 */
export function processAttendance(employee) {

    const nextType =
        getAttendanceType(
            employee.no
        );

    if (
        nextType === "checkout"
    ) {

        return {

            type:
                "checkout",

            record:
                saveCheckOut(
                    employee
                ),

        };

    }

    return {

        type:
            "checkin",

        record:
            saveCheckIn(
                employee
            ),

    };

}