import {
    getScheduledDateTime,
} from "../pay/payCommon";

import {
    createAttendanceApproval,
} from "./approvalService";

/*
 * 결근 승인대기 레코드 생성
 *
 * 직원이 패드를 입력하지 않아 결근이 생성될 때
 * 해당 날짜의 계약 근무시간을 가상 출퇴근 시간으로 사용한다.
 *
 * 검사 항목
 * - 지각
 * - 조기퇴근
 * - 연장근무
 * - 야간근무
 * - 휴일근무
 *
 * 결근은 계약시간을 그대로 가정하므로
 * 지각·조기퇴근·연장근무는 발생하지 않는다.
 */
export function createAbsentApproval(

    employee,

    dateText

) {

    if (!employee) {

        throw new Error(
            "결근 승인대기 생성에 직원 정보가 필요합니다."
        );

    }

    if (!dateText) {

        throw new Error(
            "결근 승인대기 생성에 근무 날짜가 필요합니다."
        );

    }

    const baseRecord = {

        date: dateText,

    };

    /*
     * 해당 요일의 계약 근무시간 생성
     *
     * 예:
     * 18:00 ~ 00:00
     * →
     * 당일 18:00 ~ 다음 날 00:00
     */
    const {

        startTime,

        endTime,

    } = getScheduledDateTime(

        baseRecord,

        employee

    );

    const virtualRecord = {

        date: dateText,

        checkIn:
            startTime.toISOString(),

        checkOut:
            endTime.toISOString(),

    };

    /*
     * 가상 근무시간 검사
     *
     * 결근 거절 시 계약시간대로 근무한 것으로
     * 인정하기 때문에 지각·조기퇴근·연장은 없다.
     */

    const approval =
        createAttendanceApproval({

            record: virtualRecord,

            employee,

            absent: true,

        });

    /*
     * 실제 저장되는 결근 레코드
     *
     * 실제 패드 출퇴근 기록은 없으므로
     * checkIn/checkOut은 null로 저장한다.
     *
     * scheduledCheckIn/scheduledCheckOut은
     * 승인관리 화면과 이후 계산에서 사용할 수 있도록
     * 별도로 보관한다.
     */
    return {

        id:
            Date.now() + Math.random(),

        employeeNo:
            employee.no,

        employeeName:
            employee.name,

        date:
            dateText,

        checkIn: null,

        checkOut: null,

        scheduledCheckIn:
            virtualRecord.checkIn,

        scheduledCheckOut:
            virtualRecord.checkOut,

        breaks: [],

        workMinutes: 0,

        status: "결근",

        late: false,

        earlyLeave: false,

        overtime: false,

        scheduledMinutes:
            Math.floor(
                (endTime - startTime) / 60000
            ),

        approval,

    };

}