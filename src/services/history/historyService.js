const HISTORY_KEY = "attendanceHistory";

export function getAttendanceHistory() {

    return JSON.parse(

        localStorage.getItem(HISTORY_KEY)

    ) || [];

}

export function replaceAttendanceHistory(history) {

    localStorage.setItem(

        HISTORY_KEY,

        JSON.stringify(history)

    );

}

export function saveAttendanceHistory(record) {

    const history =
        getAttendanceHistory();

    const index =
        history.findIndex(

            item =>

                item.employeeNo === record.employeeNo &&

                item.date === record.date

        );

    if (index >= 0) {

        history[index] = record;

    }

    else {

        history.unshift(record);

    }

    replaceAttendanceHistory(history);

}

export function updateAttendanceHistory(

    employeeNo,

    date,

    updater

) {

    const history =
        getAttendanceHistory();

    const index =
        history.findIndex(

            item =>

                item.employeeNo === employeeNo &&

                item.date === date

        );

    if (index < 0) {

        return;

    }

    history[index] =
        updater(history[index]);

    replaceAttendanceHistory(history);

}

export function removeAttendanceHistory(

    employeeNo,

    date

) {

    const history =
        getAttendanceHistory()

            .filter(

                item =>

                    !(

                        item.employeeNo === employeeNo &&

                        item.date === date

                    )

            );

    replaceAttendanceHistory(history);

}

export function getAttendanceByPeriod(

    employeeNo,

    startDate,

    endDate

) {

    return getAttendanceHistory()

        .filter(

            item =>

                item.employeeNo === employeeNo &&

                item.date >= startDate &&

                item.date <= endDate

        )

        .sort(

            (a, b) =>

                a.date.localeCompare(b.date)

        );

}