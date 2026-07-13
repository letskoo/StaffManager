import { useState } from "react";

function AdminPasswordModal({
    open,
    onClose,
    onSuccess,
}) {
    const [password, setPassword] = useState("");

    if (!open) return null;

    const handleSubmit = () => {
        const adminPassword =
            localStorage.getItem("adminPassword") || "1234";

        if (password === adminPassword) {
            setPassword("");
            onSuccess();
        } else {
            alert("비밀번호가 올바르지 않습니다.");
        }
    };

    return (
        <div className="attendance-modal-backdrop" onClick={onClose}>
            <div className="attendance-modal" onClick={(e) => e.stopPropagation()}>
                <button className="attendance-close" onClick={onClose}>
                    ✕
                </button>

                <h2 className="attendance-name">관리자 인증</h2>

                <p className="attendance-message">
                    관리자 비밀번호를 입력하세요.
                </p>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSubmit();
                        }
                    }}
                    placeholder="비밀번호"
                    style={{
                        width: "100%",
                        height: "54px",
                        border: "1px solid #e5e5e5",
                        borderRadius: "12px",
                        padding: "0 16px",
                        fontSize: "18px",
                        marginBottom: "20px",
                    }}
                />

                <button
                    className="attendance-confirm"
                    onClick={handleSubmit}
                >
                    확인
                </button>
            </div>
        </div>
    );
}

export default AdminPasswordModal;