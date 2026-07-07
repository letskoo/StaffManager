import * as XLSX from "xlsx";

const HISTORY_KEY = "attendanceHistory";

export function getHistoryMonths() {

    const history = JSON.parse(

        localStorage.getItem(HISTORY_KEY)

    ) || [];

    const months = [

        ...new Set(

            history.map(item =>

                item.date.slice(0, 7)

            )

        )

    ];

    return months.sort().reverse();

}

export function exportHistory(month = null) {

    const history = JSON.parse(

        localStorage.getItem(HISTORY_KEY)

    ) || [];

    const list = month

        ? history.filter(item =>

            item.date.startsWith(month)

        )

        : history;

    const rows = list.map(item => ({

        날짜: item.date,

        직원명: item.employeeName,

        출근시간: item.checkIn

            ? new Date(item.checkIn)

                .toLocaleTimeString("ko-KR", {

                    hour: "2-digit",

                    minute: "2-digit",

                    hour12: false,

                })

            : "",

        퇴근시간: item.checkOut

            ? new Date(item.checkOut)

                .toLocaleTimeString("ko-KR", {

                    hour: "2-digit",

                    minute: "2-digit",

                    hour12: false,

                })

            : "",

        근무시간: item.workMinutes,

        지각: item.late ? "O" : "",

        조기출근: item.earlyCheckInApprovalRequired ? "O" : "",

        조기퇴근: item.earlyLeave ? "O" : "",

        연장근무: item.overtime ? "O" : "",

        승인상태:

            item.approvalStatus === "approved"

                ? "승인"

                : item.approvalStatus === "rejected"

                ? "거절"

                : "",

    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "History"

    );

    XLSX.writeFile(

        workbook,

        month

            ? `attendance-${month}.xlsx`

            : "attendance-history.xlsx"

    );

}