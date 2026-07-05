const STORAGE_KEY = "attendanceRecords";

function getToday() {

    return new Date().toLocaleDateString("sv-SE");

}

export function getAttendanceRecords() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify([])

        );

        return [];

    }

    return JSON.parse(saved);

}

export function saveAttendanceRecords(records) {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(records)

    );

}

export function getTodayAttendance(employeeNo) {

    const today = getToday();

    return getAttendanceRecords().find(

        (record) =>

            record.employeeNo === employeeNo

            &&

            record.date === today

    );

}

export function saveCheckIn(employee) {

    const records = getAttendanceRecords();

    records.push({

        employeeNo: employee.no,

        employeeName: employee.name,

        date: getToday(),

        checkIn: new Date().toISOString(),

        checkOut: null,

    });

    saveAttendanceRecords(records);

}

export function saveCheckOut(employee) {

    const records = getAttendanceRecords();

    const record = records.find(

        (item) =>

            item.employeeNo === employee.no

            &&

            item.date === getToday()

            &&

            !item.checkOut

    );

    if (!record) {

        return;

    }

    record.checkOut = new Date().toISOString();

    saveAttendanceRecords(records);

}

export function getWorkedMinutes(employeeNo) {

    const record = getTodayAttendance(employeeNo);

    if (

        !record ||

        !record.checkIn ||

        !record.checkOut

    ) {

        return 0;

    }

    const start = new Date(record.checkIn);

    const end = new Date(record.checkOut);

    return Math.floor(

        (end - start) / 60000

    );

}