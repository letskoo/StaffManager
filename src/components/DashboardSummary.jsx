import "../styles/dashboard.css";

import useEmployees from "../hooks/useEmployees";

import {
    getMonthlySalary,
    getRetirement,
} from "../services/salaryService";

import {
    getApprovalList,
} from "../services/attendanceService";

import { useNavigate } from "react-router-dom";

function DashboardSummary() {

    const navigate = useNavigate();

    const { employees } = useEmployees();

    const totalSalary = employees.reduce(
        (sum, employee) =>
            sum + getMonthlySalary(employee),
        0
    );

    const totalRetirement = employees.reduce(
        (sum, employee) =>
            sum + (getRetirement(employee) || 0),
        0
    );

    const approvalCount =
        getApprovalList().length;

    return (

        <div className="dashboard-summary">

            <div

                className="detail-card dashboard-card dashboard-card-clickable"

                onClick={() => navigate("/admin/employee")}

                style={{ cursor: "pointer" }}

            >

                <span className="dashboard-card-title">
                    직원수 ↗
                </span>

                <strong className="dashboard-card-value">
                    {employees.length}명
                </strong>

            </div>

            <div

                className="detail-card dashboard-card dashboard-card-clickable"

                onClick={() => navigate("/admin/policy")}

                style={{ cursor: "pointer" }}

            >

                <span className="dashboard-card-title">
                    미승인 현황 ↗
                </span>

                <strong className="dashboard-card-value">
                    {approvalCount}건
                </strong>

            </div>

            <div className="detail-card dashboard-card">

                <span className="dashboard-card-title">
                    이달의 예상 총 급여
                </span>

                <strong className="dashboard-card-value">
                    {totalSalary.toLocaleString()}원
                </strong>

            </div>

            <div className="detail-card dashboard-card">

                <span className="dashboard-card-title">
                    예상 누적 퇴직금
                </span>

                <strong className="dashboard-card-value">
                    {totalRetirement.toLocaleString()}원
                </strong>

            </div>

        </div>

    );

}

export default DashboardSummary;