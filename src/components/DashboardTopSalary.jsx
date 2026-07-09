import "../styles/dashboard.css";

import useEmployees from "../hooks/useEmployees";

import {
    getMonthlySalary,
} from "../services/salaryService";

function DashboardTopSalary() {

    const { employees } = useEmployees();

    const topEmployees = [...employees]

        .sort(

            (a, b) =>

                getMonthlySalary(b) -

                getMonthlySalary(a)

        )

        .slice(0, 5);

    return (

        <div className="detail-card">

            <h2>

                급여 TOP 5

            </h2>

            <table className="dashboard-table">

                <thead>

                    <tr>

                        <th>순위</th>

                        <th>직원</th>

                        <th>급여</th>

                    </tr>

                </thead>

                <tbody>

                    {topEmployees.map((employee, index) => (

                        <tr key={employee.no}>

                            <td>{index + 1}</td>

                            <td>{employee.name}</td>

                            <td>

                                {getMonthlySalary(employee).toLocaleString()}원

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default DashboardTopSalary;