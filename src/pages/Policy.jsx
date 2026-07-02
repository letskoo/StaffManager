import { useEffect, useState } from "react";

import Header from "../components/Header";
import EmployeeModal from "../components/EmployeeModal";

import useEmployees from "../hooks/useEmployees";

import "../styles/policy.css";

function Policy() {

    const [openModal, setOpenModal] = useState(false);

    const { addEmployee } = useEmployees();

    const [policy, setPolicy] = useState({

        checkInEarly: 30,

        lateLimit: 5,

        earlyLeaveLimit: 10,

        overtimeLimit: 15,

    });

    useEffect(() => {

        const saved = JSON.parse(

            localStorage.getItem("policy")

        );

        if (saved) {

            setPolicy(saved);

        }

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

                        <span>출근 가능 시간</span>

                        <div className="policy-input">

                            <input
                                type="number"
                                name="checkInEarly"
                                value={policy.checkInEarly}
                                onChange={handleChange}
                            />

                            <span>분 전부터 출근버튼이 활성화 됩니다</span>

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

                            <span>분 늦은건 지각이 아닙니다</span>

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

                            <span>분 전 퇴근은 조기퇴근이 아닙니다</span>

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

                            <span>분 이후는 연장근무로 인정됩니다</span>

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