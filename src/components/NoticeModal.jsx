import { useEffect, useState } from "react";

import "../styles/modal.css";

import useEmployees from "../hooks/useEmployees";

const initialForm = {

    category: "notice",

    employeeNo: "",

    amount: "",

    title: "",

    content: "",

};

function NoticeModal({

    open,

    notice,

    onClose,

    onSave,

    onUpdate,

}) {

    const [form, setForm] = useState(initialForm);

    const { employees } = useEmployees();

    useEffect(() => {

        if (notice) {

            setForm(notice);

        } else {

            setForm(initialForm);

        }

    }, [notice]);

    useEffect(() => {

        if (!open) return;

        const handleKeyDown = (e) => {

            if (e.key === "Escape") {

                setForm(initialForm);

                onClose();

            }

        };

        window.addEventListener(

            "keydown",

            handleKeyDown

        );

        return () =>

            window.removeEventListener(

                "keydown",

                handleKeyDown

            );

    }, [open, onClose]);

    if (!open) return null;

    const handleChange = (e) => {

        const {

            name,

            value,

        } = e.target;

        setForm({

            ...form,

            [name]: value,

        });

    };

    const handleSubmit = () => {

        if (
            (
                form.category === "bonus" ||
                form.category === "memo"
            )
            &&
            !form.employeeNo
        ) {

            alert("직원을 선택하세요.");

            return;

        }

        if (

            form.category === "bonus"

            &&

            !form.amount

        ) {

            alert("보너스 금액을 입력하세요.");

            return;

        }

        const submitForm = {

            ...form,

            title: form.content || "개인메모",

        };

        if (notice) {

            onUpdate(submitForm);

        } else {

            onSave(submitForm);

        }

    };

    return (

        <div

            className="modal-backdrop"

            onClick={onClose}

        >

            <div

                className="modal"

                onClick={(e) =>

                    e.stopPropagation()

                }

            >

                <div className="modal-header">

                    <h2>

                        {

                            notice

                                ? "공지 수정"

                                : "공지 등록"

                        }

                    </h2>

                    <button

                        className="close-btn"

                        onClick={onClose}

                    >

                        ×

                    </button>

                </div>

                <div className="form-grid">

                    <label>

                        구분

                    </label>

                    <select

                        name="category"

                        value={form.category}

                        onChange={handleChange}

                    >

                        <option value="notice">

                            공지사항

                        </option>

                        <option value="bonus">
                            보너스
                        </option>

                        <option value="memo">
                            개인메모
                        </option>

                        <option value="praise">
                            칭찬
                        </option>

                    </select>

                    {(
                        form.category === "bonus" ||
                        form.category === "memo"
                    ) && (

                            <>

                                <label>

                                    대상 직원

                                </label>

                                <select

                                    name="employeeNo"

                                    value={form.employeeNo}

                                    onChange={handleChange}

                                >

                                    <option value="">

                                        선택

                                    </option>

                                    {employees.map((employee) => (

                                        <option

                                            key={employee.no}

                                            value={employee.no}

                                        >

                                            {employee.name}

                                            ({employee.no})

                                        </option>

                                    ))}

                                </select>

                                {form.category === "bonus" && (
                                    <>

                                        <label>
                                            보너스 금액
                                        </label>

                                        <input
                                            type="number"
                                            name="amount"
                                            value={form.amount}
                                            onChange={handleChange}
                                        />

                                    </>
                                )}

                            </>

                        )}

                    <label>
                        내용
                    </label>

                    <textarea
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                    />

                </div>

                <div className="modal-footer">

                    <button

                        className="cancel-btn"

                        onClick={onClose}

                    >

                        취소

                    </button>

                    <button

                        className="save-btn"

                        onClick={handleSubmit}

                    >

                        {

                            notice

                                ? "수정"

                                : "저장"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}

export default NoticeModal;