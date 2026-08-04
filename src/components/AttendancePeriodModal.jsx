import { createPortal } from "react-dom";

import { useState } from "react";

import "../styles/attendance-modal.css";

function AttendancePeriodModal({

    open,

    onClose,

    onConfirm,

}) {

    if (!open) return null;

    const today = new Date();

    const firstDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );

    const lastDay = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
    );

    const formatDate = (date) =>
        date.toISOString().slice(0, 10);

    const [periodType, setPeriodType] =
        useState("current");

    const [startDate, setStartDate] =
        useState(formatDate(firstDay));

    const [endDate, setEndDate] =
        useState(formatDate(lastDay));

    const handlePeriod = (type) => {

        setPeriodType(type);

        if (type === "current") {

            setStartDate(formatDate(firstDay));

            setEndDate(formatDate(lastDay));

        }

        if (type === "previous") {

            const first = new Date(
                today.getFullYear(),
                today.getMonth() - 1,
                1
            );

            const last = new Date(
                today.getFullYear(),
                today.getMonth(),
                0
            );

            setStartDate(formatDate(first));

            setEndDate(formatDate(last));

        }

    };

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

                    출근기록부 출력

                </h2>

                <p className="attendance-message">

                    출력할 기간을 선택하세요.

                </p>

                <div className="attendance-summary">

                    <label className="period-radio">

                        <input
                            type="radio"
                            checked={periodType === "current"}
                            onChange={() => handlePeriod("current")}
                        />

                        <span>이번 달</span>

                    </label>

                    <label className="period-radio">

                        <input
                            type="radio"
                            checked={periodType === "previous"}
                            onChange={() => handlePeriod("previous")}
                        />

                        <span>지난 달</span>

                    </label>

                    <hr className="attendance-divider" />

                    <label className="period-radio">

                        <input
                            type="radio"
                            checked={periodType === "custom"}
                            onChange={() => setPeriodType("custom")}
                        />

                        <span>사용자 지정</span>

                    </label>

                    <div className="period-date-area">

                        <label className="period-date-label">

                            시작일

                        </label>

                        <input
                            className="period-date-input"
                            type="date"
                            value={startDate}
                            disabled={periodType !== "custom"}
                            onChange={(e) =>
                                setStartDate(e.target.value)
                            }
                        />

                        <label className="period-date-label">

                            종료일

                        </label>

                        <input
                            className="period-date-input"
                            type="date"
                            value={endDate}
                            disabled={periodType !== "custom"}
                            onChange={(e) =>
                                setEndDate(e.target.value)
                            }
                        />

                    </div>

                </div>

                <div className="attendance-footer">

                    <button
                        className="attendance-confirm"
                        onClick={() =>
                            onConfirm({
                                startDate,
                                endDate,
                            })
                        }
                    >

                        확인

                    </button>

                </div>

            </div>

        </div>,

        document.body

    );

}

export default AttendancePeriodModal;