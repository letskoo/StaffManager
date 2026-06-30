import "../styles/global.css";

function WorkPad() {
    return (
        <div className="workpad">
            <h1 className="time">08:57:32</h1>

            <p className="date">
                2026-06-29 (월)
            </p>

            <div className="title">
                <h2>직원번호 입력</h2>
                <p>직원번호를 입력해 주세요</p>
            </div>

            <div className="number-box">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>

            <div className="keypad">
                <button>1</button>
                <button>2</button>
                <button>3</button>

                <button>4</button>
                <button>5</button>
                <button>6</button>

                <button>7</button>
                <button>8</button>
                <button>9</button>

                <button>⌫</button>
                <button>0</button>
                <button>지우기</button>
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