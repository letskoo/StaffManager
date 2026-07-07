import { useState, useRef } from "react";

import * as htmlToImage from "html-to-image";

import jsPDF from "jspdf";

import Toast from "./Toast";

import "../styles/payroll-statement-modal.css";

function PayrollStatementModal({
    open,
    onClose,
    statement,
}) {

    const [showToast, setShowToast] = useState(false);

    const [toastMessage, setToastMessage] = useState("");

    const [capturing, setCapturing] = useState(false);

    const payrollRef = useRef(null);

    if (!open) return null;

    if (!statement) return null;

    const showMessage = (message) => {

        setToastMessage(message);

        setShowToast(true);

        setTimeout(() => {

            setShowToast(false);

            setToastMessage("");

        }, 2000);

    };

    const createPayrollImage = async () => {

        setCapturing(true);

        await new Promise(resolve => setTimeout(resolve, 50));

        const dataUrl = await htmlToImage.toPng(
            payrollRef.current,
            {
                pixelRatio: 3,
                backgroundColor: "#ffffff",
            }
        );

        setCapturing(false);

        const blob = await (await fetch(dataUrl)).blob();

        return {

            dataUrl,
            blob,

        };

    };

    const handleCopyImage = async () => {

        try {

            const { blob } =
                await createPayrollImage();

            if (!blob) return;

            await navigator.clipboard.write([

                new ClipboardItem({
                    "image/png": blob,
                }),

            ]);

            showMessage("급여명세서 이미지가 복사되었습니다.");

        } catch (error) {

            console.error(error);

            alert("이미지 복사에 실패했습니다.");

        }

    };

    const handleDownloadPdf = async () => {

        const { dataUrl } =
            await createPayrollImage();

        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();

        const imgWidth = pageWidth - 30;

        const imgHeight = imgWidth * 1.25;

        pdf.addImage(
            dataUrl,
            "PNG",
            15,
            15,
            imgWidth,
            imgHeight
        );

        pdf.save(`급여명세서_${statement.employeeName}.pdf`);

        showMessage("PDF가 다운로드되었습니다.");

    };

    return (

        <div
            className="payroll-backdrop"
            onClick={onClose}
        >

            <div
                ref={payrollRef}
                className="payroll-modal"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="payroll-paper">

                    <div className="payroll-header">

                        <h2>급여명세서</h2>

                        <p>2026년 7월</p>

                    </div>

                    <div className="payroll-section payroll-info">

                        <div className="payroll-row">
                            <span>직원명</span>
                            <strong>{statement.employeeName}</strong>
                        </div>

                        <div className="payroll-row">
                            <span>직원번호</span>
                            <strong>{statement.employeeNo}</strong>
                        </div>

                        <div className="payroll-row">
                            <span>직급</span>
                            <strong>{statement.position}</strong>
                        </div>

                        <div className="payroll-row">
                            <span>급여방식</span>
                            <strong>{statement.payType}</strong>
                        </div>

                    </div>

                    <div className="payroll-section">

                        <div className="payroll-row">
                            <span>기본급</span>
                            <strong>{statement.basePay.toLocaleString()}원</strong>
                        </div>

                        <div className="payroll-row">
                            <span>연장수당</span>
                            <strong>{statement.overtimePay.toLocaleString()}원</strong>
                        </div>

                        <div className="payroll-row">
                            <span>야간수당</span>
                            <strong>{statement.nightPay.toLocaleString()}원</strong>
                        </div>

                        <div className="payroll-row">
                            <span>휴일수당</span>
                            <strong>{statement.holidayPay.toLocaleString()}원</strong>
                        </div>

                        <div className="payroll-row">
                            <span>주휴수당</span>
                            <strong>{statement.weeklyHolidayPay.toLocaleString()}원</strong>
                        </div>

                        <div className="payroll-row">
                            <span>보너스</span>
                            <strong>{statement.bonus.toLocaleString()}원</strong>
                        </div>

                        <div className="payroll-row">
                            <span>결근차감</span>
                            <strong>{statement.absentDeduction.toLocaleString()}원</strong>
                        </div>

                    </div>

                    <div className="payroll-total">

                        <span>실지급액</span>

                        <strong>
                            {statement.totalPay.toLocaleString()}원
                        </strong>

                    </div>

                    {capturing ? (

                        <div className="payroll-logo">

                            <span className="payroll-logo-icon">
                                &gt;_
                            </span>

                            <span>
                                Developer Project
                            </span>

                        </div>

                    ) : (

                        <div className="payroll-buttons">

                            <button onClick={handleCopyImage}>
                                이미지 복사
                            </button>

                            <button onClick={handleDownloadPdf}>
                                PDF 다운로드
                            </button>

                            <button onClick={onClose}>
                                닫기
                            </button>

                        </div>

                    )}

                </div>

                <Toast
                    show={showToast}
                    message={toastMessage}
                />

            </div>

        </div>

    );

}

export default PayrollStatementModal;