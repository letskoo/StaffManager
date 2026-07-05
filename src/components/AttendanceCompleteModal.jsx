import { createPortal } from "react-dom";

import { useEffect } from "react";

import "../styles/attendance-complete-modal.css";

function AttendanceCompleteModal({

    type,

    employee,

    onClose,

}) {

    useEffect(() => {

        const timer = setTimeout(() => {

            onClose();

        }, 3000);

        return () => clearTimeout(timer);

    }, [onClose]);

    return createPortal(

        <div

            className="attendance-modal-backdrop"

            onClick={onClose}

        >

            <div

                className="attendance-complete"

                onClick={(e) => {

                    e.stopPropagation();

                    onClose();

                }}

            >

                <div className="complete-icon">

                    ✅

                </div>

                <h2>

                    {employee?.name}님

                </h2>

                <p>

                    {type === "done"

                        ? "이미 오늘 근무를 완료했습니다."

                        : type === "checkout"

                            ? "퇴근 처리되었습니다."

                            : "출근 처리되었습니다."}

                </p>

            </div>

        </div>,

        document.body

    );

}

export default AttendanceCompleteModal;