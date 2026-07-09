import "../styles/dashboard.css";

import useEmployees from "../hooks/useEmployees";

import {

    getAttendanceRecords,

} from "../services/attendanceService";

function DashboardWorking() {

    const { employees } = useEmployees();

    const records = getAttendanceRecords();

    const working = records.filter(

        item => !item.checkOut

    );

    return (

        <div className="detail-card">

            <h2>

                현재 근무중 직원

            </h2>

            <div className="dashboard-empty">

                {working.length === 0 ? (

                    <div className="dashboard-empty">

                        근무중인 직원이 없습니다.

                    </div>

                ) : (

                    <table className="dashboard-table">

                        <tbody>

                            {working.map(record => (

                                <tr key={record.id}>

                                    <td>{record.employeeName}</td>

                                    <td>{record.date}</td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>

        </div>

    );

}

export default DashboardWorking;