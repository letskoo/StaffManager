import { useNavigate } from "react-router-dom";

import {
    getApprovalList,
    getAttendanceRecords,
} from "../services/attendanceService";

import "../styles/dashboard.css";

function DashboardTodo() {

    const navigate = useNavigate();

    const approvalList = getApprovalList();

    const workingRecords = getAttendanceRecords().filter(
        (record) => !record.checkOut
    );

    const todos = [
        {
            label: "승인 대기",
            count: approvalList.length,
            path: "/admin/policy",
        },
        {
            label: "퇴근 미처리",
            count: workingRecords.length,
            path: "/admin/policy",
        },
    ];

    return (

        <div className="detail-card">

            <h2>오늘 확인할 일</h2>

            <div className="dashboard-todo-list">

                {todos.map((todo) => (

                    <button
                        key={todo.label}
                        className="dashboard-todo-item"
                        onClick={() => navigate(todo.path)}
                    >

                        <span>{todo.label}</span>

                        <strong>{todo.count}건</strong>

                    </button>

                ))}

            </div>

        </div>

    );

}

export default DashboardTodo;