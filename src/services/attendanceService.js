import { isHoliday } from "./HolidayService";

const STORAGE_KEY = "attendanceRecords";

const HISTORY_KEY = "attendanceHistory";

const APPROVAL_MONTH_KEY = "approvalMonth";

function getTodayText() {

    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

}

function isEnabled(value) {

    return (

        value === true ||

        value === "true" ||

        value === 1 ||

        value === "1"

    );

}

const DAY_KEYS = [
    "sun",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
];

function getScheduledDateTime(record, employee) {

    const workPolicy =
        employee.workPolicy || {};

    const workDate = new Date(
        `${record.date}T00:00:00`
    );

    const dayKey =
        DAY_KEYS[workDate.getDay()];

    const schedule =
        employee.weekSchedule?.[dayKey];

    const startText =
        schedule?.start ||
        workPolicy.startTime ||
        "09:00";

    const endText =
        schedule?.end ||
        workPolicy.endTime ||
        "18:00";

    const startTime = new Date(
        `${record.date}T${startText}:00`
    );

    const endTime = new Date(
        `${record.date}T${endText}:00`
    );

    if (endTime <= startTime) {

        endTime.setDate(
            endTime.getDate() + 1
        );

    }

    return {

        startTime,

        endTime,

    };

}

export function getAttendanceRecords() {

    const saved = localStorage.getItem(STORAGE_KEY);

    return saved ? JSON.parse(saved) : [];

}

export function saveAttendanceRecords(records) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(records)
    );

}

export function saveAttendanceHistory(record) {

    const saved = localStorage.getItem(HISTORY_KEY);

    const history = saved
        ? JSON.parse(saved)
        : [];

    history.unshift(record);

    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history)
    );
}

export function getTodayAttendance(employeeNo) {

    const today = getTodayText();

    return getAttendanceRecords().find(

        (record) =>

            record.employeeNo === employeeNo &&

            record.date === today &&

            record.status === "출근" &&

            Boolean(record.checkIn) &&

            !record.checkOut

    );

}

export function getNextAttendanceType(employeeNo) {

    const openRecord = getTodayAttendance(employeeNo);

    if (openRecord) {

        return "checkout";

    }

    const today = getTodayText();

    const todayFinished = getAttendanceRecords().find(

        (record) =>

            record.employeeNo === employeeNo &&

            record.date === today &&

            record.status === "퇴근" &&

            Boolean(record.checkIn) &&

            Boolean(record.checkOut)

    );

    if (todayFinished) {

        return "done";

    }

    return "checkin";

}

export function getAttendanceType(employeeNo) {

    return getNextAttendanceType(employeeNo);

}

export function saveCheckIn(employee) {

    let records = getAttendanceRecords();

    records = records.filter(
        record =>
            !(
                record.employeeNo === employee.no &&
                record.date === getTodayText() &&
                record.status === "결근"
            )
    );

    const history =
        JSON.parse(
            localStorage.getItem(HISTORY_KEY)
        ) || [];

    const updatedHistory =
        history.filter(

            record =>

                !(

                    record.employeeNo === employee.no &&

                    record.date === getTodayText() &&

                    record.status === "결근"

                )

        );

    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(updatedHistory)
    );

    const now = new Date();

    const record = {

        id: Date.now(),

        employeeNo: employee.no,

        employeeName: employee.name,

        date: getTodayText(),

        checkIn: now.toISOString(),

        checkOut: null,

        workMinutes: 0,

        status: "출근",

        late: false,

        earlyLeave: false,

        overtime: false,

        approval: {
            earlyCheckIn: {
                required: false,
                resolved: false,
                status: null,
            },
            late: {
                required: false,
                resolved: false,
                status: null,
            },
            earlyLeave: {
                required: false,
                resolved: false,
                status: null,
            },
            overtime: {
                required: false,
                resolved: false,
                status: null,
            },
            night: {
                required: false,
                resolved: false,
                status: null,
            },
            absent: {
                required: false,
                resolved: false,
                status: null,
            },
        },

    };

    records.unshift(record);

    saveAttendanceRecords(records);

    saveAttendanceHistory(record);

    return record;

}

