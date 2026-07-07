import { useEffect, useRef, useState } from "react";

import Header from "../components/Header";
import EmployeeModal from "../components/EmployeeModal";

import useEmployees from "../hooks/useEmployees";

import "../styles/policy.css";

import {

    getApprovalList,
    getResolvedApprovalList,
    updateApprovalStatus,
    restoreApprovalStatus

}

    from "../services/attendanceService";

import {

    exportHistory,

    getHistoryMonths,

}

    from "../services/historyExport";

function Policy() {

    const [openModal, setOpenModal] = useState(false);

    const { addEmployee } = useEmployees();

    const [policy, setPolicy] = useState({

        earlyPayExcludeMinutes: 30,

        lateLimit: 5,

        earlyLeaveLimit: 10,

        overtimeLimit: 15,

    });

    const [approvalList, setApprovalList] = useState([]);

    const [activeTab, setActiveTab] = useState("pending");

    const [resolvedList, setResolvedList] = useState([]);

    const [historyOpen, setHistoryOpen] = useState(false);

    const [historyMonths, setHistoryMonths] = useState([]);

    const historyWrapRef = useRef(null);

    useEffect(() => {

        const saved = JSON.parse(

            localStorage.getItem("policy")

        );

        if (saved) {

            setPolicy({

                earlyPayExcludeMinutes:
                    saved.earlyPayExcludeMinutes ??
                    saved.checkInEarly ??
                    30,

                lateLimit: saved.lateLimit ?? 5,

                earlyLeaveLimit: saved.earlyLeaveLimit ?? 10,

                overtimeLimit: saved.overtimeLimit ?? 15,

            });

        }

        setApprovalList(

            getApprovalList()

        );

        setResolvedList(

            getResolvedApprovalList()

        );

        setHistoryMonths(

            getHistoryMonths()

        );

    }, []);

    useEffect(() => {

        const handleClickOutside = (e) => {

            if (
                historyWrapRef.current &&
                !historyWrapRef.current.contains(e.target)
            ) {
                setHistoryOpen(false);
            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);

    const handleChange = (e) => {

        setPolicy({

            ...policy,

            [e.target.name]: Number(e.target.value)

        });

    };

    const handleSave = () => {

        localStorage.setItem(

            "policy",

            JSON.stringify(policy)

        );

        alert("저장되었습니다.");

    };

    const refreshApprovalList = () => {

        setApprovalList(

            getApprovalList()

        );

        setResolvedList(

            getResolvedApprovalList()

        );

    };

    const handleApprove = (

        id,

        type,

        status

    ) => {

        updateApprovalStatus(

            id,

            type,

            status

        );

        refreshApprovalList();

        setHistoryMonths(

            getHistoryMonths()

        );

    };

    const handleRestore = (

        id,

        type

    ) => {

        restoreApprovalStatus(

            id,

            type

        );

        refreshApprovalList();

        setHistoryMonths(

            getHistoryMonths()

        );

    };

    const list =

        activeTab === "pending"

            ? approvalList

            : resolvedList;

    return (

        <>

            <Header

                title="정책"

                rightContent={

                    <div
                        className="history-wrap"
                        ref={historyWrapRef}
                    >

                        <button

                            className="register-btn"

                            onClick={() => {

                                setHistoryMonths(

                                    getHistoryMonths()

                                );

                                setHistoryOpen(

                                    !historyOpen

                                );

                            }}

                        >

                            ▼ 히스토리

                        </button>

                        {historyOpen && (

                            <div className="history-menu">

                                <button

                                    onClick={() => {

                                        exportHistory();

                                        setHistoryOpen(false);

                                    }}

                                >

                                    전체 다운로드

                                </button>

                                {historyMonths.map((month) => (

                                    <button

                                        key={month}

                                        onClick={() => {

                                            exportHistory(month);

                                            setHistoryOpen(false);

                                        }}

                                    >

                                        {month} 다운로드

                                    </button>

                                ))}

                            </div>

                        )}

                    </div>

                }

            />

            <div className="policy-page">

                <div className="policy-card">

                    <h2>근태 정책</h2>

                    <div className="policy-row">

                        <span>급여 미포함 조기출근</span>

                        <div className="policy-input-column">

                            <div className="policy-input">

                                <input
                                    type="number"
                                    name="earlyPayExcludeMinutes"
                                    value={policy.earlyPayExcludeMinutes}
                                    onChange={handleChange}
                                />

                                <span>분  ㅣ  설정된 시간 이내의 조기출근은 급여가 추가되지 않습니다</span>

                            </div>

                        </div>

                    </div>

                    <div className="policy-row">

                        <span>지각 인정 시간</span>

                        <div className="policy-input">

                            <input
                                type="number"
                                name="lateLimit"
                                value={policy.lateLimit}
                                onChange={handleChange}
                            />

                            <span>분  ㅣ  설정된 시간 이후의 지각부터 급여가 차감됩니다</span>

                        </div>

                    </div>

                    <div className="policy-row">

                        <span>조기퇴근 인정 시간</span>

                        <div className="policy-input">

                            <input
                                type="number"
                                name="earlyLeaveLimit"
                                value={policy.earlyLeaveLimit}
                                onChange={handleChange}
                            />

                            <span>분  ㅣ  설정된 시간 이내의 조기퇴근은 급여가 차감되지 않습니다</span>

                        </div>

                    </div>

                    <div className="policy-row">

                        <span>연장근무 인정</span>

                        <div className="policy-input">

                            <input
                                type="number"
                                name="overtimeLimit"
                                value={policy.overtimeLimit}
                                onChange={handleChange}
                            />

                            <span>분  ㅣ  설정된 시간 이후부터 연장근무 급여가 추가됩니다</span>

                        </div>

                    </div>

                    <div className="policy-save-wrap">

                        <button

                            className="policy-save"

                            onClick={handleSave}

                        >

                            저장

                        </button>

                    </div>

                </div>

                <div className="policy-card" style={{ marginTop: 24 }}>

                    <h2>승인 관리</h2>

                    <div className="policy-tabs">

                        <button

                            className={
                                activeTab === "pending"
                                    ? "policy-tab-active"
                                    : "policy-tab"
                            }

                            onClick={() =>

                                setActiveTab("pending")

                            }

                        >

                            승인대기

                        </button>

                        <button

                            className={
                                activeTab === "resolved"
                                    ? "policy-tab-active"
                                    : "policy-tab"
                            }

                            onClick={() =>

                                setActiveTab("resolved")

                            }

                        >

                            휴지통

                        </button>

                    </div>

                    <table className="employee-table">

                        <thead>

                            <tr>

                                <th style={{ width: "22%" }}>날짜</th>
                                <th style={{ width: "18%" }}>직원</th>
                                <th style={{ width: "14%" }}>시간</th>
                                <th style={{ width: "20%" }}>사유</th>
                                <th style={{ width: "26%" }}>처리</th>

                            </tr>

                        </thead>

                        <tbody>

                            {list.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        style={{
                                            height: 80,
                                            color: "#999"
                                        }}
                                    >

                                        {activeTab === "pending"

                                            ? "승인 대기 내역이 없습니다."

                                            : "처리된 내역이 없습니다."
                                        }

                                    </td>

                                </tr>

                            ) : (

                                list.map((item) => {

                                    let reason = "";
                                    let time = "";

                                    switch (item.approvalType) {

                                        case "earlyCheckIn":
                                            reason = "조기출근";
                                            time = new Date(item.checkIn)
                                                .toLocaleTimeString("ko-KR", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false
                                                });
                                            break;

                                        case "late":
                                            reason = "지각";
                                            time = new Date(item.checkIn)
                                                .toLocaleTimeString("ko-KR", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false
                                                });
                                            break;

                                        case "earlyLeave":
                                            reason = "조기퇴근";
                                            time = new Date(item.checkOut)
                                                .toLocaleTimeString("ko-KR", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false
                                                });
                                            break;

                                        case "overtime":
                                            reason = "연장근무";
                                            time = new Date(item.checkOut)
                                                .toLocaleTimeString("ko-KR", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false
                                                });
                                            break;

                                    }

                                    return (

                                        <tr key={item.approvalId}>

                                            <td>{item.date}</td>

                                            <td>{item.employeeName}</td>

                                            <td>{time}</td>

                                            <td>{reason}</td>

                                            <td>

                                                {activeTab === "pending" ? (

                                                    <div className="policy-action">

                                                        <button

                                                            className="approve-btn"

                                                            onClick={() =>

                                                                handleApprove(

                                                                    item.recordId,

                                                                    item.approvalType,

                                                                    "approved"

                                                                )

                                                            }

                                                        >

                                                            승인

                                                        </button>

                                                        <button

                                                            className="reject-btn"

                                                            onClick={() =>

                                                                handleApprove(

                                                                    item.recordId,

                                                                    item.approvalType,

                                                                    "rejected"

                                                                )

                                                            }

                                                        >

                                                            거절

                                                        </button>

                                                    </div>

                                                ) : (

                                                    <div className="policy-action">

                                                        <strong>

                                                            {item.approvalStatus === "approved"

                                                                ? "승인됨"

                                                                : "거절됨"}

                                                        </strong>

                                                        <button

                                                            className="reject-btn"

                                                            onClick={() =>

                                                                handleRestore(

                                                                    item.recordId,

                                                                    item.approvalType

                                                                )

                                                            }

                                                        >

                                                            복원

                                                        </button>

                                                    </div>

                                                )}

                                            </td>

                                        </tr>

                                    );

                                })

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            <EmployeeModal

                open={openModal}

                employee={null}

                onClose={() => setOpenModal(false)}

                onSave={(employee) => {

                    addEmployee(employee);

                    setOpenModal(false);

                }}

                onUpdate={() => { }}

            />

        </>

    );

}

export default Policy;