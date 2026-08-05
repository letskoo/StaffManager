import {
    isEnabled,
    getScheduledDateTime,
    getNightMinutes,
    splitWorkMinutesByHoliday,
} from "../pay/payCommon";

import {
    calculateBreak,
    getScheduledWorkMinutes,
} from "../break/breakService";

/*
 * 승인 항목 공통 생성
 */
export function createApprovalItem(

    required = false,

    previousItem = null

) {

    return {

        required,

        resolved:
            previousItem?.resolved || false,

        status:
            previousItem?.status || null,

    };

}

/*
 * 근태 승인대기 공통 생성
 *
 * 일반 출퇴근과 결근 가상근무가
 * 같은 승인 생성 로직을 사용한다.
 */
export function createAttendanceApproval({

    record,

    employee,

    absent = false,

}) {

    if (!record) {

        throw new Error(
            "승인대기 생성에 근태 기록이 필요합니다."
        );

    }

    if (!employee) {

        throw new Error(
            "승인대기 생성에 직원 정보가 필요합니다."
        );

    }

    const workPolicy =
        employee.workPolicy || {};

    const previousApproval =
        record.approval || {};

    const systemPolicy = JSON.parse(

        localStorage.getItem("policy")

    ) || {};

    const {

        startTime,

        endTime,

    } = getScheduledDateTime(

        record,

        employee

    );

    const checkIn =
        new Date(record.checkIn);

    const checkOut =
        new Date(record.checkOut);

    if (
        Number.isNaN(checkIn.getTime()) ||
        Number.isNaN(checkOut.getTime()) ||
        checkOut <= checkIn
    ) {

        throw new Error(
            "승인대기 생성에 올바른 출퇴근 시간이 필요합니다."
        );

    }

    const lateLimit =
        systemPolicy.lateLimit ?? 5;

    const earlyLeaveLimit =
        systemPolicy.earlyLeaveLimit ?? 10;

    const overtimeLimit =
        systemPolicy.overtimeLimit ?? 15;

    const earlyPayExcludeMinutes =
        systemPolicy.earlyPayExcludeMinutes ?? 30;

    /*
     * 결근 거절 시에는 계약시간 그대로
     * 근무했다고 판단한다.
     *
     * 따라서 지각·조기퇴근·조기출근·연장은 없다.
     */
    const earlyCheckInRequired = absent

        ? false

        : checkIn <
        new Date(

            startTime.getTime() -

            earlyPayExcludeMinutes * 60000

        );

    const lateRequired = absent

        ? false

        : checkIn >
        new Date(

            startTime.getTime() +

            lateLimit * 60000

        );

    const earlyLeaveRequired = absent

        ? false

        : checkOut <
        new Date(

            endTime.getTime() -

            earlyLeaveLimit * 60000

        );

    const overtimeRequired = absent

        ? false

        : checkOut >
        new Date(

            endTime.getTime() +

            overtimeLimit * 60000

        );

    /*
     * 야간근무 검사
     *
     * 22:00~06:00 사이에 근무시간이 있으면
     * 야간근무 승인대기를 생성한다.
     */
    const nightMinutes =
        getNightMinutes(record);

    const nightRequired =

        isEnabled(

            workPolicy.allowNight ??

            employee.allowNight

        ) &&

        nightMinutes > 0;

    /*
     * 휴일근무 검사
     *
     * 현재 휴일 기준
     * - 일요일
     * - 국가공휴일
     * - 회사 지정 휴일
     */
    const holidayInfo =
        splitWorkMinutesByHoliday(record);

    const holidayRequired =

        isEnabled(

            workPolicy.allowHoliday ??

            employee.allowHoliday

        ) &&

        holidayInfo.holidayMinutes > 0;

    /*
     * 휴게 초과 검사
     *
     * 결근 가상근무에는 실제 휴게기록이 없으므로
     * 휴게 초과 승인대기를 생성하지 않는다.
     */
    let breakRequired = false;

    if (
        !absent &&
        workPolicy.breakEnabled
    ) {

        const totalMinutes =
            getScheduledWorkMinutes(
                employee
            );

        const breakInfo =
            calculateBreak(

                totalMinutes,

                record.breaks || []

            );

        breakRequired =
            breakInfo.approvalRequired;

    }

    return {

        earlyCheckIn:
            createApprovalItem(

                earlyCheckInRequired,

                previousApproval.earlyCheckIn

            ),

        late:
            createApprovalItem(

                lateRequired,

                previousApproval.late

            ),

        earlyLeave:
            createApprovalItem(

                earlyLeaveRequired,

                previousApproval.earlyLeave

            ),

        overtime:
            createApprovalItem(

                overtimeRequired,

                previousApproval.overtime

            ),

        night:
            createApprovalItem(

                nightRequired,

                previousApproval.night

            ),

        holiday:
            createApprovalItem(

                holidayRequired,

                previousApproval.holiday

            ),

        break:
            createApprovalItem(

                breakRequired,

                previousApproval.break

            ),

        absent:
            createApprovalItem(

                absent,

                previousApproval.absent

            ),

    };

}