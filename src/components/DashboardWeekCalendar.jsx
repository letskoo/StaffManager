import "../styles/dashboard.css";

function DashboardWeekCalendar() {

    const days = [
        { label: "월", key: "mon" },
        { label: "화", key: "tue" },
        { label: "수", key: "wed" },
        { label: "목", key: "thu" },
        { label: "금", key: "fri" },
        { label: "토", key: "sat" },
        { label: "일", key: "sun" },
    ];

    const hours = [
        7, 9, 11, 13, 15, 17, 19, 21, 23, 0, 2, 4, 6,
    ];

    const employees =
        JSON.parse(localStorage.getItem("employees")) || [];

    const rowHeight = 38;

    const colors = [
        "#60a5fa",
        "#34d399",
        "#f59e0b",
        "#a78bfa",
        "#ec4899",
        "#06b6d4",
    ];

    const toHour = (time) => {

        if (!time) return 0;

        const [hour, minute = 0] =
            String(time).split(":").map(Number);

        return hour + minute / 60;

    };

    const toTimelineHour = (hour) => {
        return hour < 7 ? hour + 24 : hour;
    };

    const getEmployeeColor = (employee) => {
        const index = employees.findIndex(
            (item) => item.no === employee.no
        );

        return colors[index % colors.length];
    };

    return (

        <div className="detail-card">

            <h2>주간 근무 다이어리</h2>

            <div className="week-calendar">

                <div className="week-header">

                    <div></div>

                    {days.map((day) => (

                        <div
                            key={day.key}
                            className="week-day"
                        >
                            {day.label}
                        </div>

                    ))}

                </div>

                <div className="week-body">

                    <div
                        className="week-grid"
                        style={{
                            height: `${hours.length * rowHeight}px`,
                        }}
                    >

                        {hours.map((hour) => (

                            <div
                                key={hour}
                                className="week-row"
                            >

                                <div className="week-hour">
                                    {String(hour).padStart(2, "0")}:00
                                </div>

                                {days.map((day) => (

                                    <div
                                        key={day.key}
                                        className="week-cell"
                                    />

                                ))}

                            </div>

                        ))}

                        {employees.flatMap((employee) =>

                            days.map((day, dayIndex) => {

                                const schedule =
                                    employee.weekSchedule?.[day.key];

                                if (!schedule) return null;

                                const startHour =
                                    toTimelineHour(toHour(schedule.start));

                                let endHour =
                                    toTimelineHour(toHour(schedule.end));

                                if (endHour <= startHour) {

                                    endHour += 24;

                                }

                                const top =
                                    ((startHour - 7) / 2) * rowHeight;

                                const height =
                                    ((endHour - startHour) / 2) * rowHeight;

                                const dayWorkers = employees.filter((item) =>

                                    item.weekSchedule?.[day.key]

                                );

                                const workerIndex =
                                    dayWorkers.findIndex(
                                        item => item.no === employee.no
                                    );

                                const workerCount =
                                    dayWorkers.length;

                                return (

                                    <div

                                        key={`${employee.no}-${day.key}`}

                                        className="week-bar"

                                        style={{

                                            top,

                                            left: `calc(
        70px +
        ${dayIndex} * ((100% - 70px)/7) +
        (${workerIndex} * (((100% - 70px)/7) / ${workerCount}))
    )`,

                                            width: `calc(
        (((100% - 70px)/7) / ${workerCount})
    )`,

                                            height,

                                            background: getEmployeeColor(employee)

                                        }}

                                    >

                                        <div>

                                            {employee.name}

                                        </div>

                                    </div>

                                );

                            })

                        )}

                    </div>

                </div>

            </div>

        </div>

    );

}

export default DashboardWeekCalendar;