export function saveCheckOut(employee) {

    const records = getAttendanceRecords();

    const todayRecord = getTodayAttendance(employee.no);

    if (!todayRecord) {

        return null;

    }

    const now = new Date();

    let updatedRecord = analyzeAttendance(

        {

            ...todayRecord,

            checkOut: now.toISOString(),

            status: "퇴근",

        },

        employee

    );

    updatedRecord.workMinutes = calculateWorkMinutes(

        updatedRecord,

        employee

    );

    const updatedRecords = records.map((record) =>

        record.id === todayRecord.id

            ? updatedRecord

            : record

    );

    saveAttendanceRecords(updatedRecords);

    const history = JSON.parse(

        localStorage.getItem(HISTORY_KEY)

    ) || [];

    const updatedHistory = history.map((item) =>

        item.id === updatedRecord.id

            ? updatedRecord

            : item

    );

    localStorage.setItem(

        HISTORY_KEY,

        JSON.stringify(updatedHistory)

    );

    return updatedRecord;

}

export function processAttendance(employee) {

    const nextType = getNextAttendanceType(employee.no);

    if (nextType === "checkin") {

        const record = saveCheckIn(employee);

        return {

            type: "checkin",

            record,

        };

    }

    if (nextType === "checkout") {

        const record = saveCheckOut(employee);

        return {

            type: "checkout",

            record,

        };

    }

    return {

        type: "done",

        record: getTodayAttendance(employee.no),

    };

}

export function analyzeAttendance(record, employee) {

    const workPolicy = employee.workPolicy;

    const systemPolicy = JSON.parse(

        localStorage.getItem("policy")

    ) || {};

    const {

        startTime,

        endTime,

    } = getScheduledDateTime(

        record,

        employee

    );

    const checkIn = new Date(record.checkIn);

    const checkOut = new Date(record.checkOut);

    const lateLimit =
        systemPolicy.lateLimit ?? 5;

    const earlyLeaveLimit =
        systemPolicy.earlyLeaveLimit ?? 10;

    const overtimeLimit =
        systemPolicy.overtimeLimit ?? 15;

    const earlyPayExcludeMinutes =
        systemPolicy.earlyPayExcludeMinutes ?? 30;

    const late =
        checkIn >
        new Date(
            startTime.getTime()
            + lateLimit * 60000
        );

    const earlyLeave =
        checkOut <
        new Date(
            endTime.getTime()
            - earlyLeaveLimit * 60000
        );

    const overtime =
        checkOut >
        new Date(
            endTime.getTime()
            + overtimeLimit * 60000
        );

    const night =

        checkOut >

        new Date(
            `${record.date}T22:00:00`
        );

    const earlyCheckInApprovalRequired =
        checkIn <
        new Date(
            startTime.getTime()
            - earlyPayExcludeMinutes * 60000
        );

    return {

        ...record,

        late,

        earlyLeave,

        overtime,

        earlyCheckInApprovalRequired,

        approval: {
            earlyCheckIn: {
                required: earlyCheckInApprovalRequired,
                resolved: record.approval?.earlyCheckIn?.resolved || false,
                status: record.approval?.earlyCheckIn?.status || null,
            },
            late: {
                required: late,
                resolved: record.approval?.late?.resolved || false,
                status: record.approval?.late?.status || null,
            },
            earlyLeave: {
                required: earlyLeave,
                resolved: record.approval?.earlyLeave?.resolved || false,
                status: record.approval?.earlyLeave?.status || null,
            },
            overtime: {
                required: overtime,
                resolved: record.approval?.overtime?.resolved || false,
                status: record.approval?.overtime?.status || null,
            },

            night: {
                required: night,
                resolved: record.approval?.night?.resolved || false,
                status: record.approval?.night?.status || null,
            },

            absent: {
                required: record.approval?.absent?.required || false,
                resolved: record.approval?.absent?.resolved || false,
                status: record.approval?.absent?.status || null,
            },
        },

    };

}

