const STORAGE_KEY = "attendanceRecords";

function getTodayText() {

    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

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

export function getTodayAttendance(employeeNo) {

    const today = getTodayText();

    return getAttendanceRecords().find(

        (record) =>

            record.employeeNo === employeeNo &&

            record.date === today

    );

}

export function getNextAttendanceType(employeeNo) {

    const todayRecord = getTodayAttendance(employeeNo);

    if (!todayRecord) {

        return "checkin";

    }

    if (!todayRecord.checkOut) {

        return "checkout";

    }

    return "done";

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

        approved: true,

    };

    records.unshift(record);

    saveAttendanceRecords(records);

    return record;

}

export function saveCheckOut(employee) {

    const records = getAttendanceRecords();

    const todayRecord = getTodayAttendance(employee.no);

    if (!todayRecord) {

        return null;

    }

    const now = new Date();

    const checkInTime = new Date(todayRecord.checkIn);

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

        approved:

            !earlyCheckInApprovalRequired &&

            !(late && !workPolicy.allowLate) &&

            !(earlyLeave && !workPolicy.allowEarlyLeave),

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

    const breakMinutes =

        Number(workPolicy.breakMinutes || 0);

    return Math.max(

        totalMinutes - breakMinutes,

        0

    );

}

export function calculateDailyPay(record, employee) {

    const workPolicy = employee.workPolicy;

    if (!workPolicy) {

        return 0;

    }

    // 시급제

    if (workPolicy.payType === "hourly") {

        return Math.floor(

            record.workMinutes / 60 *

            workPolicy.hourlyWage

        );

    }

    // 월급제

    const hourlyPay =

        workPolicy.monthlySalary /

        209;

    return Math.floor(

        record.workMinutes / 60 *

        hourlyPay

    );

}

export function getApprovalList() {

    const records = getAttendanceRecords();

    return records.filter((record) =>

        !record.approvalResolved &&

        (

            record.earlyCheckInApprovalRequired ||

            record.late ||

            record.earlyLeave ||

            record.overtime

        )

    );

}

export function updateApprovalStatus(id, status) {

    const records = getAttendanceRecords();

    const updated = records.map((record) =>

        record.id === id
            ? {
                ...record,
                approvalStatus: status,
                approvalResolved: true,
            }
            : record

    );

    saveAttendanceRecords(updated);

}