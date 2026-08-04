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

import {
    getAttendanceByPeriod,
} from "../services/attendanceService";

function AttendanceRecordModal({
    open,
    onClose,
    employee,
    startDate,
    endDate,
}) {

    const companyInfo =
        getCompanyInfo();

    const [showToast, setShowToast] = useState(false);

    const [toastMessage, setToastMessage] = useState("");

    const [capturing, setCapturing] = useState(false);

    const payrollRef = useRef(null);

    if (!open) return null;

    if (!employee) return null;

    if (!startDate || !endDate) {

        return null;

    }

    const records =
        getAttendanceByPeriod(

            employee.no,

            startDate,

            endDate,

        );

    const completedRecords = records.filter(

        record =>
            Boolean(record.checkIn) &&
            Boolean(record.checkOut)

    );

    const totalDays =
        completedRecords.length;

    const totalMinutes =
        completedRecords.reduce(

            (sum, record) =>
                sum + Number(record.workMinutes || 0),

            0

        );

    const totalHours =
        Math.floor(totalMinutes / 60);

    const remainingMinutes =
        totalMinutes % 60;

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

            showMessage("출근기록부 이미지가 복사되었습니다.");

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

        pdf.save(`출근기록부_${employee.name}.pdf`);

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
                        title="출근기록부"
                        documentNumber={generateDocumentNumber()}
                        issueDate={new Date()}
                    />

                    <div style={{ height: "40px" }} />

                    <div className="contract-body">

                        <p className="contract-intro">
                            아래와 같이 출근기록을 증명합니다.
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

                        </div>

                        <div className="contract-section">

                            <h3>○ 직원정보</h3>

                            <div className="contract-row">
                                <span>성명</span>
                                <strong>{employee.name}</strong>
                            </div>

                            <div className="contract-row">
                                <span>직급</span>
                                <strong>{employee.position || "-"}</strong>
                            </div>

                        </div>

                        <div className="contract-section">

                            <h3>○ 출력정보</h3>

                            <div className="contract-row">

                                <span>출력기간</span>

                                <strong>

                                    {startDate} ~ {endDate}

                                </strong>

                            </div>

                        </div>

                        <div className="contract-section contract-section-last">

                            <h3>○ 출근기록</h3>

                            <table className="attendance-table">

                                <thead>

                                    <tr>

                                        <th>번호</th>

                                        <th>날짜</th>

                                        <th>출근</th>

                                        <th>퇴근</th>

                                        <th>근무시간</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {records.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan={5}
                                                className="attendance-empty"
                                            >

                                                해당 기간의 출근기록이 없습니다.

                                            </td>

                                        </tr>

                                    ) : (

                                        records.map((record, index) => (

                                            <tr key={record.id}>

                                                <td>
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    {record.date}
                                                </td>

                                                <td>

                                                    {record.checkIn

                                                        ? new Date(record.checkIn)
                                                            .toLocaleTimeString(
                                                                "ko-KR",
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                    hour12: false,
                                                                }
                                                            )

                                                        : "-"}

                                                </td>

                                                <td>

                                                    {record.checkOut

                                                        ? new Date(record.checkOut)
                                                            .toLocaleTimeString(
                                                                "ko-KR",
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                    hour12: false,
                                                                }
                                                            )

                                                        : "-"}

                                                </td>

                                                <td>

                                                    {record.checkOut

                                                        ? `${Math.floor(
                                                            Number(record.workMinutes || 0) / 60
                                                        )}시간 ${Number(
                                                            record.workMinutes || 0
                                                        ) % 60}분`

                                                        : "-"}

                                                </td>

                                            </tr>

                                        ))

                                    )}

                                </tbody>

                            </table>

                            <div className="attendance-record-summary">

                                <div>

                                    <span>■ 총 근무일수</span>

                                    <strong>

                                        {totalDays}일

                                    </strong>

                                </div>

                                <div>

                                    <span>■ 총 근무시간</span>

                                    <strong>

                                        {totalHours}시간 {remainingMinutes}분

                                    </strong>

                                </div>

                            </div>

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

export default AttendanceRecordModal;