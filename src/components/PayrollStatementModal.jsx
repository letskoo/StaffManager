import { useState, useRef } from "react";

import * as htmlToImage from "html-to-image";

import jsPDF from "jspdf";

import Toast from "./Toast";

import "../styles/payroll-statement-modal.css";

import DocumentHeader
    from "../documents/components/DocumentHeader";

import DocumentFooter
    from "../documents/components/DocumentFooter";

import {
    generateDocumentNumber,
} from "../documents/documentNumber";

import {
    getCompanyInfo,
} from "../documents/companyService";

function PayrollStatementModal({
    open,
    onClose,
    statement,
}) {

    const companyInfo =
        getCompanyInfo();

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

        const node = payrollRef.current;

        const dataUrl = await htmlToImage.toPng(
            node,
            {
                pixelRatio: 3,

                backgroundColor: "#ffffff",

                width: node.scrollWidth,
                height: node.scrollHeight,

                canvasWidth: node.scrollWidth * 3,
                canvasHeight: node.scrollHeight * 3,

                style: {
                    margin: "0",
                    transform: "none",
                },
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

                    <DocumentHeader

                        title="급여명세서"

                        subtitle={`${new Date().getFullYear()}년 ${new Date().getMonth() + 1}월`}

                        documentNumber={generateDocumentNumber()}

                        issueDate={new Date()}

                    />

                    <div className="payroll-company-grid">

                        <div className="payroll-company-card">

                            <h3>회사 정보</h3>

                            <div className="payroll-row">

                                <span>사업장명</span>

                                <strong>

                                    {companyInfo.companyName || "-"}

                                </strong>

                            </div>

                            <div className="payroll-row">

                                <span>대표자</span>

                                <strong>

                                    {companyInfo.ownerName || "-"}

                                </strong>

                            </div>

                            <div className="payroll-row">

                                <span>사업자번호</span>

                                <strong>

                                    {companyInfo.businessNumber || "-"}

                                </strong>

                            </div>

                            <div className="payroll-row">

                                <span>대표전화</span>

                                <strong>

                                    {companyInfo.phone || "-"}

                                </strong>

                            </div>

                            <div className="payroll-row">

                                <span>주소</span>

                                <strong>

                                    {companyInfo.address || "-"}

                                </strong>

                            </div>

                        </div>

                        <div className="payroll-company-card">

                            <h3>직원 정보</h3>

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

                        <div className="payroll-section payroll-attendance-impact">

                            <h3>
                                근태 영향
                            </h3>

                            <div className="payroll-row">

                                <span>
                                    지각
                                </span>

                                <strong className="payroll-deduction">

                                    {statement.lateDeduction > 0
                                        ? `-${Number(
                                            statement.lateDeduction
                                        ).toLocaleString()}원 / ${statement.lateMinutes}분`
                                        : "-"}

                                </strong>

                            </div>

                            <div className="payroll-row">

                                <span>
                                    조기퇴근
                                </span>

                                <strong className="payroll-deduction">

                                    {statement.earlyLeaveDeduction > 0
                                        ? `-${Number(
                                            statement.earlyLeaveDeduction
                                        ).toLocaleString()}원 / ${statement.earlyLeaveMinutes}분`
                                        : "-"}

                                </strong>

                            </div>

                            <div className="payroll-row">

                                <span>결근</span>

                                <strong className="payroll-deduction">

                                    {statement.absentDeduction > 0
                                        ? `-${Number(
                                            statement.absentDeduction
                                        ).toLocaleString()}원 / ${statement.absentDays}일`
                                        : "-"}

                                </strong>

                            </div>

                        </div>

                    </div>

                    <div className="payroll-total">

                        <span>실지급액</span>

                        <strong>
                            {statement.totalPay.toLocaleString()}원
                        </strong>

                    </div>

                    <DocumentFooter />

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