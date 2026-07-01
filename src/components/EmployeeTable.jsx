import { Link } from "react-router-dom";

import "../styles/employee.css";

function EmployeeTable({
    employees,
    search,
    setSearch,
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

                        filteredEmployees.map((employee) => (

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

                                <td>{employee.salary}</td>

                                <td>{employee.retirement}</td>

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

                        ))

                    )}

                </tbody>

            </table>

        </div>
    );
}

export default EmployeeTable;