import { useState } from "react";

import useEmployees from "../hooks/useEmployees";

import Header from "../components/Header";
import EmployeeModal from "../components/EmployeeModal";

import "../styles/employee-detail.css";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    ArrowLeft,
    Pencil,
    Trash2
} from "lucide-react";

import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

function EmployeeDetail() {

    const { employeeNo } = useParams();

    const [openModal, setOpenModal] = useState(false);

    const navigate = useNavigate();

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [showToast, setShowToast] = useState(false);

    const [toastMessage, setToastMessage] = useState("");

    const {

        employees,

        addEmployee,

        updateEmployee,

        deleteEmployee,

    } = useEmployees();

    const employee = employees.find(

        (item) => item.no === employeeNo

    );

    const handleSaveEmployee = (newEmployee) => {

        addEmployee(newEmployee);

        setOpenModal(false);

    };

    const handleUpdateEmployee = (updatedEmployee) => {

        updateEmployee(updatedEmployee);

        setOpenModal(false);

        setToastMessage("직원 정보가 수정되었습니다.");

        setShowToast(true);

        setTimeout(() => {

            setShowToast(false);

            setToastMessage("");

        }, 3000);

    };

    const handleDelete = () => {

        deleteEmployee(employee.no);

        setDeleteOpen(false);

        setToastMessage("직원이 삭제되었습니다.");

        setShowToast(true);

        setTimeout(() => {

            navigate("/admin/employee");

        }, 700);

    };

    if (!employee) {

        return (

            <>
                <Header title="직원 상세" />

                <h2>직원을 찾을 수 없습니다.</h2>
            </>

        );

    }

    return (

        <>

            <Header
                title="직원 상세보기"
                onRegister={() => setOpenModal(true)}
            />

            <div className="employee-detail">

                <div className="top-row">

                    <div className="detail-card">

                        <div className="detail-card-header">

                            <h2>기본 정보</h2>

                            <div className="detail-actions">

                                <button
                                    onClick={() => navigate("/admin/employee")}
                                >
                                    <ArrowLeft size={22} />
                                </button>

                                <button
                                    onClick={() => setOpenModal(true)}
                                >
                                    <Pencil size={20} />
                                </button>

                                <button
                                    onClick={() => setDeleteOpen(true)}
                                >
                                    <Trash2 size={20} />
                                </button>

                            </div>

                        </div>

                        <div className="detail-row">
                            <span>직원번호</span>
                            <strong>{employee.no}</strong>
                        </div>

                        <div className="detail-row">
                            <span>이름</span>
                            <strong>{employee.name}</strong>
                        </div>

                        <div className="detail-row">
                            <span>전화번호</span>
                            <strong>{employee.phone}</strong>
                        </div>

                        <div className="detail-row">
                            <span>생년월일</span>
                            <strong>{employee.birth}</strong>
                        </div>

                        <div className="detail-row">
                            <span>주소</span>
                            <strong>{employee.address}</strong>
                        </div>

                        <div className="detail-row">
                            <span>입사일</span>
                            <strong>{employee.join}</strong>
                        </div>

                        <div className="detail-row">
                            <span>직급</span>
                            <strong>{employee.position}</strong>
                        </div>

                        <div className="detail-row">
                            <span>급여방식</span>
                            <strong>
                                {employee.payType === "hourly"
                                    ? "시급"
                                    : "월급"}
                            </strong>
                        </div>

                        <div className="detail-row">
                            <span>급여</span>
                            <strong>
                                {Number(employee.payAmount).toLocaleString()}원
                            </strong>
                        </div>

                    </div>

                    <div className="detail-card">

                        <h2>1~12월 급여</h2>

                        <div className="salary-chart">

                            그래프 영역

                        </div>

                    </div>

                </div>

                <div className="summary-row">

                    <div className="detail-card">

                        <h2>근태</h2>

                        <div className="detail-row">
                            <span>출근</span>
                            <strong>0회</strong>
                        </div>

                        <div className="detail-row">
                            <span>퇴근</span>
                            <strong>0회</strong>
                        </div>

                        <div className="detail-row">
                            <span>지각</span>
                            <strong>0회</strong>
                        </div>

                        <div className="detail-row">
                            <span>조퇴</span>
                            <strong>0회</strong>
                        </div>

                        <div className="detail-row">
                            <span>결근</span>
                            <strong>0회</strong>
                        </div>

                    </div>

                    <div className="right-column">

                        <div className="top-summary">

                            <div className="detail-card">

                                <h2>이번 달 급여</h2>

                                <div className="salary-total">

                                    0원

                                </div>

                            </div>

                            <div className="detail-card">

                                <h2>예상 퇴직금</h2>

                                <div className="salary-total">

                                    0원

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                <div className="detail-card">

                    <h2>메모</h2>

                    <div className="memo-box">

                        {employee.memo || "등록된 메모가 없습니다."}

                    </div>

                </div>

            </div>

            <EmployeeModal
                open={openModal}
                employee={employee}
                onClose={() => setOpenModal(false)}
                onSave={handleSaveEmployee}
                onUpdate={handleUpdateEmployee}
            />

            <ConfirmModal

                open={deleteOpen}

                title="직원 삭제"

                message={`${employee.name} 직원을 삭제하시겠습니까?`}

                onCancel={() => setDeleteOpen(false)}

                onConfirm={handleDelete}

            />

            <Toast

                show={showToast}

                message={toastMessage}

            />

        </>

    );

}

export default EmployeeDetail;