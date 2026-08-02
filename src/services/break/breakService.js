export function getScheduledWorkMinutes(employee) {

    const policy = employee?.workPolicy;

    if (!policy?.startTime || !policy?.endTime) {
        return 0;
    }

    const [startHour, startMinute] =
        policy.startTime.split(":").map(Number);

    const [endHour, endMinute] =
        policy.endTime.split(":").map(Number);

    const start =
        startHour * 60 + startMinute;

    const end =
        endHour * 60 + endMinute;

    return Math.max(end - start, 0);

}

// ============================
// 휴게 횟수 계산
// ============================

export function getAllowedBreakCount(totalMinutes) {

    if (

        !Number.isFinite(totalMinutes) ||

        totalMinutes <= 0

    ) {

        return 0;

    }

    return Math.floor(totalMinutes / 240);

}

// ============================
// 휴게시간 계산
// ============================

export function getAllowedBreakMinutes(totalMinutes) {

    return getAllowedBreakCount(totalMinutes) * 30;

}

// ============================
// 실제 휴게시간 계산
// ============================

export function getActualBreakMinutes(breaks = []) {

    if (!Array.isArray(breaks) || breaks.length === 0) {

        return 0;

    }

    const totalMinutes = breaks.reduce((total, item) => {

        if (!item.start || !item.end) {

            return total;

        }

        const start = new Date(item.start);

        const end = new Date(item.end);

        if (

            Number.isNaN(start.getTime()) ||

            Number.isNaN(end.getTime()) ||

            end <= start

        ) {

            return total;

        }

        return total + ((end - start) / 60000);

    }, 0);

    return Math.floor(totalMinutes);

}

// ============================
// 초과 휴게 계산
// ============================

export function getExceededBreakMinutes(

    totalMinutes,

    breaks = []

) {

    const allowedBreakMinutes =
        getAllowedBreakMinutes(totalMinutes);

    const actualBreakMinutes =
        getActualBreakMinutes(breaks);

    return Math.max(

        actualBreakMinutes - allowedBreakMinutes,

        0

    );

}

// ============================
// 최종 계산
// ============================

export function calculateBreak(

    totalMinutes,

    breaks = []

) {

    const allowedBreakCount =
        getAllowedBreakCount(totalMinutes);

    const allowedBreakMinutes =
        getAllowedBreakMinutes(totalMinutes);

    const actualBreakMinutes =
        getActualBreakMinutes(breaks);

    const exceededBreakMinutes =
        getExceededBreakMinutes(
            totalMinutes,
            breaks
        );

    const remainingBreakMinutes = Math.max(

        allowedBreakMinutes - actualBreakMinutes,

        0

    );

    return {

        allowedBreakCount,

        allowedBreakMinutes,

        actualBreakMinutes,

        remainingBreakMinutes,

        exceededBreakMinutes,

        approvalRequired:
            exceededBreakMinutes > 0

    };

}