export function calculateWorkMinutes(record, employee) {

    if (!record.checkOut) {

        return 0;

    }

    const workPolicy = employee.workPolicy || {};

    const systemPolicy = JSON.parse(

        localStorage.getItem("policy")

    ) || {};

    const checkIn = new Date(record.checkIn);

    const checkOut = new Date(record.checkOut);

    const workDate = record.date || getTodayText();

    const startTime = new Date(

        `${workDate}T${workPolicy.startTime || "09:00"}:00`

    );

    const earlyPayExcludeMinutes =

        systemPolicy.earlyPayExcludeMinutes ?? 30;

    const earlyLimit = new Date(

        startTime.getTime() -

        earlyPayExcludeMinutes * 60000

    );

    let payStartTime = checkIn;

    if (

        checkIn >= earlyLimit &&

        checkIn < startTime

    ) {

        payStartTime = startTime;

    }

    if (

        checkIn < earlyLimit &&

        !record.approved

    ) {

        payStartTime = startTime;

    }

    const totalMinutes = Math.floor(

        (checkOut - payStartTime) / 1000 / 60

    );

    let breakMinutes = 0;

    if (workPolicy.breakEnabled) {

        if (totalMinutes >= 960) {

            breakMinutes = 120;

        } else if (totalMinutes >= 720) {

            breakMinutes = 90;

        } else if (totalMinutes >= 480) {

            breakMinutes = 60;

        } else if (totalMinutes >= 240) {

            breakMinutes = 30;

        }

    }

    return Math.max(

        totalMinutes - breakMinutes,

        0

    );

}

function getOverlapMinutes(

    start1,
    end1,
    start2,
    end2

) {

    const start = Math.max(

        start1.getTime(),

        start2.getTime()

    );

    const end = Math.min(

        end1.getTime(),

        end2.getTime()

    );

    if (end <= start) {

        return 0;

    }

    return Math.floor(

        (end - start) / 60000

    );

}

function getNightMinutes(record) {

    if (!record.checkOut) {

        return 0;

    }

    const checkIn = new Date(record.checkIn);

    const checkOut = new Date(record.checkOut);

    let total = 0;

    const current = new Date(checkIn);

    current.setHours(0, 0, 0, 0);

    while (current <= checkOut) {

        const nightStart = new Date(current);

        nightStart.setHours(22, 0, 0, 0);

        const nightEnd = new Date(current);

        nightEnd.setDate(

            nightEnd.getDate() + 1

        );

        nightEnd.setHours(6, 0, 0, 0);

        total += getOverlapMinutes(

            checkIn,

            checkOut,

            nightStart,

            nightEnd

        );

        current.setDate(

            current.getDate() + 1

        );

    }

    return total;

}

function getHolidayMinutes(record) {

    if (!record.checkOut) {

        return {

            holidayMinutes: 0,

            normalMinutes: 0,

        };

    }

    let holidayMinutes = 0;

    let normalMinutes = 0;

    const start = new Date(record.checkIn);

    const end = new Date(record.checkOut);

    const current = new Date(start);

    while (current < end) {

        const next = new Date(current);

        next.setMinutes(next.getMinutes() + 1);

        if (isHoliday(current)) {

            holidayMinutes++;

        } else {

            normalMinutes++;

        }

        current.setMinutes(current.getMinutes() + 1);

    }

    return {

        holidayMinutes,

        normalMinutes,

    };

}

function splitWorkMinutesByHoliday(record) {

    if (!record.checkOut) {

        return {

            holidayMinutes: 0,

            normalMinutes: 0,

        };

    }

    const checkIn = new Date(record.checkIn);

    const checkOut = new Date(record.checkOut);

    let holidayMinutes = 0;

    const current = new Date(checkIn);

    current.setHours(0, 0, 0, 0);

    while (current <= checkOut) {

        const dayStart = new Date(current);

        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date(current);

        dayEnd.setHours(24, 0, 0, 0);

        if (isHoliday(dayStart)) {

            holidayMinutes += getOverlapMinutes(

                checkIn,

                checkOut,

                dayStart,

                dayEnd

            );

        }

        current.setDate(

            current.getDate() + 1

        );

    }

    const totalMinutes = Math.floor(

        (checkOut - checkIn) / 60000

    );

    return {

        holidayMinutes,

        normalMinutes:

            Math.max(

                totalMinutes - holidayMinutes,

                0

            ),

    };

}

