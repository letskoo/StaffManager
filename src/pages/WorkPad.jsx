import "../styles/global.css";

import { useEffect, useState } from "react";
import "../styles/global.css";

function WorkPad() {

    const [employeeNo, setEmployeeNo] = useState([]);
    const [now, setNow] = useState(new Date());

    const handleNumber = (num) => {
        if (employeeNo.length >= 4) return;
        setEmployeeNo([...employeeNo, num]);
    };

    const handleBackspace = () => {
        if (employeeNo.length === 0) return;

        setEmployeeNo(employeeNo.slice(0, -1));
    };

    const handleClear = () => {
        setEmployeeNo([]);
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

                <button onClick={handleClear}>
                    지우기
                </button>

            </div>

            <button className="confirm">
                확 인
            </button>

            <div className="logo">
                <span className="logo-icon">&gt;_</span>
                <span>Developer Project</span>
            </div>

        </div>
    );
}

export default WorkPad;