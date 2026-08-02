import { isHoliday } from "../HolidayService";

export function isEnabled(value) {

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

export function getScheduledDateTime(record, employee) {

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

export function getOverlapMinutes(

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

 export function getNightMinutes(record) {

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

export function splitWorkMinutesByHoliday(record) {

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

export function getHourlyPay(employee) {

    const workPolicy = employee.workPolicy;

    if (!workPolicy) {

        return 0;

    }

    if (workPolicy.payType === "hourly") {

        return Number(workPolicy.hourlyWage || 0);

    }

    return Number(workPolicy.monthlySalary || 0) / 209;

}