function getHourlyPay(employee) {

    const workPolicy = employee.workPolicy;

    if (!workPolicy) {

        return 0;

    }

    if (workPolicy.payType === "hourly") {

        return Number(workPolicy.hourlyWage || 0);

    }

    return Number(workPolicy.monthlySalary || 0) / 209;

}

export function calculatePayDetail(record, employee) {

    const emptyPayDetail = {
        baseMinutes: 0,
        overtimeMinutes: 0,
        nightMinutes: 0,
        holidayMinutes: 0,
        lateMinutes: 0,
        earlyLeaveMinutes: 0,
        basePay: 0,
        overtimePay: 0,
        nightPay: 0,
        holidayPay: 0,
        lateDeduction: 0,
        earlyLeaveDeduction: 0,
        totalPay: 0,
    };

    const workPolicy = employee.workPolicy;

    if (!workPolicy) {

        return emptyPayDetail;

    }

    if (
        !record ||
        !record.checkIn ||
        !record.checkOut
    ) {

        return emptyPayDetail;

    }

    const checkInDate = new Date(record.checkIn);

    const checkOutDate = new Date(record.checkOut);

    if (
        Number.isNaN(checkInDate.getTime()) ||
        Number.isNaN(checkOutDate.getTime()) ||
        checkOutDate <= checkInDate
    ) {

        return emptyPayDetail;

    }

    const hourlyPay = getHourlyPay(employee);

    const approval = record.approval || {};

    const lateDeductionApproved =

        record.late === true &&

        approval.late?.status === "approved";

    const earlyLeaveDeductionApproved =

        record.earlyLeave === true &&

        approval.earlyLeave?.status === "approved";

    const earlyCheckInApproved =

        approval.earlyCheckIn?.status === "approved";

    const overtimeApproved =

        approval.overtime?.status === "approved";

    const nightApproved =
        approval.night?.status === "approved";

    const holidayInfo =
        splitWorkMinutesByHoliday(record);

    const {

        startTime,

        endTime,

    } = getScheduledDateTime(

        record,

        employee

    );

    const checkIn = new Date(record.checkIn);

    const checkOut = new Date(record.checkOut);

    let payStart = startTime;

    if (checkIn < startTime) {

        payStart =
            earlyCheckInApproved
                ? checkIn
                : startTime;

    } else if (record.late === true) {

        payStart =
            lateDeductionApproved
                ? checkIn
                : startTime;

    }

    let payEnd = endTime;

    if (checkOut > endTime) {

        payEnd =
            overtimeApproved
                ? checkOut
                : endTime;

    } else if (record.earlyLeave === true) {

        payEnd =
            earlyLeaveDeductionApproved
                ? checkOut
                : endTime;

    }

    const scheduledMinutes =
        Math.max(
            Math.floor(
                (endTime - startTime) / 60000
            ),
            1
        );

    const lateMinutes =
        lateDeductionApproved
            ? Math.max(
                Math.floor(
                    (checkIn - startTime) / 60000
                ),
                0
            )
            : 0;

    const earlyLeaveMinutes =
        earlyLeaveDeductionApproved
            ? Math.max(
                Math.floor(
                    (endTime - checkOut) / 60000
                ),
                0
            )
            : 0;

    const approvedMinutes =
        Math.max(
            Math.floor(
                (payEnd - payStart) / 60000
            ),
            0
        );

    const baseMinutes =
        Math.min(
            approvedMinutes,
            scheduledMinutes
        );

    const actualOvertimeMinutes =
        Math.max(
            approvedMinutes - scheduledMinutes,
            0
        );

    const overtimeMinutes =
        isEnabled(workPolicy.allowOvertime)
            ? actualOvertimeMinutes
            : 0;

    const nightMinutes = getNightMinutes({
        ...record,
        checkIn: payStart.toISOString(),
        checkOut: payEnd.toISOString(),
    });

    const isHolidayWork =

        record.isHoliday === true ||

        record.holidayWork === true;

    const allowHoliday = isEnabled(

        workPolicy.allowHoliday ??

        employee.allowHoliday

    );

    let basePay = 0;

    let lateDeduction = 0;

    let earlyLeaveDeduction = 0;

    if (workPolicy.payType === "monthly") {

        lateDeduction =
            lateMinutes / 60 *
            hourlyPay;

        earlyLeaveDeduction =
            earlyLeaveMinutes / 60 *
            hourlyPay;

    } else {

        basePay =
            baseMinutes / 60 *
            hourlyPay;

    }

    let overtimePay = 0;

    if (overtimeMinutes > 0) {

        overtimePay =
            overtimeMinutes / 60 *
            hourlyPay *
            0.5;

    } else {

        basePay +=

            overtimeMinutes / 60 *

            hourlyPay;

    }

    let nightPay = 0;

    if (

        nightApproved &&

        isEnabled(workPolicy.allowNight) &&

        nightMinutes > 0

    ) {

        nightPay =

            nightMinutes / 60 *

            hourlyPay *

            0.5;

    }

    let holidayPay = 0;

    if (

        allowHoliday &&

        holidayInfo.holidayMinutes > 0

    ) {

        const holidayBaseMinutes =

            Math.min(

                holidayInfo.holidayMinutes,

                480

            );

        const holidayOverMinutes =

            Math.max(

                holidayInfo.holidayMinutes - 480,

                0

            );

        // 월급제

        if (workPolicy.payType === "monthly") {

            holidayPay =

                holidayBaseMinutes / 60 *

                hourlyPay *

                1.5 +

                holidayOverMinutes / 60 *

                hourlyPay *

                2.0;

        }

        // 시급제

        else {

            holidayPay =

                holidayBaseMinutes / 60 *

                hourlyPay *

                2.5 +

                holidayOverMinutes / 60 *

                hourlyPay *

                3.0;

        }

    }

    if (approvedMinutes <= 0) {

        basePay = 0;

        overtimePay = 0;

        nightPay = 0;

        holidayPay = 0;

    }

    const totalPay = Math.floor(

        basePay +

        overtimePay +

        nightPay +

        holidayPay

    );

    return {

        baseMinutes,

        overtimeMinutes,

        nightMinutes,

        holidayMinutes:
            holidayInfo.holidayMinutes,

        lateMinutes,

        earlyLeaveMinutes,

        basePay:
            Math.floor(basePay),

        overtimePay:
            Math.floor(overtimePay),

        nightPay:
            Math.floor(nightPay),

        holidayPay:
            Math.floor(holidayPay),

        lateDeduction:
            Math.floor(lateDeduction),

        earlyLeaveDeduction:
            Math.floor(earlyLeaveDeduction),

        totalPay,

    };

}

