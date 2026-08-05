import {
    isEnabled,
    getScheduledDateTime,
    getNightMinutes,
    splitWorkMinutesByHoliday,
    getHourlyPay,
} from "./payCommon";

import {
    calculateBreak,
} from "../break/breakService";

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

    if (!record) {

        return emptyPayDetail;

    }

    const isRejectedAbsent =

        record.status === "결근" &&

        record.approval?.absent?.status === "rejected";

    const checkInText =

        isRejectedAbsent

            ? record.scheduledCheckIn

            : record.checkIn;

    const checkOutText =

        isRejectedAbsent

            ? record.scheduledCheckOut

            : record.checkOut;

    if (
        !checkInText ||
        !checkOutText
    ) {

        return emptyPayDetail;

    }

    const checkInDate =
        new Date(checkInText);

    const checkOutDate =
        new Date(checkOutText);

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

        !approval.night?.required ||

        approval.night?.status === "approved";

    const holidayInfo =
        splitWorkMinutesByHoliday({

            ...record,

            checkIn: checkInText,

            checkOut: checkOutText,

        });

    const {

        startTime,

        endTime,

    } = getScheduledDateTime(

        record,

        employee

    );

    const checkIn =
        new Date(checkInText);

    const checkOut =
        new Date(checkOutText);

    let payStart = startTime;

    /*
     * 조기출근
     *
     * 승인 → 실제 출근시간부터 인정
     * 거절 → 원래 출근시간부터 인정
     */
    if (checkIn < startTime) {

        payStart =
            earlyCheckInApproved
                ? checkIn
                : startTime;

    }

    /*
     * 지각
     *
     * 승인 → 원래 출근시간 인정
     * 거절 → 원래 출근시간 인정
     *
     * (급여 차감은 lateDeduction에서 처리)
     */
    else if (record.late === true) {

        payStart = startTime;

    }

    let payEnd = endTime;

    /*
     * 연장근무
     *
     * 승인 → 실제 퇴근시간 인정
     * 거절 → 원래 퇴근시간
     */
    if (checkOut > endTime) {

        payEnd =
            overtimeApproved
                ? checkOut
                : endTime;

    }

    /*
     * 조기퇴근
     *
     * 승인 → 원래 퇴근시간 인정
     * 거절 → 원래 퇴근시간 인정
     *
     * (급여 차감은 earlyLeaveDeduction에서 처리)
     */
    else if (record.earlyLeave === true) {

        payEnd = endTime;

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

    let breakMinutes = 0;

    let exceededBreakMinutes = 0;

    let breakApprovalRequired = false;

    if (workPolicy.breakEnabled) {

        const breakResult = calculateBreak(

            approvedMinutes,

            record.breaks ?? []

        );

        const breakApproved =

            approval.break?.status === "approved";

        breakMinutes =

            breakResult.allowedBreakMinutes +

            (

                breakApproved

                    ? breakResult.exceededBreakMinutes

                    : 0

            );

        exceededBreakMinutes =
            breakResult.exceededBreakMinutes;

        breakApprovalRequired =
            breakResult.approvalRequired;

    }

    /*
     * 실제 연장근무 시간
     *
     * 예정 퇴근시간 이후부터만 연장근무
     */
    const actualOvertimeMinutes =
        Math.max(
            Math.floor(
                (payEnd - endTime) / 60000
            ),
            0
        );

    /*
     * 기본급 계산
     *
     * 인정 근무시간
     * - 휴게시간
     * - 연장근무
     */
    const baseMinutes =
        Math.max(
            approvedMinutes -
            breakMinutes -
            actualOvertimeMinutes,
            0
        );

    const overtimeMinutes =
        isEnabled(workPolicy.allowOvertime)
            ? actualOvertimeMinutes
            : 0;

    const nightMinutes =
        getNightMinutes({

            ...record,

            checkIn:
                payStart.toISOString(),

            checkOut:
                payEnd.toISOString(),

        });

    const isHolidayWork =

        record.isHoliday === true ||

        record.holidayWork === true;

    const holidayApproved =

        !approval.holiday?.required ||

        approval.holiday?.status === "approved";

    const allowHoliday =
        isEnabled(

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

        /*
         * 연장근무
         *
         * 기본급은 이미 baseMinutes에 포함되지 않는다.
         * 따라서 연장근무 기본급을 먼저 지급하고,
         * 추가 50%만 가산한다.
         */

        basePay +=
            overtimeMinutes / 60 *
            hourlyPay;

        overtimePay =
            overtimeMinutes / 60 *
            hourlyPay *
            0.5;

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

        holidayApproved &&

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