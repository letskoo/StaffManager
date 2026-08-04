import {
    createPortal,
} from "react-dom";

import {
    useEffect,
} from "react";

import "../styles/attendance-modal.css";

function ApprovalGuideModal({
    open,
    onClose,
}) {

    useEffect(() => {

        if (!open) return undefined;

        const handleKeyDown = (event) => {

            if (event.key === "Escape") {

                onClose();

            }

        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [
        open,
        onClose,
    ]);

    if (!open) return null;

    return createPortal(

        <div
            className="attendance-modal-backdrop"
            onClick={onClose}
        >

            <div
                className="attendance-modal"
                onClick={(e) => e.stopPropagation()}
                style={{ width: "760px" }}
            >

                <button
                    className="attendance-close"
                    onClick={onClose}
                >
                    ✕
                </button>

                <h2 className="attendance-name">

                    승인 기준 안내

                </h2>

                <p className="attendance-message">

                    승인과 거절에 따라 급여 계산이 달라집니다.

                </p>

                <div style={{ padding: "0 28px" }}>

                    <table className="employee-table">

                        <thead>

                            <tr>

                                <th>항목</th>

                                <th>승인</th>

                                <th>거절</th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr>

                                <td>지각</td>

                                <td>
                                    정상 출근으로 인정 (차감 없음)
                                </td>

                                <td>
                                    지각 시간만큼 급여 차감
                                </td>

                            </tr>

                            <tr>

                                <td>조기퇴근</td>

                                <td>
                                    정상 퇴근으로 인정 (차감 없음)
                                </td>

                                <td>
                                    조기퇴근 시간만큼 급여 차감
                                </td>

                            </tr>

                            <tr>

                                <td>조기출근</td>

                                <td>
                                    조기출근 시간도 급여 지급
                                </td>

                                <td>
                                    계약시간부터만 급여 지급
                                </td>

                            </tr>

                            <tr>

                                <td>연장근무</td>

                                <td>
                                    연장수당 지급
                                </td>

                                <td>
                                    연장수당 지급 안 함
                                </td>

                            </tr>

                            <tr>

                                <td>야간근무</td>

                                <td>
                                    야간가산 지급
                                </td>

                                <td>
                                    야간가산 지급 안 함
                                </td>

                            </tr>

                            <tr>

                                <td>휴게 초과</td>

                                <td>
                                    초과 휴게도 인정
                                </td>

                                <td>
                                    초과 휴게는 급여에서 제외
                                </td>

                            </tr>

                        </tbody>

                    </table>

                    <p className="approval-guide-note">

                        ※ 승인 또는 거절 후 급여는 즉시 다시 계산됩니다.

                    </p>

                </div>

            </div>

        </div>,

        document.body

    );

}

export default ApprovalGuideModal;