export function calculateDailyPay(record, employee) {

    return calculatePayDetail(

        record,

        employee

    ).totalPay;

}

export function getApprovalList() {

    const records = getAttendanceRecords();

    generateAbsentApprovals();

    const latestRecords = getAttendanceRecords();

    const result = [];

    latestRecords.forEach((record) => {

        const approval = record.approval || {};

        Object.entries(approval).forEach(([type, item]) => {

            if (item.required && !item.resolved) {

                result.push({

                    ...record,

                    approvalId: `${record.id}-${type}`,

                    recordId: record.id,

                    approvalType: type,

                    approvalStatus: item.status,

                });

            }

        });

    });

    return result;

}

export function updateApprovalStatus(id, type, status) {

    const records = getAttendanceRecords();

    const updated = records.map((record) =>

        record.id === id
            ? {
                ...record,
                approval: {
                    ...record.approval,
                    [type]: {
                        ...record.approval?.[type],
                        resolved: true,
                        status,
                    },
                },
            }
            : record

    );

    saveAttendanceRecords(updated);

    const history =
        JSON.parse(
            localStorage.getItem(HISTORY_KEY)
        ) || [];

    const updatedHistory = history.map((item) =>

        item.id === id

            ? updated.find((record) => record.id === id)

            : item

    );

    localStorage.setItem(

        HISTORY_KEY,

        JSON.stringify(updatedHistory)

    );

}

