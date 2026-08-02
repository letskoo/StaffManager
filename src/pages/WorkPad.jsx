import "../styles/global.css";

import { useCallback, useEffect, useState } from "react";

import useEmployees from "../hooks/useEmployees";

import {

    processAttendance,
    getAttendanceType,
    getOpenAttendance,
    saveBreakStart,
    saveBreakEnd,

} from "../services/attendanceService";

import AttendanceModal from "../components/AttendanceModal";

import AttendanceCompleteModal from "../components/AttendanceCompleteModal";

import "../styles/global.css";

import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminPasswordModal from "../components/AdminPasswordModal";

function WorkPad() {

    useEffect(() => {

        if (!localStorage.getItem("adminPassword")) {

            localStorage.setItem(
                "adminPassword",
                "1234"
            );

        }

    }, []);

    const navigate = useNavigate();

    const [adminModalOpen, setAdminModalOpen] = useState(false);

    const [employeeNo, setEmployeeNo] = useState([]);

    const [now, setNow] = useState(new Date());

    const { employees } = useEmployees();

    const [modalOpen, setModalOpen] = useState(false);

    const [completeOpen, setCompleteOpen] = useState(false);

    const [completedEmployee, setCompletedEmployee] = useState(null);

    const [completedType, setCompletedType] = useState("");

    const [completedRecord, setCompletedRecord] = useState(null);

    const [modalType, setModalType] = useState("");

    const [selectedEmployees, setSelectedEmployees] = useState([]);

    const handleCloseComplete = useCallback(() => {

        setCompleteOpen(false);

    }, []);

    const handleNumber = (num) => {
        if (employeeNo.length >= 4) return;
        setEmployeeNo([...employeeNo, num]);
    };

    const handleBackspace = () => {
        if (employeeNo.length === 0) return;

        setEmployeeNo(employeeNo.slice(0, -1));
    };

    const handleBreak = () => {

        const inputNo = employeeNo.join("");

        if (inputNo.length !== 4) {

            alert("직원번호 4자리를 입력하세요.");

            return;

        }

        const matchedEmployees = employees.filter(

            item => item.no === inputNo

        );

        if (matchedEmployees.length === 0) {

            alert("직원을 찾을 수 없습니다.");

            setEmployeeNo([]);

            return;

        }

        if (matchedEmployees.length > 1) {

            setSelectedEmployees(matchedEmployees);

            setModalType("employeeSelectBreak");

            setModalOpen(true);

            return;

        }

        const employee = matchedEmployees[0];

        const attendance = getOpenAttendance(employee.no);

        if (!attendance) {

            alert("먼저 출근을 진행해주세요.");

            setEmployeeNo([]);

            return;

        }

        const breaks = attendance.breaks || [];

        const lastBreak = breaks[breaks.length - 1];

        setSelectedEmployees([employee]);

        if (!lastBreak || lastBreak.end) {

            setModalType("breakStart");

        } else {

            setModalType("breakEnd");

        }

        setModalOpen(true);

        setEmployeeNo([]);

    };

    const handleConfirm = () => {

        const inputNo = employeeNo.join("");

        if (inputNo.length !== 4) {

            alert("직원번호 4자리를 입력하세요.");

            return;

        }

        const matchedEmployees = employees.filter(

            (item) => item.no === inputNo

        );

        if (matchedEmployees.length === 0) {

            alert("직원을 찾을 수 없습니다.");

            setEmployeeNo([]);

            return;

        }

        if (matchedEmployees.length === 1) {

            const nextType = getAttendanceType(
                matchedEmployees[0].no
            );

            setSelectedEmployees(matchedEmployees);

            setModalType(nextType);

            setModalOpen(true);

            setEmployeeNo([]);

            return;

        }

        if (matchedEmployees.length > 1) {

            setSelectedEmployees(matchedEmployees);

            setModalType("employeeSelect");

            setModalOpen(true);

            return;

        }



    };

    useEffect(() => {

        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(timer);

    }, []);

    const week = [
        "일",
        "월",
        "화",
        "수",
        "목",
        "금",
        "토"
    ];

    const timeText = now.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

    const dateText =
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} (${week[now.getDay()]})`;

    return (
        <div className="workpad">

            <button
                className="setting-button"
                onClick={() => setAdminModalOpen(true)}
            >
                <Settings size={28} />
            </button>

            <div className="workpad-scale">

                <h1 className="time">
                    {timeText}
                </h1>

                <p className="date">
                    {dateText}
                </p>

                <div className="title">
                    <h2>직원번호 입력</h2>
                    <p>전화번호 뒤 4자리를 입력해 주세요</p>
                </div>

                <div className="number-box">
                    {[0, 1, 2, 3].map((index) => (
                        <div
                            key={index}
                            className={
                                employeeNo.length === index
                                    ? "active"
                                    : ""
                            }
                        >
                            {employeeNo[index] ?? ""}
                        </div>
                    ))}
                </div>

                <div className="keypad">

                    <button onClick={() => handleNumber("1")}>1</button>
                    <button onClick={() => handleNumber("2")}>2</button>
                    <button onClick={() => handleNumber("3")}>3</button>

                    <button onClick={() => handleNumber("4")}>4</button>
                    <button onClick={() => handleNumber("5")}>5</button>
                    <button onClick={() => handleNumber("6")}>6</button>

                    <button onClick={() => handleNumber("7")}>7</button>
                    <button onClick={() => handleNumber("8")}>8</button>
                    <button onClick={() => handleNumber("9")}>9</button>

                    <button onClick={handleBackspace}>
                        ⌫
                    </button>

                    <button onClick={() => handleNumber("0")}>
                        0
                    </button>

                    <button onClick={handleBreak}>
                        휴식
                    </button>

                </div>

                <button

                    className="confirm"

                    onClick={handleConfirm}

                >

                    확 인

                </button>

                <div className="logo">
                    <span className="logo-icon">&gt;_</span>
                    <span>Developer Project</span>
                </div>

                {modalOpen && (

                    <AttendanceModal

                        type={modalType}

                        employees={selectedEmployees}

                        onClose={() => setModalOpen(false)}

                        onConfirm={(employee) => {

                            if (modalType === "breakStart") {

                                const result = saveBreakStart(employee);

                                setCompletedEmployee(employee);

                                setCompletedType("breakStart");

                                setCompletedRecord(result);

                                setCompleteOpen(true);

                                setModalOpen(false);

                                setEmployeeNo([]);

                                return;

                            }

                            if (modalType === "breakEnd") {

                                const result = saveBreakEnd(employee);

                                setCompletedEmployee(employee);

                                setCompletedType("breakEnd");

                                setCompletedRecord(result);

                                setCompleteOpen(true);

                                setModalOpen(false);

                                setEmployeeNo([]);

                                return;

                            }

                            // 퇴근 전 휴식중인지 확인
                            if (modalType === "checkout") {

                                const attendance =
                                    getOpenAttendance(employee.no);

                                const breaks =
                                    attendance?.breaks || [];

                                const lastBreak =
                                    breaks[breaks.length - 1];

                                if (lastBreak && !lastBreak.end) {

                                    alert(
                                        "휴식 중입니다.\n휴식을 먼저 종료하세요."
                                    );

                                    setModalOpen(false);

                                    setEmployeeNo([]);

                                    return;

                                }

                            }

                            const result = processAttendance(employee);

                            setEmployeeNo([]);

                            setModalOpen(false);

                            setCompletedEmployee(employee);

                            setCompletedType(result.type);

                            setCompletedRecord(result.record);

                            setCompleteOpen(true);

                        }}

                    />

                )}

                {completeOpen && (

                    <AttendanceCompleteModal
                        type={completedType}
                        employee={completedEmployee}
                        record={completedRecord}
                        onClose={handleCloseComplete}
                    />

                )}

            </div>

            <AdminPasswordModal

                open={adminModalOpen}

                onClose={() => setAdminModalOpen(false)}

                onSuccess={() => {

                    sessionStorage.setItem("adminAuth", "true");

                    window.dispatchEvent(new Event("adminAuthChange"));

                    setAdminModalOpen(false);

                    navigate("/admin");

                }}

            />

        </div>
    );
}

export default WorkPad;