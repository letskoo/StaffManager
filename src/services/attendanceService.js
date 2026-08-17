import {
    calculateBreak,
    getScheduledWorkMinutes,
} from "./break/breakService";

import {
    saveCheckIn,
    saveCheckOut,
    saveBreakStart,
    saveBreakEnd,
    processAttendance,
} from "./attendance/attendanceActionService";

import {
    getApprovalList,
    updateApprovalStatus,
    restoreApprovalStatus,
    getResolvedApprovalList,
    generateAbsentApprovals,
    clearOldPendingApprovals,
} from "./approval/approvalActionService";

import {

    getAttendanceHistory,

    saveAttendanceHistory,

    replaceAttendanceHistory,

    updateAttendanceHistory,

    removeAttendanceHistory,

    getAttendanceByPeriod,

} from "./history/historyService";

import {

    getAttendanceRecords,

    saveAttendanceRecords,

    getOpenAttendance,

    getNextAttendanceType,

    getAttendanceType,

} from "./attendance/attendanceRecordService";

import {
    getMonthlyAttendanceSummary,
    getMonthlyAbsentCount,
    getEmployeeMonthlyAttendanceStatus,
} from "./attendance/attendanceSummaryService";

export {
    calculateBreak,
    getScheduledWorkMinutes,

    getAttendanceRecords,
    saveAttendanceRecords,
    getOpenAttendance,
    getNextAttendanceType,
    getAttendanceType,

    getAttendanceHistory,
    saveAttendanceHistory,
    replaceAttendanceHistory,
    updateAttendanceHistory,
    removeAttendanceHistory,
    getAttendanceByPeriod,

    saveCheckIn,
    saveCheckOut,
    saveBreakStart,
    saveBreakEnd,
    processAttendance,

    getApprovalList,
    updateApprovalStatus,
    restoreApprovalStatus,
    getResolvedApprovalList,
    generateAbsentApprovals,
    clearOldPendingApprovals,

    getMonthlyAttendanceSummary,
    getMonthlyAbsentCount,
    getEmployeeMonthlyAttendanceStatus,
};