export function restoreApprovalStatus(id, type) {

    const records = getAttendanceRecords();

    const updated = records.map((record) =>

        record.id === id
            ? {
                ...record,
                approval: {
                    ...record.approval,
                    [type]: {
                        ...record.approval?.[type],
                        resolved: false,
                        status: null,
                    },
                },
            }
            : record

    );

    saveAttendanceRecords(updated);

    const history =
        JSON.parse(
            localStorage.getItem(HISTORY_KEY)
        ) || [];

    const updatedHistory = history.map((item) =>

        item.id === id

            ? updated.find((record) => record.id === id)

            : item

    );

    localStorage.setItem(

        HISTORY_KEY,

        JSON.stringify(updatedHistory)

    );

}

export function getResolvedApprovalList() {

    const records = getAttendanceRecords();

    const result = [];

    records.forEach((record) => {

        const approval = record.approval || {};

        Object.entries(approval).forEach(([type, item]) => {

            if (
                item.required &&
                item.resolved
            ) {

                result.push({
                    ...record,
                    approvalId: `${record.id}-${type}`,
                    recordId: record.id,
                    approvalType: type,
                    approvalStatus: item.status,
                });

            }

        });

    });

    return result;

}

export function generateAbsentApprovals() {

    clearOldPendingApprovals();

    const employees = JSON.parse(
        localStorage.getItem("employees")
    ) || [];

    const records = getAttendanceRecords();

    const today = new Date();

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

        const joinDate = employee.join
            ? new Date(`${employee.join}T00:00:00`)
            : null;

        if (!joinDate) return;

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        for (

            let current = new Date(joinDate);

            current <= today;

            current.setDate(current.getDate() + 1)

        ) {

            const dayKey =
                dayKeys[current.getDay()];

            const schedule =
                employee.weekSchedule?.[dayKey];

            if (!schedule) continue;

            const dateText =
                `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;

            // 오늘은 출근시간 +30분 이후부터만 결근 생성
            if (dateText === getTodayText()) {

                const [hour, minute] =
                    schedule.start.split(":").map(Number);

                const absentTime = new Date();

                absentTime.setHours(hour);
                absentTime.setMinutes(minute + 30);
                absentTime.setSeconds(0);
                absentTime.setMilliseconds(0);

                if (new Date() <= absentTime) {

                    continue;

                }

            }

            const exists = records.some(
                record =>
                    record.employeeNo === employee.no &&
                    record.date === dateText
            );

            if (exists) continue;

            const absentRecord = {

                id: Date.now() + Math.random(),

                employeeNo: employee.no,

                employeeName: employee.name,

                date: dateText,

                checkIn: null,

                checkOut: null,

                workMinutes: 0,

                status: "결근",

                late: false,

                earlyLeave: false,

                overtime: false,

                approval: {

                    earlyCheckIn: {
                        required: false,
                        resolved: false,
                        status: null,
                    },

                    late: {
                        required: false,
                        resolved: false,
                        status: null,
                    },

                    earlyLeave: {
                        required: false,
                        resolved: false,
                        status: null,
                    },

                    overtime: {
                        required: false,
                        resolved: false,
                        status: null,
                    },

                    night: {
                        required: false,
                        resolved: false,
                        status: null,
                    },

                    absent: {
                        required: true,
                        resolved: false,
                        status: null,
                    },

                },

            };

            records.unshift(absentRecord);

            saveAttendanceHistory(absentRecord);

        }

    });

    const before = JSON.stringify(
        getAttendanceRecords()
    );

    const after = JSON.stringify(records);

    if (before !== after) {

        saveAttendanceRecords(records);

    }

}

export function clearOldPendingApprovals() {

    const currentMonth = getTodayText().slice(0, 7);

    const savedMonth = localStorage.getItem(APPROVAL_MONTH_KEY);

    if (!savedMonth) {

        localStorage.setItem(
            APPROVAL_MONTH_KEY,
            currentMonth
        );

        return;

    }

    if (savedMonth === currentMonth) {

        return;

    }

    saveAttendanceRecords([]);

    localStorage.setItem(
        APPROVAL_MONTH_KEY,
        currentMonth
    );

}

export function getMonthlyAttendanceSummary(employeeNo) {

    const history = JSON.parse(
        localStorage.getItem(HISTORY_KEY)
    ) || [];

    const employees = JSON.parse(
        localStorage.getItem("employees")
    ) || [];

    const employee = employees.find(
        item => item.no === employeeNo
    );

    const month = new Date()
        .toISOString()
        .slice(0, 7);

    const records = history.filter(
        (record) =>
            record.employeeNo === employeeNo &&
            record.date.startsWith(month)
    );

    return {

        checkIn: records.length,

        checkOut: records.filter(
            record => record.checkOut
        ).length,

        late: records.filter(
            record => record.late
        ).length,

        earlyLeave: records.filter(
            record => record.earlyLeave
        ).length,

        absent: employee
            ? getMonthlyAbsentCount(employee, month)
            : 0,

    };

}

export function getMonthlyAbsentCount(
    employee,
    month = new Date().toISOString().slice(0, 7)
) {

    const history = JSON.parse(
        localStorage.getItem(HISTORY_KEY)
    ) || [];

    const weekSchedule = employee.weekSchedule || {};

    if (Object.keys(weekSchedule).length === 0) {
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

    const monthStart = new Date(`${month}-01T00:00:00`);

    const monthEnd = new Date(
        monthStart.getFullYear(),
        monthStart.getMonth() + 1,
        0
    );

    const today = new Date();

    const endDate =
        today.getFullYear() === monthStart.getFullYear() &&
            today.getMonth() === monthStart.getMonth()
            ? new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
            : monthEnd;

    const joinDate = employee.join
        ? new Date(`${employee.join}T00:00:00`)
        : monthStart;

    let absent = 0;

    const current = new Date(monthStart);

    while (current <= endDate) {

        if (current >= joinDate) {

            const dayKey = dayKeys[current.getDay()];

            if (weekSchedule[dayKey]) {

                const dateText =
                    `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;

                const absentRecord = history.find(
                    record =>
                        record.employeeNo === employee.no &&
                        record.date === dateText &&
                        record.status === "결근"
                );

                if (
                    absentRecord &&
                    absentRecord.approval?.absent?.status === "approved"
                ) {
                    absent++;
                }

            }

        }

        current.setDate(current.getDate() + 1);

    }

    return absent;

}

