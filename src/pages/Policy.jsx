import { useEffect, useState } from "react";

import Header from "../components/Header";
import EmployeeModal from "../components/EmployeeModal";

import useEmployees from "../hooks/useEmployees";

import "../styles/policy.css";

import {

    getApprovalList

}

    from "../services/attendanceService";

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

    return (

        <>

            <Header

                title="정책"

                onRegister={() => setOpenModal(true)}

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

                                <span>분  (일찍 출근한 직원에 대한 급여를 인정할 것인가에 대한 설정입니다. 설정된 시간 이내의 조기출근은 급여에 포함되지 않습니다)</span>

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

                            <span>분  (직원의 지각에 대한 급여 차감 설정입니다. 설정된 시간까지의 출근은 지각이 아니며 급여에서 차감되지 않습니다)</span>

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

                            <span>분  (먼저 퇴근한 직원의 급여를 차감할 것인가에 대한 설정입니다. 설정된 시간 이전의 퇴근은 조기퇴근이 아니며 급여에 차감되지 않습니다)</span>

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

                            <span>분  (퇴근 시간 이후의 연장근무를 설정합니다. 설정된 시간까지는 연장근무로 인정되지 않으며, 이후의 근무는 연장근무로 인정됩니다)</span>

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

                        <button className="policy-save">

                            승인대기

                        </button>

                        <button
                            style={{
                                width: 140,
                                height: 46,
                                border: "1px solid #ddd",
                                borderRadius: 10,
                                background: "#fff",
                                cursor: "pointer"
                            }}
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

                            {approvalList.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        style={{
                                            height: 80,
                                            color: "#999"
                                        }}
                                    >

                                        승인 대기 내역이 없습니다.

                                    </td>

                                </tr>

                            ) : (

                                approvalList.map((item) => {

                                    let reason = "";
                                    let time = "";

                                    if (item.earlyCheckInApprovalRequired) {

                                        reason = "조기출근";
                                        time = new Date(item.checkIn)
                                            .toLocaleTimeString("ko-KR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false
                                            });

                                    } else if (item.late) {

                                        reason = "지각";
                                        time = new Date(item.checkIn)
                                            .toLocaleTimeString("ko-KR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false
                                            });

                                    } else if (item.earlyLeave) {

                                        reason = "조기퇴근";
                                        time = new Date(item.checkOut)
                                            .toLocaleTimeString("ko-KR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false
                                            });

                                    } else if (item.overtime) {

                                        reason = "연장근무";
                                        time = new Date(item.checkOut)
                                            .toLocaleTimeString("ko-KR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false
                                            });

                                    }

                                    return (

                                        <tr key={item.id}>

                                            <td>{item.date}</td>

                                            <td>{item.employeeName}</td>

                                            <td>{time}</td>

                                            <td>{reason}</td>

                                            <td>

                                                <div className="policy-action">

                                                    <button className="approve-btn">

                                                        승인

                                                    </button>

                                                    <button className="reject-btn">

                                                        거절

                                                    </button>

                                                </div>

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