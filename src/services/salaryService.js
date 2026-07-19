import {
    calculateDailyPay,
    calculatePayDetail,
} from "./attendanceService";

const HISTORY_KEY = "attendanceHistory";

const BONUS_KEY = "attendanceCards";

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

function getDateText(date) {

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

}

function getWeekStart(date) {

    const result = new Date(date);

    const day = result.getDay();

    const diff = day === 0 ? -6 : 1 - day;

    result.setDate(result.getDate() + diff);

    result.setHours(0, 0, 0, 0);

    return result;

}

function getMinutesBetween(startTime, endTime) {

    const start = startTime.split(":");

    const end = endTime.split(":");

    const startMinutes =
        Number(start[0]) * 60 + Number(start[1]);

    let endMinutes =
        Number(end[0]) * 60 + Number(end[1]);

    if (endMinutes <= startMinutes) {

        endMinutes += 24 * 60;

    }

    return endMinutes - startMinutes;

}

function getBreakMinutes(totalMinutes, employee) {

    if (!employee.workPolicy?.breakEnabled) {
        return 0;
    }

    if (totalMinutes >= 960) {

        return 120;

    }

    if (totalMinutes >= 720) {

        return 90;

    }

    if (totalMinutes >= 480) {

        return 60;

    }

    if (totalMinutes >= 240) {

        return 30;

    }

    return 0;

}

function getScheduledMinutesForDay(employee, dayKey) {

    const schedule = employee.weekSchedule?.[dayKey];

    if (!schedule) {

        return 0;

    }

    const startTime = schedule.start;

    const endTime = schedule.end;

    const totalMinutes =
        getMinutesBetween(startTime, endTime);

    const breakMinutes =
        getBreakMinutes(totalMinutes, employee);

    return Math.max(

        totalMinutes - breakMinutes,

        0

    );

}

function getWeeklyScheduledMinutes(employee) {

    const dayKeys = [
        "mon",
        "tue",
        "wed",
        "thu",
        "fri",
        "sat",
        "sun",
    ];

    return dayKeys.reduce(

        (total, dayKey) =>

            total +

            getScheduledMinutesForDay(

                employee,

                dayKey

            ),

        0

    );

}

function hasWorkedAllScheduledDays(

    employee,

    records,

    weekStart

) {

    const dayKeys = [
        "mon",
        "tue",
        "wed",
        "thu",
        "fri",
        "sat",
        "sun",
    ];

    return dayKeys.every((dayKey, index) => {

        if (!employee.weekSchedule?.[dayKey]) {

            return true;

        }

        const date = new Date(weekStart);

        date.setDate(

            weekStart.getDate() + index

        );

        const dateText = getDateText(date);

        return records.some(

            (record) =>

                record.employeeNo === employee.no &&

                record.date === dateText &&

                record.checkOut

        );

    });

}

function getWeeklyHolidayPayForWeek(

    employee,

    records,

    weekStart

) {

    const allowWeeklyHoliday =

        employee.workPolicy?.allowWeeklyHoliday ??

        employee.allowWeeklyHoliday;

    if (!allowWeeklyHoliday) {

        return 0;

    }

    const workPolicy = employee.workPolicy;

    if (!workPolicy) {

        return 0;

    }

    // 월급제는 209시간 기준에 주휴가 포함된 것으로 보고,
    // 별도 주휴수당을 더하지 않는다.

    if (workPolicy.payType !== "hourly") {

        return 0;

    }

    const weeklyScheduledMinutes =
        getWeeklyScheduledMinutes(employee);

    if (weeklyScheduledMinutes < 15 * 60) {

        return 0;

    }

    if (
        !hasWorkedAllScheduledDays(
            employee,
            records,
            weekStart
        )
    ) {

        return 0;

    }

    const weeklyScheduledHours =
        weeklyScheduledMinutes / 60;

    const holidayHours = Math.min(

        (weeklyScheduledHours / 40) * 8,

        8

    );

    return Math.floor(

        holidayHours *

        getHourlyPay(employee)

    );

}

function getMonthlyWeeklyHolidayPay(

    employee,

    month

) {

    const history = JSON.parse(

        localStorage.getItem(HISTORY_KEY)

    ) || [];

    const monthStart = new Date(`${month}-01T00:00:00`);

    const monthEnd = new Date(

        monthStart.getFullYear(),

        monthStart.getMonth() + 1,

        0

    );

    let currentWeek = getWeekStart(monthStart);

    let total = 0;

    while (currentWeek <= monthEnd) {

        const weekMonth =
            getDateText(currentWeek).slice(0, 7);

        if (weekMonth === month) {

            total += getWeeklyHolidayPayForWeek(

                employee,

                history,

                currentWeek

            );

        }

        currentWeek.setDate(

            currentWeek.getDate() + 7

        );

    }

    return total;

}

