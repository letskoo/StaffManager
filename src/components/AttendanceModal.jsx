import { createPortal } from "react-dom";

import "../styles/attendance-modal.css";

import InfoCard from "./InfoCard";

import { useState } from "react";

import {

    getAttendanceCards,

} from "../services/attendanceCardService";

import {
    getMonthlySalary,
    getRetirement,
} from "../services/salaryService";

function AttendanceModal({

    type,

    employees,

    onClose,

    onConfirm,

}) {

    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const cards = getAttendanceCards().sort(

        (a, b) =>

            new Date(b.createdAt) -

            new Date(a.createdAt)

    );

    const noticeCards = cards.filter(

        (card) => card.category === "notice"

    );

    const currentEmployee =

        type === "employeeSelect"

            ? selectedEmployee

            : employees[0];

    const monthlySalary =
        currentEmployee
            ? getMonthlySalary(currentEmployee)
            : 0;

    const retirement =
        currentEmployee
            ? getRetirement(currentEmployee)
            : null;

    const bonusCards = cards.filter(

        (card) =>

            card.category === "bonus"

            &&

            currentEmployee

            &&

            card.employeeNo === currentEmployee.no

    );

    const memoCards = cards.filter(

        (card) =>

            card.category === "memo"

            &&

            currentEmployee

            &&

            card.employeeNo === currentEmployee.no

    );

    const praiseCards = cards.filter(

        (card) => card.category === "praise"

    );

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

                        : type === "checkout"

                            ? "퇴근 처리하시겠습니까?"

                            : "출근 처리하시겠습니까?"}

                </p>

                {type !== "employeeSelect" && (

                    <div className="attendance-summary">

                        <div className="summary-card">

                            <span>
                                이번 달 예상 급여
                            </span>

                            <strong>
                                {monthlySalary.toLocaleString()}원
                            </strong>

                        </div>

                        <div className="summary-card">

                            <span>
                                예상 퇴직금
                            </span>

                            <strong>

                                {
                                    retirement === null
                                        ? "대상 아님"
                                        : `${retirement.toLocaleString()}원`
                                }

                            </strong>

                        </div>

                    </div>

                )}

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

                {noticeCards.length > 0 && (

                    <InfoCard

                        type="notice"

                        icon="📢"

                        title="공지사항"

                    >
                        {noticeCards.map((card) => (

                            <div
                                key={card.id}
                                className="notice-item"
                            >

                                <div className="notice-item-title">

                                    {card.title}

                                </div>

                            </div>

                        ))}

                    </InfoCard>

                )}

                {bonusCards.length > 0 && (

                    <InfoCard

                        type="bonus"

                        icon="🎁"

                        title="보너스"

                    >

                        {bonusCards.map((card) => (

                            <div
                                key={card.id}
                                className="notice-item"
                            >

                                <div className="bonus-header">

                                    <div className="notice-item-title">

                                        {card.title}

                                    </div>

                                    <div className="bonus-amount">

                                        {Number(card.amount).toLocaleString()}원

                                    </div>

                                </div>

                                {card.content && (

                                    <div className="notice-item-content">

                                        {card.content}

                                    </div>

                                )}

                                <div className="bonus-date">

                                    📅 지급 예정일 :
                                    {" "}
                                    {new Date(
                                        new Date().getFullYear(),
                                        new Date().getMonth() + 1,
                                        0
                                    ).toLocaleDateString("ko-KR")}
                                </div>

                            </div>

                        ))}

                    </InfoCard>

                )}

                {memoCards.length > 0 && (

                    <InfoCard

                        type="memo"

                        icon="📝"

                        title="개인메모"

                    >

                        {memoCards.map((card) => (

                            <div
                                key={card.id}
                                className="notice-item"
                            >

                                <div className="notice-item-content">

                                    {card.content}

                                </div>

                            </div>

                        ))}

                    </InfoCard>

                )}

                {praiseCards.length > 0 && (

                    <InfoCard

                        type="praise"

                        icon="👍"

                        title="칭찬"

                    >

                        {praiseCards.map((card) => (

                            <div
                                key={card.id}
                                className="notice-item"
                            >

                                <div className="notice-item-content">

                                    {card.content || card.title}

                                </div>

                            </div>

                        ))}

                    </InfoCard>

                )}

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