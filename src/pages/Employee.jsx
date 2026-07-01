import { useState } from "react";

import useEmployees from "../hooks/useEmployees";

import Header from "../components/Header";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeModal from "../components/EmployeeModal";

import Toast from "../components/Toast";

import ConfirmModal from "../components/ConfirmModal";

function Employee() {
    const [search, setSearch] = useState("");
    const {

        employees,

        addEmployee,

        updateEmployee,

        deleteEmployee: removeEmployee,

    } = useEmployees();
    const [openModal, setOpenModal] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [deleteEmployee, setDeleteEmployee] = useState(null);

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

        const phone = employee.phone;

        const duplicated = employees.some(
            (item) => item.phone === phone
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

    const handleUpdateEmployee = (employee) => {

        updateEmployee(employee);

        setSelectedEmployee(null);

        setOpenModal(false);

        setToastMessage("직원 정보가 수정되었습니다.");

        setShowToast(true);

        setTimeout(() => {

            setShowToast(false);

            setToastMessage("");

        }, 3000);

    };

    const handleDeleteEmployee = () => {

        removeEmployee(deleteEmployee.no);

        setDeleteEmployee(null);

        setToastMessage("직원이 삭제되었습니다.");

        setShowToast(true);

        setTimeout(() => {

            setShowToast(false);

            setToastMessage("");

        }, 3000);

    };

    return (
        <>
            <Header
                title="직원"
                onRegister={() => {

                    setSelectedEmployee(null);

                    setOpenModal(true);

                }}
            />

            <EmployeeTable
                employees={employees}
                search={search}
                setSearch={setSearch}
                onEdit={(employee) => {

                    setSelectedEmployee(employee);

                    setOpenModal(true);

                }}
                onDelete={(employee) => {

                    setDeleteEmployee(employee);

                }}
            />

            <EmployeeModal
                open={openModal}
                employee={selectedEmployee}
                onClose={() => {

                    setSelectedEmployee(null);

                    setOpenModal(false);

                }}
                onSave={handleSaveEmployee}
                onUpdate={handleUpdateEmployee}
            />
            <Toast

                show={showToast}

                message={toastMessage}

            />
            <ConfirmModal

                open={deleteEmployee !== null}

                title="직원 삭제"

                message={`${deleteEmployee?.name} 직원을 삭제하시겠습니까?`}

                onCancel={() => setDeleteEmployee(null)}

                onConfirm={handleDeleteEmployee}

            />
        </>
    );
}

export default Employee;