import { useState } from "react";

import Header from "../components/Header";
import EmployeeModal from "../components/EmployeeModal";
import Toast from "../components/Toast";

import useEmployees from "../hooks/useEmployees";

import DashboardSummary from "../components/DashboardSummary";
import DashboardCharts from "../components/DashboardCharts";
import DashboardWeekCalendar from "../components/DashboardWeekCalendar";
import DashboardAttendanceBoard from "../components/DashboardAttendanceBoard";

import DashboardTodo from "../components/DashboardTodo";
import DashboardWorking from "../components/DashboardWorking";

import DashboardTopSalary from "../components/DashboardTopSalary";
import DashboardAttendanceSummary from "../components/DashboardAttendanceSummary";

import "../styles/dashboard.css";

function Dashboard() {

    const {

        employees,

        addEmployee,

    } = useEmployees();

    const [openModal, setOpenModal] = useState(false);

    const [showToast, setShowToast] = useState(false);

    const [toastMessage, setToastMessage] = useState("");

    const handleSaveEmployee = (employee) => {

        if (!employee.name.trim()) {
            alert("이름을 입력해 주세요.");
            return;
        }

        if (!employee.phone.trim()) {
            alert("전화번호를 입력해 주세요.");
            return;
        }

        if (!employee.join) {
            alert("입사일을 입력해 주세요.");
            return;
        }

        if (!employee.payAmount) {
            alert("급여를 입력해 주세요.");
            return;
        }

        if (!employee.position) {
            alert("직급을 선택해 주세요.");
            return;
        }

        const duplicated = employees.some(
            (item) => item.phone === employee.phone
        );

        if (duplicated) {
            alert("이미 등록된 전화번호입니다.");
            return;
        }

        addEmployee(employee);

        setOpenModal(false);

        setToastMessage("직원이 등록되었습니다.");

        setShowToast(true);

        setTimeout(() => {

            setShowToast(false);

            setToastMessage("");

        }, 3000);

    };

    return (

        <>

            <Header

                title="대시보드"

                onRegister={() => {

                    setOpenModal(true);

                }}

            />

            <div className="dashboard">

                <DashboardSummary />

                <div className="dashboard-middle">

                    <DashboardCharts />

                    <DashboardWeekCalendar />

                </div>

                <div className="detail-card">

                    <DashboardAttendanceBoard />

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

            <EmployeeModal

                open={openModal}

                employee={null}

                onClose={() => {

                    setOpenModal(false);

                }}

                onSave={handleSaveEmployee}

                onUpdate={() => { }}

            />

            <Toast

                show={showToast}

                message={toastMessage}

            />

        </>

    );

}

export default Dashboard;