function getMonthlyBonus(employee, month) {

    const cards = JSON.parse(

        localStorage.getItem(BONUS_KEY)

    ) || [];

    return cards

        .filter((card) =>

            card.enabled &&

            card.category === "bonus" &&

            card.employeeNo === employee.no &&

            card.createdAt?.startsWith(month)

        )

        .reduce(

            (total, card) =>

                total + Number(card.amount || 0),

            0

        );

}

export function getMonthlySalary(employee) {

    const history = JSON.parse(

        localStorage.getItem(HISTORY_KEY)

    ) || [];

    const currentMonth = new Date()

        .toISOString()

        .slice(0, 7);

    let basePay = 0;

    if (employee.workPolicy?.payType === "monthly") {

        basePay = Number(
            employee.workPolicy.monthlySalary || 0
        );

    } else {

        basePay = history

            .filter(
                (record) =>
                    record.employeeNo === employee.no &&
                    record.date.startsWith(currentMonth) &&
                    record.checkOut
            )

            .reduce(
                (total, record) =>
                    total +
                    calculateDailyPay(
                        record,
                        employee
                    ),
                0
            );

    }

    const weeklyHolidayPay =
        getMonthlyWeeklyHolidayPay(
            employee,
            currentMonth
        );

    const bonus =
        getMonthlyBonus(
            employee,
            currentMonth
        );

    const detail = history
        .filter(
            record =>
                record.employeeNo === employee.no &&
                record.date.startsWith(currentMonth) &&
                record.checkOut
        )
        .reduce(
            (sum, record) => {

                const pay =
                    calculatePayDetail(
                        record,
                        employee
                    );

                sum.overtime += pay.overtimePay;
                sum.night += pay.nightPay;
                sum.holiday += pay.holidayPay;
                sum.late += pay.lateDeduction;
                sum.early += pay.earlyLeaveDeduction;

                return sum;

            },
            {
                overtime: 0,
                night: 0,
                holiday: 0,
                late: 0,
                early: 0,
            }
        );

    const absentCount =
        getMonthlyAbsentCount(
            employee,
            currentMonth
        );

    const absentDeduction =
        employee.workPolicy?.payType === "monthly"
            ? Math.floor(
                Number(employee.workPolicy.monthlySalary || 0) /
                30 *
                absentCount
            )
            : 0;

    const joinMonth = employee.join?.slice(0, 7);

    if (joinMonth && currentMonth < joinMonth) {

        return 0;

    }

    return Math.max(

        basePay +

        weeklyHolidayPay +

        bonus -

        detail.late -

        detail.early -

        absentDeduction,

        0

    );

}

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

export function getMonthlyAbsentCount(employee, month = new Date().toISOString().slice(0, 7)) {

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

    const today = new Date();

    const monthStart = new Date(`${month}-01T00:00:00`);

    const monthEnd = new Date(
        monthStart.getFullYear(),
        monthStart.getMonth() + 1,
        0
    );

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

            const dateText = getDateText(current);

            const isWorkDay = !!weekSchedule[dayKey];

            const absentRecord = history.find(
                (record) =>
                    record.employeeNo === employee.no &&
                    record.date === dateText &&
                    record.status === "결근"
            );

            if (
                isWorkDay &&
                absentRecord?.approval?.absent?.required &&
                absentRecord?.approval?.absent?.status === "approved"
            ) {

                absent++;

            }

        }

        current.setDate(current.getDate() + 1);

    }

    return absent;

}

