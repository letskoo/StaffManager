import {
    calculateBreak,
} from "../break/breakService";

function getTodayText() {

    const now = new Date();

    return `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}-${String(
        now.getDate()
    ).padStart(2, "0")}`;

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

        record.approval?.earlyCheckIn?.status !== "approved"

    ) {

        payStartTime = startTime;

    }

    const totalMinutes = Math.floor(

        (checkOut - payStartTime) / 1000 / 60

    );

    let breakMinutes = 0;

    if (workPolicy.breakEnabled) {

        const breakInfo = calculateBreak(

            totalMinutes,

            record.breaks || []

        );

        breakMinutes =
            breakInfo.allowedBreakMinutes;

        if (

            record.approval?.break?.status === "approved"

        ) {

            breakMinutes +=
                breakInfo.exceededBreakMinutes;

        }

    }

    return Math.max(

        totalMinutes - breakMinutes,

        0

    );

}