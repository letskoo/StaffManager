import { createPortal } from "react-dom";

import "../styles/attendance-modal.css";

import InfoCard from "./InfoCard";

import { useState } from "react";

import {

    getAttendanceCards,

} from "../services/attendanceCardService";

function AttendanceModal({

    type,

    employees,

    onClose,

    onConfirm,

}) {

    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const cards = getAttendanceCards();

    return createPortal(

        <div
            className="attendance-modal-backdrop"
            onClick={onClose}
        >

            <div
                className="attendance-modal"
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    className="attendance-close"
                    onClick={onClose}
                >
                    ✕
                </button>

                <h2 className="attendance-name">

                    {type === "employeeSelect"

                        ? "동일한 번호가 있습니다"

                        : `${employees[0]?.name || ""}님,`}

                </h2>

                <p className="attendance-message">

                    {type === "employeeSelect"

                        ? "본인을 선택하세요"

                        : "출근 처리하시겠습니까?"}

                </p>

                {type === "employeeSelect" && (

                    employees.map((employee) => (

                        <button

                            key={employee.no + employee.name}

                            className={`employee-select ${selectedEmployee?.no === employee.no &&
                                selectedEmployee?.name === employee.name
                                ? "selected"
                                : ""
                                }`}

                            onClick={() => setSelectedEmployee(employee)}

                        >

                            {employee.name}
                            ({employee.position})

                        </button>

                    ))

                )}

                {cards.length > 0 &&

                    cards.map((card) => (

                        <InfoCard

                            key={card.icon + card.title}

                            icon={card.icon}

                            title={card.title}

                        >

                            {card.content}

                        </InfoCard>

                    ))

                }

                <div className="attendance-footer">

                    <button

                        className="attendance-confirm"

                        disabled={

                            type === "employeeSelect" &&

                            !selectedEmployee

                        }

                        onClick={() => {

                            if (type === "employeeSelect") {

                                if (!selectedEmployee) {

                                    return;

                                }

                                onConfirm(selectedEmployee);

                                return;

                            }

                            onConfirm(employees[0]);

                        }}

                    >

                        확인

                    </button>

                </div>

            </div>

        </div>,

        document.body

    );

}

export default AttendanceModal;