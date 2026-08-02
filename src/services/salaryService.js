import {
    getMonthlySalary as getMonthlySalaryCore,
    getMonthlySalaryByMonth as getMonthlySalaryByMonthCore,
    getMonthlyPayrollStatement as getMonthlyPayrollStatementCore,
    getMonthlyAbsentCount as getMonthlyAbsentCountCore,
} from "./pay/monthlyPayService";

import {
    isRetirementEligible as isRetirementEligibleCore,
    getAverageDailyWage as getAverageDailyWageCore,
    getRetirement as getRetirementCore,
} from "./pay/retirementService";

export function getMonthlySalary(employee) {

    return getMonthlySalaryCore(employee);

}

export function isRetirementEligible(employee) {

    return isRetirementEligibleCore(employee);

}

export function getAverageDailyWage(employee) {

    return getAverageDailyWageCore(employee);

}

export function getRetirement(employee) {

    return getRetirementCore(employee);

}

export function getMonthlyAbsentCount(employee, month) {

    return getMonthlyAbsentCountCore(
        employee,
        month
    );

}

export function getMonthlySalaryByMonth(employee, month) {

    return getMonthlySalaryByMonthCore(
        employee,
        month
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

    return getMonthlyPayrollStatementCore(employee);

}