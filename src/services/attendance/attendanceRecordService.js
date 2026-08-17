const STORAGE_KEY = "attendanceRecords";

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

export function getOpenAttendance(employeeNo) {

    return getAttendanceRecords().find(

        (record) =>

            record.employeeNo === employeeNo &&

            Boolean(record.checkIn) &&

            !record.checkOut

    );

}

export function getNextAttendanceType(employeeNo) {

    const openRecord =
        getOpenAttendance(employeeNo);

    if (openRecord) {

        return "checkout";

    }

    return "checkin";

}

export function getAttendanceType(employeeNo) {

    return getNextAttendanceType(employeeNo);

}

export function processAttendance(employee) {

    const nextType =
        getNextAttendanceType(employee.no);

    return nextType;

}

export function createCheckInRecord(employee) {

}