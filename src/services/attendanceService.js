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

export function getAttendanceRecords() {

    clearOldPendingApprovals();

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

    return getAttendanceRecords().find(

        (record) =>

            record.employeeNo === employeeNo &&

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

            record.checkOut

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

    const records = getAttendanceRecords();

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

    const workDate = record.date;

    const startTime = new Date(
        `${workDate}T${workPolicy.startTime}:00`
    );

    const endTime = new Date(
        `${workDate}T${workPolicy.endTime}:00`
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

    const workPolicy = employee.workPolicy;

    if (!workPolicy) {

        return {
            baseMinutes: 0,
            overtimeMinutes: 0,
            nightMinutes: 0,
            holidayMinutes: 0,
            basePay: 0,
            overtimePay: 0,
            nightPay: 0,
            holidayPay: 0,
            totalPay: 0,
        };

    }

    const hourlyPay = getHourlyPay(employee);

    const approval = record.approval || {};

    const lateApproved =
        approval.late?.status === "approved";

    const earlyLeaveApproved =
        approval.earlyLeave?.status === "approved";

    const earlyCheckInApproved =
        approval.earlyCheckIn?.status === "approved";

    const overtimeApproved =
        approval.overtime?.status === "approved";

    const holidayInfo =
        splitWorkMinutesByHoliday(record);

    const startTime = new Date(
        `${record.date}T${workPolicy.startTime}:00`
    );

    const endTime = new Date(
        `${record.date}T${workPolicy.endTime}:00`
    );

    const checkIn = new Date(record.checkIn);

    const checkOut = new Date(record.checkOut);

    let payStart =
        earlyCheckInApproved
            ? checkIn
            : new Date(
                Math.max(
                    checkIn.getTime(),
                    startTime.getTime()
                )
            );

    let payEnd =
        earlyLeaveApproved
            ? endTime
            : checkOut;

    if (lateApproved) {

        payStart = startTime;

    }

    if (!overtimeApproved && payEnd > endTime) {

        payEnd = endTime;

    }

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
            480
        );

    const overtimeMinutes =
        Math.max(
            approvedMinutes - 480,
            0
        );

    const nightMinutes = getNightMinutes(record);

    const isHolidayWork =

        record.isHoliday === true ||

        record.holidayWork === true;

    const allowHoliday = isEnabled(

        workPolicy.allowHoliday ??

        employee.allowHoliday

    );

    let basePay =

        baseMinutes / 60 *

        hourlyPay;

    let overtimePay = 0;

    if (

        overtimeMinutes > 0 &&

        isEnabled(workPolicy.allowOvertime)

    ) {

        overtimePay =

            overtimeMinutes / 60 *

            hourlyPay *

            1.5;

    } else {

        basePay +=

            overtimeMinutes / 60 *

            hourlyPay;

    }

    let nightPay = 0;

    if (

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

        basePay: Math.floor(basePay),

        overtimePay: Math.floor(overtimePay),

        nightPay: Math.floor(nightPay),

        holidayPay: Math.floor(holidayPay),

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

    const result = [];

    records.forEach((record) => {

        const approval = record.approval || {};

        Object.entries(approval).forEach(([type, item]) => {

            if (
                item.required &&
                !item.resolved
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

                const worked = history.some(
                    record =>
                        record.employeeNo === employee.no &&
                        record.date === dateText
                );

                if (!worked) {
                    absent++;
                }

            }

        }

        current.setDate(current.getDate() + 1);

    }

    return absent;

}