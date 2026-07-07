import {

    getMonthlySalary,

    getRetirement,

} from "../services/salaryService";

import { Link } from "react-router-dom";

import { Copy } from "lucide-react";

import "../styles/employee.css";

function EmployeeTable({
    employees,
    search,
    setSearch,
    onCopy,
    onEdit,
    onDelete
}) {

    const filteredEmployees = employees.filter((employee) => {

        const keyword = search.toLowerCase();

        return (
            employee.name.toLowerCase().includes(keyword)
            ||
            employee.phone.includes(search)
            ||
            employee.no.includes(search)
        );

    });

    const handleCopySalary = async (
        employee,
        monthlySalary
    ) => {

        const text = `${employee.bank || ""}
${employee.accountNumber || ""}
${monthlySalary}`;

        await navigator.clipboard.writeText(text);

        if (onCopy) {

            onCopy();

        }

    };

    return (
        <div className="employee-page">

            <input
                className="employee-search"
                placeholder="이름, 전화번호, 직원번호 검색"

                value={search}

                onChange={(e) =>
                    setSearch(e.target.value)
                }
            />

            <table className="employee-table">

                <thead>

                    <tr>
                        <th>직원번호</th>
                        <th>이름</th>
                        <th>전화번호</th>
                        <th>입사일</th>
                        <th>이달의 급여</th>
                        <th>예상 퇴직금</th>
                        <th>상태</th>
                        <th>관리</th>
                    </tr>

                </thead>

                <tbody>

                    {filteredEmployees.length === 0 ? (

                        <tr>

                            <td
                                colSpan="8"
                                style={{
                                    height: "80px",
                                    color: "#999"
                                }}
                            >
                                등록된 직원이 없습니다.
                            </td>

                        </tr>

                    ) : (

                        filteredEmployees.map((employee) => {

                            const monthlySalary = getMonthlySalary(employee);

                            const retirement = getRetirement(employee);

                            return (

                                <tr key={employee.no}>

                                    <td>{employee.no}</td>

                                    <td>

                                        <Link
                                            className="employee-name"
                                            to={`/admin/employee/${employee.no}`}
                                        >
                                            {employee.name}
                                        </Link>

                                    </td>

                                    <td>{employee.phone}</td>

                                    <td>{employee.join}</td>

                                    <td>
                                        <div className="salary-copy-cell">

                                            <span>
                                                {monthlySalary.toLocaleString()}원
                                            </span>

                                            <button
                                                className="salary-copy-btn"
                                                onClick={() =>
                                                    handleCopySalary(
                                                        employee,
                                                        monthlySalary
                                                    )
                                                }
                                                title="계좌번호와 급여 복사"
                                            >
                                                <Copy size={15} />
                                            </button>

                                        </div>
                                    </td>

                                    <td>

                                        {retirement === null

                                            ? "대상 아님"

                                            : `${retirement.toLocaleString()}원`}

                                    </td>

                                    <td>{employee.status}</td>

                                    <td>

                                        <button
                                            className="edit-btn"
                                            onClick={() => onEdit(employee)}
                                        >
                                            수정
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() => onDelete(employee)}
                                        >
                                            삭제
                                        </button>

                                    </td>

                                </tr>

                            );

                        })

                    )}

                </tbody>

            </table>

        </div>
    );
}

export default EmployeeTable;