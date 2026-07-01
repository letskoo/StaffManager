import { useEffect, useState } from "react";

import "../styles/modal.css";

const initialForm = {
    name: "",
    phone: "",
    birth: "",
    address: "",
    join: "",
    payType: "hourly",
    payAmount: "",
    position: "",
    memo: "",
};

function EmployeeModal({
    open,
    employee,
    onClose,
    onSave,
    onUpdate,
}) {

    const [form, setForm] = useState(initialForm);

    const employeeNo =
        form.phone.replace(/\D/g, "").slice(-4);

    useEffect(() => {

        if (employee) {

            setForm(employee);

        } else {

            setForm(initialForm);

        }

    }, [employee]);

    useEffect(() => {

        if (!open) return;

        const handleKeyDown = (e) => {

            if (e.key === "Escape") {

                setForm(initialForm);

                onClose();

            }

        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [open, onClose]);

    if (!open) return null;

    const handleChange = (e) => {

        let { name, value } = e.target;

        if (name === "phone") {

            value = value.replace(/\D/g, "");

            if (value.length <= 3) {

            }

            else if (value.length <= 7) {

                value =
                    `${value.slice(0, 3)}-${value.slice(3)}`;

            }

            else {

                value =
                    `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;

            }

        }

        setForm({

            ...form,

            [name]: value,

        });

    };

    const handleSubmit = () => {

        if (employee) {

            onUpdate(form);

        } else {

            onSave(form);

        }

    };

    return (
        <div
            className="modal-backdrop"
            onClick={() => {

                setForm(initialForm);

                onClose();

            }}
        >
            <div
                className="modal"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="modal-header">

                    <h2>
                        {employee ? "직원 수정" : "직원 등록"}
                    </h2>

                    <button
                        className="close-btn"
                        onClick={() => {

                            setForm(initialForm);

                            onClose();

                        }}
                    >
                        ×
                    </button>

                </div>

                <div className="form-grid">

                    <label>이름</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                    />

                    <label>전화번호</label>
                    <input
                        name="phone"
                        placeholder="01012345678"
                        value={form.phone}
                        onChange={handleChange}
                    />

                    <label>직원번호</label>
                    <div className="employee-no">
                        {employeeNo || "-"}
                    </div>

                    <label>생년월일</label>
                    <input
                        type="date"
                        name="birth"
                        value={form.birth}
                        onChange={handleChange}
                    />

                    <label>주소</label>
                    <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                    />

                    <label>입사일</label>
                    <input
                        type="date"
                        name="join"
                        value={form.join}
                        onChange={handleChange}
                    />

                    <label>급여방식</label>

                    <div className="radio-group">

                        <label>

                            <input
                                type="radio"
                                name="payType"
                                value="hourly"
                                checked={form.payType === "hourly"}
                                onChange={handleChange}
                            />

                            시급

                        </label>

                        <label>

                            <input
                                type="radio"
                                name="payType"
                                value="monthly"
                                checked={form.payType === "monthly"}
                                onChange={handleChange}
                            />

                            월급

                        </label>

                    </div>

                    <label>

                        {form.payType === "hourly"
                            ? "시급"
                            : "월급"}

                    </label>

                    <input
                        type="number"
                        name="payAmount"
                        value={form.payAmount}
                        onChange={handleChange}
                    />

                    <label>직급</label>

                    <select
                        name="position"
                        value={form.position}
                        onChange={handleChange}
                    >

                        <option value="">
                            선택
                        </option>

                        <option value="직원">
                            직원
                        </option>

                        <option value="매니저">
                            매니저
                        </option>

                        <option value="점장">
                            점장
                        </option>

                    </select>

                    <label>메모</label>

                    <textarea
                        name="memo"
                        value={form.memo}
                        onChange={handleChange}
                    />

                </div>

                <div className="modal-footer">

                    <button
                        className="cancel-btn"
                        onClick={() => {

                            setForm(initialForm);

                            onClose();

                        }}
                    >
                        취소
                    </button>

                    <button
                        className="save-btn"
                        onClick={handleSubmit}
                    >
                        {employee ? "수정" : "저장"}
                    </button>

                </div>

            </div>
        </div>
    );
}

export default EmployeeModal;