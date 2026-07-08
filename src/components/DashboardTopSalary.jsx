import "../styles/dashboard.css";

function DashboardTopSalary() {

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

                    {[1,2,3,4,5].map((rank)=>(

                        <tr key={rank}>

                            <td>{rank}</td>

                            <td>-</td>

                            <td>-</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default DashboardTopSalary;