export function getEmployeeMonthlyAttendanceStatus(
    employee,
    month = null
) {

    const history =
        JSON.parse(
            localStorage.getItem(HISTORY_KEY)
        ) || [];

    const now = new Date();

    const targetMonth =
        month ||
        `${now.getFullYear()}-${String(
            now.getMonth() + 1
        ).padStart(2, "0")}`;

    const [year, monthNumber] =
        targetMonth.split("-").map(Number);

    const monthIndex =
        monthNumber - 1;

    const daysInMonth =
        new Date(
            year,
            monthNumber,
            0
        ).getDate();

    const today = new Date();

    today.setHours(0, 0, 0, 0);

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

        const items = types
            .map(
                type => approval?.[type]
            )
            .filter(Boolean);

        const waiting = items.some(
            item =>
                item.required &&
                !item.resolved
        );

        if (waiting) {

            return "waiting";

        }

        const approved = items.some(
            item =>
                item.required &&
                item.resolved &&
                item.status === "approved"
        );

        if (approved) {

            return "approved";

        }

        return null;

    };

    /*
     * 날짜 상태를 한 곳에서 생성
     *
     * 앞으로 날짜와 관련된 속성은
     * 이 함수에만 추가하면 됩니다.
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

            date: dateText,

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
            length: daysInMonth,
        },
        (_, index) => {

            const day =
                index + 1;

            const date = new Date(
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
             * 공통 날짜 정보를 자동으로 포함하는
             * 반환 함수
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
            if (date > today) {

                return createStatus(
                    null,
                    null
                );

            }

            /*
             * 휴무일
             */
            if (!isWorkDay) {

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
            if (!record) {

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
                 *
                 * 근태 기록은 처리되었지만
                 * 급여 영향은 적용하지 않음
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
                 * 결근 상태지만
                 * 승인 정보가 없는 경우
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