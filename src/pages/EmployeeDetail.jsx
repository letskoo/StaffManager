import { useState } from "react";

import useEmployees from "../hooks/useEmployees";

import Header from "../components/Header";
import EmployeeModal from "../components/EmployeeModal";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import PayrollStatementModal from "../components/PayrollStatementModal";
import DashboardWeekCalendar from "../components/DashboardWeekCalendar";

import "../styles/employee-detail.css";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    Pencil,
    Trash2,
} from "lucide-react";

import {
    getMonthlySalary,
    getRetirement,
    getYearlySalaryChartData,
    getMonthlyPayrollStatement,
} from "../services/salaryService";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

import {
    getMonthlyAttendanceSummary,
} from "../services/attendanceService";

function EmployeeDetail() {

    const { employeeNo } = useParams();

    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState(false);

    const [editEmployee, setEditEmployee] = useState(null);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [showToast, setShowToast] = useState(false);

    const [toastMessage, setToastMessage] = useState("");

    const [statementOpen, setStatementOpen] = useState(false);

    const {
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
    } = useEmployees();

    const employee = employees.find(
        (item) => item.no === employeeNo
    );

    const monthlySalary = employee
        ? getMonthlySalary(employee)
        : 0;

    const retirement = employee
        ? getRetirement(employee)
        : 0;

    const age = (() => {

        if (!employee?.birth) {
            return "";
        }

        const birth = new Date(employee.birth);

        const today = new Date();

        let calculatedAge =
            today.getFullYear() -
            birth.getFullYear();

        const birthday = new Date(
            today.getFullYear(),
            birth.getMonth(),
            birth.getDate()
        );

        if (today < birthday) {
            calculatedAge--;
        }

        return calculatedAge;

    })();

    const attendance = employee
        ? getMonthlyAttendanceSummary(employee.no)
        : {
            checkIn: 0,
            checkOut: 0,
            late: 0,
            earlyLeave: 0,
            absent: 0,
        };

    const salaryChartData = employee
        ? getYearlySalaryChartData(employee)
        : [];

    const statement = employee
        ? getMonthlyPayrollStatement(employee)
        : null;

    const handleSaveEmployee = (newEmployee) => {

        addEmployee(newEmployee);

        setOpenModal(false);

    };

    const handleUpdateEmployee = (updatedEmployee) => {

        updateEmployee(updatedEmployee);

        setOpenModal(false);

        setEditEmployee(null);

        setToastMessage(
            "직원 정보가 수정되었습니다."
        );

        setShowToast(true);

        setTimeout(() => {

            setShowToast(false);

            setToastMessage("");

        }, 3000);

    };

    const handleDelete = () => {

        deleteEmployee(employee.no);

        setDeleteOpen(false);

        setToastMessage(
            "직원이 삭제되었습니다."
        );

        setShowToast(true);

        setTimeout(() => {

            navigate("/admin/employee");

        }, 700);

    };

    if (!employee) {

        return (

            <>

                <Header title="직원 상세" />

                <h2>
                    직원을 찾을 수 없습니다.
                </h2>

            </>

        );

    }

    return (

        <>

            <Header
                title="직원 상세보기"
                registerText="급여명세서"
                onRegister={() =>
                    setStatementOpen(true)
                }
            />

            <div className="employee-detail">

                <div className="top-row">

                    <div className="detail-card">

                        <div className="detail-card-header">

                            <h2>
                                기본 정보
                            </h2>

                            <div className="detail-actions">

                                <button
                                    onClick={() =>
                                        navigate(
                                            "/admin/employee"
                                        )
                                    }
                                >
                                    <ArrowLeft size={22} />
                                </button>

                                <button
                                    onClick={() => {

                                        setEditEmployee(
                                            employee
                                        );

                                        setOpenModal(true);

                                    }}
                                >
                                    <Pencil size={20} />
                                </button>

                                <button
                                    onClick={() =>
                                        setDeleteOpen(true)
                                    }
                                >
                                    <Trash2 size={20} />
                                </button>

                            </div>

                        </div>

                        <div className="detail-row">

                            <span>
                                직원번호
                            </span>

                            <strong>
                                {employee.no}
                            </strong>

                        </div>

                        <div className="detail-row">

                            <span>
                                이름
                            </span>

                            <strong>
                                {employee.name}
                            </strong>

                        </div>

                        <div className="detail-row">

                            <span>
                                전화번호
                            </span>

                            <strong>
                                {employee.phone}
                            </strong>

                        </div>

                        <div className="detail-row">

                            <span>
                                생년월일
                            </span>

                            <strong>

                                {employee.birth}

                                {age !== "" &&
                                    ` (만 ${age}세)`}

                            </strong>

                        </div>

                        <div className="detail-row">

                            <span>
                                주소
                            </span>

                            <strong>
                                {employee.address}
                            </strong>

                        </div>

                        <div className="detail-row">

                            <span>
                                입사일
                            </span>

                            <strong>
                                {employee.join}
                            </strong>

                        </div>

                        <div className="detail-row">

                            <span>
                                직급
                            </span>

                            <strong>
                                {employee.position}
                            </strong>

                        </div>

                        <div className="detail-row">

                            <span>
                                급여방식
                            </span>

                            <strong>

                                {employee.payType === "hourly"
                                    ? "시급"
                                    : "월급"}

                            </strong>

                        </div>

                        <div className="detail-row">

                            <span>
                                급여
                            </span>

                            <strong>

                                {Number(
                                    employee.payAmount
                                ).toLocaleString()}원

                            </strong>

                        </div>

                    </div>

                    <div className="detail-card">

                        <h2>
                            1~12월 급여
                        </h2>

                        <div className="salary-chart">

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <LineChart
                                    data={salaryChartData}
                                    margin={{
                                        top: 15,
                                        right: 20,
                                        left: 20,
                                        bottom: 10,
                                    }}
                                >

                                    <CartesianGrid
                                        stroke="#f0f0f0"
                                        strokeDasharray="4 4"
                                    />

                                    <XAxis
                                        dataKey="month"
                                        tick={{
                                            fontSize: 13,
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        tickFormatter={(value) =>
                                            value.toLocaleString()
                                        }
                                        tick={{
                                            fontSize: 13,
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                        width={70}
                                    />

                                    <Tooltip
                                        formatter={(value) =>
                                            `${Number(
                                                value
                                            ).toLocaleString()}원`
                                        }
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="salary"
                                        stroke="#2563eb"
                                        strokeWidth={4}
                                        dot={{
                                            r: 5,
                                            strokeWidth: 2,
                                        }}
                                        activeDot={{
                                            r: 8,
                                        }}
                                    />

                                </LineChart>

                            </ResponsiveContainer>

                        </div>

                    </div>

                </div>

                <div className="detail-middle-row">

                    <div className="detail-card employee-schedule-card">

                        <DashboardWeekCalendar
                            employee={employee}
                            embedded
                        />

                    </div>

                    <div className="detail-card attendance-card">

                        <h2>
                            근태
                        </h2>

                        <div className="detail-row">

                            <span>
                                출근
                            </span>

                            <strong>
                                {attendance.checkIn}회
                            </strong>

                        </div>

                        <div className="detail-row">

                            <span>
                                퇴근
                            </span>

                            <strong>
                                {attendance.checkOut}회
                            </strong>

                        </div>

                        <div className="detail-row">

                            <span>
                                지각
                            </span>

                            <strong>
                                {attendance.late}회
                            </strong>

                        </div>

                        <div className="detail-row">

                            <span>
                                조퇴
                            </span>

                            <strong>
                                {attendance.earlyLeave}회
                            </strong>

                        </div>

                        <div className="detail-row">

                            <span>
                                결근
                            </span>

                            <strong>
                                {attendance.absent}회
                            </strong>

                        </div>

                    </div>

                    <div className="detail-pay-column">

                        <div className="detail-card detail-pay-card">

                            <h2>
                                이번 달 급여
                            </h2>

                            <div className="salary-total">

                                {monthlySalary.toLocaleString()}원

                            </div>

                        </div>

                        <div className="detail-card detail-pay-card">

                            <h2>
                                예상 퇴직금
                            </h2>

                            <div className="salary-total">

                                {retirement === null
                                    ? "대상 아님"
                                    : `${retirement.toLocaleString()}원`}

                            </div>

                        </div>

                    </div>

                </div>

                <div className="detail-card">

                    <h2>
                        메모
                    </h2>

                    <div className="memo-box">

                        {employee.memo ||
                            "등록된 메모가 없습니다."}

                    </div>

                </div>

            </div>

            <EmployeeModal
                open={openModal}
                employee={editEmployee}
                onClose={() => {

                    setOpenModal(false);

                    setEditEmployee(null);

                }}
                onSave={handleSaveEmployee}
                onUpdate={handleUpdateEmployee}
            />

            <ConfirmModal
                open={deleteOpen}
                title="직원 삭제"
                message={
                    `${employee.name} 직원을 삭제하시겠습니까?`
                }
                onCancel={() =>
                    setDeleteOpen(false)
                }
                onConfirm={handleDelete}
            />

            <Toast
                show={showToast}
                message={toastMessage}
            />

            <PayrollStatementModal
                open={statementOpen}
                onClose={() =>
                    setStatementOpen(false)
                }
                statement={statement}
            />

        </>

    );

}

export default EmployeeDetail;