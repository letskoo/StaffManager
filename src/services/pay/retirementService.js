import {
    calculateDailyPay,
} from "./hourlyPayService";

const HISTORY_KEY = "attendanceHistory";

export function isRetirementEligible(employee) {

    if (!employee.join) {

        return false;

    }

    const joinDate = new Date(employee.join);

    const today = new Date();

    const workDays =

        (today - joinDate) /

        (1000 * 60 * 60 * 24);

    if (workDays < 365) {

        return false;

    }

    const workPolicy = employee.workPolicy;

    if (!workPolicy) {

        return false;

    }

    const weeklyMinutes =

        getWeeklyScheduledMinutes(employee);

    return weeklyMinutes >= 15 * 60;

}

export function getAverageDailyWage(employee) {

    const history = JSON.parse(

        localStorage.getItem(HISTORY_KEY)

    ) || [];

    const today = new Date();

    const threeMonthsAgo = new Date();

    threeMonthsAgo.setMonth(

        today.getMonth() - 3

    );

    const records = history.filter(

        (record) =>

            record.employeeNo === employee.no &&

            record.checkOut &&

            new Date(record.date) >= threeMonthsAgo

    );

    if (records.length === 0) {

        return 0;

    }

    const totalPay = records.reduce(

        (sum, record) =>

            sum +

            calculateDailyPay(record, employee),

        0

    );

    return totalPay / records.length;

}

export function getRetirement(employee) {

    if (!isRetirementEligible(employee)) {

        return null;

    }

    const joinDate = new Date(employee.join);

    const today = new Date();

    const totalDays =

        (today - joinDate) /

        (1000 * 60 * 60 * 24);

    const averageDailyWage =

        getAverageDailyWage(employee);

    return Math.floor(

        averageDailyWage *

        30 *

        (totalDays / 365)

    );

}