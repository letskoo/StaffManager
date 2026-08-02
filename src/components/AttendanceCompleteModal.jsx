import { createPortal } from "react-dom";

import { useEffect } from "react";

import "../styles/attendance-complete-modal.css";

function AttendanceCompleteModal({

    type,

    employee,

    record,

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

                            : type === "breakStart"

                                ? "휴식이 시작되었습니다."

                                : type === "breakEnd"

                                    ? "휴게가 종료되었습니다."

                                    : "출근 처리되었습니다."}

                </p>

                {type === "breakEnd" && record?.breakInfo && (

                    <div className="attendance-summary">

                        {

                            record.breakInfo.exceededBreakMinutes > 0

                                ? (

                                    <>

                                        <div className="summary-card">

                                            <span>

                                                초과 휴게

                                            </span>

                                            <strong>

                                                {record.breakInfo.exceededBreakMinutes}분

                                            </strong>

                                        </div>

                                        <div className="summary-message">

                                            추가 휴게는 승인 대상입니다.

                                        </div>

                                    </>

                                )

                                : (

                                    <>

                                        <div className="summary-card">

                                            <span>

                                                사용한 휴게시간

                                            </span>

                                            <strong>

                                                {record.breakInfo.actualBreakMinutes}분

                                            </strong>

                                        </div>

                                        <div className="summary-card">

                                            <span>

                                                남은 휴게시간

                                            </span>

                                            <strong>

                                                {record.breakInfo.remainingBreakMinutes}분

                                            </strong>

                                        </div>

                                    </>

                                )

                        }

                    </div>

                )}

            </div>

        </div>,

        document.body

    );

}

export default AttendanceCompleteModal;