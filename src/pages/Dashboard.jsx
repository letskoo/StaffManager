import Header from "../components/Header";

import DashboardSummary from "../components/DashboardSummary";
import DashboardCharts from "../components/DashboardCharts";
import DashboardWeekCalendar from "../components/DashboardWeekCalendar";

import DashboardTodo from "../components/DashboardTodo";
import DashboardWorking from "../components/DashboardWorking";

import DashboardTopSalary from "../components/DashboardTopSalary";
import DashboardAttendanceSummary from "../components/DashboardAttendanceSummary";

import "../styles/dashboard.css";

function Dashboard() {

    return (

        <>

            <Header title="대시보드" />

            <div className="dashboard">

                <DashboardSummary />

                <div className="dashboard-middle">

                    <DashboardCharts />

                    <DashboardWeekCalendar />

                </div>

                <div className="dashboard-middle-small">

                    <DashboardTodo />

                    <DashboardWorking />

                </div>

                <div className="dashboard-bottom">

                    <DashboardTopSalary />

                    <DashboardAttendanceSummary />

                </div>

            </div>

        </>

    );

}

export default Dashboard;