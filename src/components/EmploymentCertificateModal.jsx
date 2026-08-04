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

function EmploymentCertificateModal({
    open,
    onClose,
    employee,
}) {

    const companyInfo =
        getCompanyInfo();

    const [showToast, setShowToast] = useState(false);

    const [toastMessage, setToastMessage] = useState("");

    const [capturing, setCapturing] = useState(false);

    const payrollRef = useRef(null);

    if (!open) return null;

    if (!employee) return null;

    const dayLabels = {

        mon: "월",

        tue: "화",

        wed: "수",

        thu: "목",

        fri: "금",

        sat: "토",

        sun: "일",

    };

    const workDaysText =

        Array.isArray(employee.workDays) &&

            employee.workDays.length > 0

            ? employee.workDays

                .map(day => dayLabels[day] || day)

                .join(", ")

            : "-";

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

            showMessage("재직증명서 이미지가 복사되었습니다.");

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

        pdf.save(`재직증명서_${employee.name}.pdf`);

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
                        title="재직증명서"
                        documentNumber={generateDocumentNumber()}
                        issueDate={new Date()}
                    />

                    <div style={{ height: "40px" }} />

                    <div className="contract-body">

                        <p className="contract-intro">
                            아래와 같이 재직 중임을 증명합니다.
                        </p>

                        <hr className="contract-divider" />

                        <div className="contract-section">

                            <h3>○ 회사정보</h3>

                            <div className="contract-row">
                                <span>사업장명</span>
                                <strong>{companyInfo.companyName || "-"}</strong>
                            </div>

                            <div className="contract-row">
                                <span>대표자</span>
                                <strong>{companyInfo.ownerName || "-"}</strong>
                            </div>

                            <div className="contract-row">
                                <span>주소</span>
                                <strong>{companyInfo.address || "-"}</strong>
                            </div>

                            <div className="contract-row">
                                <span>대표전화</span>
                                <strong>{companyInfo.phone || "-"}</strong>
                            </div>

                        </div>

                        <div className="contract-section">

                            <h3>○ 직원정보</h3>

                            <div className="contract-row">

                                <span>성명</span>

                                <strong>
                                    {employee.name || "-"}
                                </strong>

                            </div>

                            <div className="contract-row">

                                <span>생년월일</span>

                                <strong>
                                    {employee.birth || "-"}
                                </strong>

                            </div>

                            <div className="contract-row">

                                <span>주소</span>

                                <strong>
                                    {employee.address || "-"}
                                </strong>

                            </div>

                            <div className="contract-row">

                                <span>전화번호</span>

                                <strong>
                                    {employee.phone || "-"}
                                </strong>

                            </div>

                        </div>

                        <div className="contract-section">

                            <h3>○ 재직정보</h3>

                            <div className="contract-row">
                                <span>입사일</span>
                                <strong>{employee.join || "-"}</strong>
                            </div>

                            <div className="contract-row">
                                <span>직급</span>
                                <strong>{employee.position || "-"}</strong>
                            </div>

                            <div className="contract-row">
                                <span>부서</span>
                                <strong>{employee.department || "-"}</strong>
                            </div>

                            <div className="contract-row">
                                <span>재직상태</span>
                                <strong>재직중</strong>
                            </div>

                        </div>

                        <div className="contract-section contract-section-last">

                            <p className="certificate-message">

                                위 사람은 현재 당사에 재직 중이며,<br />

                                본 증명서는 재직 사실 확인용으로 발급되었습니다.

                            </p>

                        </div>

                    </div>

                    <div className="contract-footer">
                        <DocumentFooter />
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

export default EmploymentCertificateModal;