export function getMonthlySalaryByMonth(employee, month) {

    const history = JSON.parse(
        localStorage.getItem(HISTORY_KEY)
    ) || [];

    let basePay = 0;

    if (employee.workPolicy?.payType === "monthly") {

        basePay = Number(
            employee.workPolicy.monthlySalary || 0
        );

    } else {

        basePay = history

            .filter(
                (record) =>
                    record.employeeNo === employee.no &&
                    record.date.startsWith(month) &&
                    record.checkOut
            )

            .reduce(
                (total, record) =>
                    total +
                    calculateDailyPay(
                        record,
                        employee
                    ),
                0
            );

    }

    const weeklyHolidayPay =
        getMonthlyWeeklyHolidayPay(
            employee,
            month
        );

    const bonus =
        getMonthlyBonus(
            employee,
            month
        );

    const detail = history
        .filter(
            (record) =>
                record.employeeNo === employee.no &&
                record.date.startsWith(month) &&
                record.checkOut
        )
        .reduce(
            (sum, record) => {

                const pay =
                    calculatePayDetail(
                        record,
                        employee
                    );

                sum.overtime +=
                    pay.overtimePay;

                sum.night +=
                    pay.nightPay;

                sum.holiday +=
                    pay.holidayPay;

                sum.late +=
                    pay.lateDeduction;

                sum.early +=
                    pay.earlyLeaveDeduction;

                return sum;

            },
            {
                overtime: 0,
                night: 0,
                holiday: 0,
                late: 0,
                early: 0,
            }
        );

    const absentCount =
        getMonthlyAbsentCount(
            employee,
            month
        );

    const absentDeduction =
        employee.workPolicy?.payType === "monthly"
            ? Math.floor(
                Number(
                    employee.workPolicy.monthlySalary || 0
                ) /
                30 *
                absentCount
            )
            : 0;

    const joinMonth =
        employee.join?.slice(0, 7);

    if (
        joinMonth &&
        month < joinMonth
    ) {

        return 0;

    }

    const currentMonth = new Date()
        .toISOString()
        .slice(0, 7);

    if (month > currentMonth) {
        return 0;
    }

    return Math.max(

        basePay +

        weeklyHolidayPay +

        bonus -

        detail.late -

        detail.early -

        absentDeduction,

        0

    );

}

export function getYearlySalaryChartData(employee) {

    const year = new Date().getFullYear();

    return Array.from({ length: 12 }, (_, index) => {

        const monthNumber = index + 1;

        const month = `${year}-${String(monthNumber).padStart(2, "0")}`;

        return {
            month: `${monthNumber}월`,
            salary: getMonthlySalaryByMonth(employee, month),
        };

    });

}

export function getMonthlyPayrollStatement(employee) {

    const history = JSON.parse(
        localStorage.getItem(HISTORY_KEY)
    ) || [];

    const month = new Date()
        .toISOString()
        .slice(0, 7);

    const records = history.filter(
        record =>
            record.employeeNo === employee.no &&
            record.date.startsWith(month) &&
            record.checkOut
    );

    let basePay = 0;
    let overtimePay = 0;
    let nightPay = 0;
    let holidayPay = 0;
    let lateDeduction = 0;
    let earlyLeaveDeduction = 0;

    if (employee.workPolicy?.payType === "monthly") {

        basePay = Number(
            employee.workPolicy.monthlySalary || 0
        );

    }

    records.forEach((record) => {

        const detail =
            calculatePayDetail(
                record,
                employee
            );

        if (
            employee.workPolicy?.payType === "hourly"
        ) {

            basePay +=
                detail.basePay;

        }

        overtimePay +=
            detail.overtimePay;

        nightPay +=
            detail.nightPay;

        holidayPay +=
            detail.holidayPay;

        lateDeduction +=
            detail.lateDeduction;

        earlyLeaveDeduction +=
            detail.earlyLeaveDeduction;

    });

    const weeklyHolidayPay =
        getMonthlyWeeklyHolidayPay(
            employee,
            month
        );

    const bonus =
        getMonthlyBonus(
            employee,
            month
        );

    const absentCount =
        getMonthlyAbsentCount(
            employee,
            month
        );

    const absentDeduction =
        employee.workPolicy?.payType === "monthly"
            ? Math.floor(
                Number(
                    employee.workPolicy.monthlySalary || 0
                ) /
                30 *
                absentCount
            )
            : 0;

    const joinMonth = employee.join?.slice(0, 7);

    if (joinMonth && month < joinMonth) {

        basePay = 0;

        overtimePay = 0;

        nightPay = 0;

        holidayPay = 0;

    }

    return {

        employeeName: employee.name,

        employeeNo: employee.no,

        position: employee.position,

        payType:
            employee.workPolicy?.payType === "hourly"
                ? "시급"
                : "월급",

        basePay: Math.floor(basePay),

        overtimePay: Math.floor(overtimePay),

        nightPay: Math.floor(nightPay),

        holidayPay: Math.floor(holidayPay),

        weeklyHolidayPay,

        bonus,

        lateDeduction:
            Math.floor(lateDeduction),

        earlyLeaveDeduction:
            Math.floor(earlyLeaveDeduction),

        absentDeduction,

        totalPay:

            basePay +

            overtimePay +

            nightPay +

            holidayPay +

            weeklyHolidayPay +

            bonus -

            lateDeduction -

            earlyLeaveDeduction -

            absentDeduction,

    };

}