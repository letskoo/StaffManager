import "../styles/dashboard.css";

function DashboardWeekCalendar() {

    const days = [
        "월",
        "화",
        "수",
        "목",
        "금",
        "토",
        "일",
    ];

    const hours = [
        7, 9, 11, 13, 15, 17, 19, 21, 23, 0, 2, 4, 6,
    ];

    return (

        <div className="detail-card">

            <h2>

                주간 근무 다이어리

            </h2>

            <div className="week-calendar">

                <div className="week-header">

                    <div></div>

                    {days.map((day) => (

                        <div
                            key={day}
                            className="week-day"
                        >
                            {day}
                        </div>

                    ))}

                </div>

                <div className="week-body">

                    {hours.map((hour) => (

                        <div
                            key={hour}
                            className="week-row"
                        >

                            <div className="week-hour">

                                {hour}:00

                            </div>

                            {days.map((day) => (

                                <div
                                    key={day}
                                    className="week-cell"
                                />

                            ))}

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );

}

export default DashboardWeekCalendar;