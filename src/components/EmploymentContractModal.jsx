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

function EmploymentContractModal({
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

            showMessage("근로계약서 이미지가 복사되었습니다.");

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

        pdf.save(`근로계약서_${employee.name}.pdf`);

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
                        title="근로계약서"
                        documentNumber={generateDocumentNumber()}
                        issueDate={new Date()}
                    />

                    <div style={{ height: "40px" }} />

                    <div className="contract-body">

                        <p className="contract-intro">

                            아래와 같이 근로계약을 체결합니다.

                        </p>

                        <hr className="contract-divider" />

                        <div className="contract-section">

                            <h3>○ 사업주(갑)</h3>

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

                            <h3>○ 근로자(을)</h3>

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

                            <h3>1. 근로계약기간</h3>

                            <p>

                                입사일인&nbsp;

                                <strong>
                                    {employee.join || "-"}
                                </strong>

                                부터 기간의 정함 없이 근로계약을 체결한다.

                            </p>

                        </div>

                        <div className="contract-section">

                            <h3>2. 근무장소</h3>

                            <p>
                                회사가 지정하는 사업장에서 근무한다.
                            </p>

                        </div>

                        <div className="contract-section">

                            <h3>3. 업무내용</h3>

                            <p>
                                회사가 지정하는 업무를 수행한다.
                            </p>

                        </div>

                        <div className="contract-section">

                            <h3>4. 소정근로시간</h3>

                            <p>

                                근무요일 :&nbsp;

                                <strong>
                                    {workDaysText}
                                </strong>

                            </p>

                            <p>

                                근무시간 :&nbsp;

                                <strong>
                                    {employee.workPolicy?.startTime ||
                                        employee.startTime ||
                                        "09:00"}
                                </strong>

                                &nbsp;~&nbsp;

                                <strong>
                                    {employee.workPolicy?.endTime ||
                                        employee.endTime ||
                                        "18:00"}
                                </strong>

                            </p>

                        </div>

                        <div className="contract-section">

                            <h3>5. 근무사항</h3>

                            <div className="contract-row">
                                <span>연장근무</span>
                                <strong>
                                    {employee.workPolicy?.allowOvertime ? "지급" : "미지급"}
                                </strong>
                            </div>

                            <div className="contract-row">
                                <span>야간수당</span>
                                <strong>
                                    {employee.workPolicy?.allowNight ? "지급" : "미지급"}
                                </strong>
                            </div>

                            <div className="contract-row">
                                <span>주휴수당</span>
                                <strong>
                                    {employee.workPolicy?.allowWeeklyHoliday ? "지급" : "미지급"}
                                </strong>
                            </div>

                            <div className="contract-row">
                                <span>휴일수당</span>
                                <strong>
                                    {employee.workPolicy?.allowHoliday ? "지급" : "미지급"}
                                </strong>
                            </div>

                            <div className="contract-row">
                                <span>휴게시간</span>
                                <strong>
                                    {employee.workPolicy?.breakEnabled ? "있음" : "없음"}
                                </strong>
                            </div>

                            <p className="contract-note">
                                ※ 휴게시간은 4시간 근무 시 30분 제공되며,
                                급여는 실제 근무시간 기준으로 지급됩니다.
                            </p>

                        </div>

                        <div className="contract-section contract-section-last">

                            <h3>6. 임금</h3>

                            <p>

                                급여방식 :&nbsp;

                                <strong>

                                    {employee.workPolicy?.payType === "monthly"
                                        ? "월급"
                                        : "시급"}

                                </strong>

                            </p>

                            <p>

                                지급금액 :&nbsp;

                                <strong>

                                    {employee.workPolicy?.payType === "monthly"
                                        ? Number(
                                            employee.workPolicy.monthlySalary || 0
                                        ).toLocaleString()
                                        : Number(
                                            employee.workPolicy?.hourlyWage || 0
                                        ).toLocaleString()}

                                    원

                                </strong>

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

export default EmploymentContractModal;