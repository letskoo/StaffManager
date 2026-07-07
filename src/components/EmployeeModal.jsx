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

    workDays: [],

    workTimeType: "same",

    startTime: "09:00",

    endTime: "18:00",

    weekSchedule: {
        mon: { start: "09:00", end: "18:00" },
        tue: { start: "09:00", end: "18:00" },
        wed: { start: "09:00", end: "18:00" },
        thu: { start: "09:00", end: "18:00" },
        fri: { start: "09:00", end: "18:00" },
        sat: { start: "09:00", end: "18:00" },
        sun: { start: "09:00", end: "18:00" },
    },

    allowOvertime: true,

    allowNight: true,

    allowWeeklyHoliday: true,

    breakEnabled: true,

    allowHoliday: true,

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

            setForm({

                ...initialForm,

                ...employee,

                breakEnabled:
                    employee.workPolicy?.breakEnabled ??
                    employee.breakEnabled ??
                    true,

            });

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

        if (e.target.type === "checkbox") {

            const checked = e.target.checked;

            if (name === "workDays") {

                const next = checked

                    ? [...form.workDays, value]

                    : form.workDays.filter(
                        (day) => day !== value
                    );

                setForm({
                    ...form,
                    workDays: next
                });

                return;
            }

            value = checked;
        }

        setForm({

            ...form,

            [name]: value,

        });

    };

    const handleSubmit = () => {

        const employeeData = {

            ...form,

            workPolicy: {

                ...(form.workPolicy || {}),

                payType: form.payType,

                monthlySalary:

                    form.payType === "monthly"

                        ? Number(form.payAmount)

                        : 0,

                hourlyWage:

                    form.payType === "hourly"

                        ? Number(form.payAmount)

                        : 0,

                startTime: form.startTime,

                endTime: form.endTime,

                breakEnabled: form.breakEnabled,

                allowOvertime: form.allowOvertime,

                allowNight: form.allowNight,

                allowHoliday: form.allowHoliday,

                allowWeeklyHoliday: form.allowWeeklyHoliday,

            },

        };

        if (employee) {

            onUpdate(employeeData);

        } else {

            onSave(employeeData);

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

                        <label className="radio-inline">

                            <input
                                type="radio"
                                name="payType"
                                value="hourly"
                                checked={form.payType === "hourly"}
                                onChange={handleChange}
                            />

                            시급

                        </label>

                        <label className="radio-inline">

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

                    <label>근무요일</label>

                    <div className="workday-box">

                        <label>

                            <input

                                type="checkbox"

                                name="workDays"

                                value="mon"

                                checked={form.workDays.includes("mon")}

                                onChange={handleChange}

                            />

                            월

                        </label>

                        <label>

                            <input

                                type="checkbox"

                                name="workDays"

                                value="tue"
                                checked={form.workDays.includes("tue")}

                                onChange={handleChange}

                            />

                            화

                        </label>

                        <label>

                            <input

                                type="checkbox"

                                name="workDays"

                                value="wed"
                                checked={form.workDays.includes("wed")}

                                onChange={handleChange}

                            />

                            수

                        </label>

                        <label>

                            <input

                                type="checkbox"

                                name="workDays"

                                value="thu"
                                checked={form.workDays.includes("thu")}

                                onChange={handleChange}

                            />

                            목

                        </label>

                        <label>

                            <input

                                type="checkbox"

                                name="workDays"

                                value="fri"
                                checked={form.workDays.includes("fri")}

                                onChange={handleChange}

                            />

                            금

                        </label>

                        <label>

                            <input

                                type="checkbox"

                                name="workDays"

                                value="sat"
                                checked={form.workDays.includes("sat")}

                                onChange={handleChange}

                            />

                            토

                        </label>

                        <label>

                            <input

                                type="checkbox"

                                name="workDays"

                                value="sun"
                                checked={form.workDays.includes("sun")}

                                onChange={handleChange}

                            />

                            일

                        </label>

                    </div>

                    <label>근무시간</label>

                    <div className="radio-group">

                        <label className="radio-inline">

                            <input
                                type="radio"
                                name="workTimeType"
                                value="same"
                                checked={form.workTimeType === "same"}
                                onChange={handleChange}
                            />

                            매일 동일

                        </label>

                        <label className="radio-inline">

                            <input
                                type="radio"
                                name="workTimeType"
                                value="week"
                                checked={form.workTimeType === "week"}
                                onChange={handleChange}
                            />

                            요일별 입력

                        </label>

                    </div>

                    {form.workTimeType === "same" && (

                        <>

                            <label>출근시간</label>

                            <input
                                type="time"
                                name="startTime"
                                value={form.startTime}
                                onChange={handleChange}
                            />

                            <label>퇴근시간</label>

                            <input
                                type="time"
                                name="endTime"
                                value={form.endTime}
                                onChange={handleChange}
                            />

                        </>

                    )}

                    {form.workTimeType === "week" && (

                        <>

                            {[
                                ["mon", "월"],
                                ["tue", "화"],
                                ["wed", "수"],
                                ["thu", "목"],
                                ["fri", "금"],
                                ["sat", "토"],
                                ["sun", "일"],
                            ].map(([key, label]) => (

                                <>

                                    <label>{label}</label>

                                    <div className="week-time-row">

                                        <input
                                            type="time"
                                            value={form.weekSchedule[key].start}
                                            disabled={!form.workDays.includes(key)}
                                            onChange={(e) => {

                                                setForm({

                                                    ...form,

                                                    weekSchedule: {

                                                        ...form.weekSchedule,

                                                        [key]: {

                                                            ...form.weekSchedule[key],

                                                            start: e.target.value

                                                        }

                                                    }

                                                });

                                            }}
                                        />

                                        <span>~</span>

                                        <input
                                            type="time"
                                            value={form.weekSchedule[key].end}
                                            disabled={!form.workDays.includes(key)}
                                            onChange={(e) => {

                                                setForm({

                                                    ...form,

                                                    weekSchedule: {

                                                        ...form.weekSchedule,

                                                        [key]: {

                                                            ...form.weekSchedule[key],

                                                            end: e.target.value

                                                        }

                                                    }

                                                });

                                            }}
                                        />

                                    </div>

                                </>

                            ))}

                        </>

                    )}

                    <label>연장근무</label>

                    <div className="radio-group">

                        <label className="radio-inline">

                            <input
                                type="radio"
                                name="allowOvertime"
                                checked={form.allowOvertime === true}
                                onChange={() =>
                                    setForm({
                                        ...form,
                                        allowOvertime: true
                                    })
                                }
                            />

                            지급

                        </label>

                        <label className="radio-inline">

                            <input
                                type="radio"
                                name="allowOvertime"
                                checked={form.allowOvertime === false}
                                onChange={() =>
                                    setForm({
                                        ...form,
                                        allowOvertime: false
                                    })
                                }
                            />

                            미지급

                        </label>

                    </div>

                    <label>야간수당</label>

                    <div className="radio-group">

                        <label className="radio-inline">

                            <input
                                type="radio"
                                name="allowNight"
                                checked={form.allowNight === true}
                                onChange={() =>
                                    setForm({
                                        ...form,
                                        allowNight: true
                                    })
                                }
                            />

                            지급

                        </label>

                        <label className="radio-inline">

                            <input
                                type="radio"
                                name="allowNight"
                                checked={form.allowNight === false}
                                onChange={() =>
                                    setForm({
                                        ...form,
                                        allowNight: false
                                    })
                                }
                            />

                            미지급

                        </label>

                    </div>

                    <label>주휴수당</label>

                    <div className="radio-group">

                        <label className="radio-inline">

                            <input
                                type="radio"
                                name="allowWeeklyHoliday"
                                checked={form.allowWeeklyHoliday === true}
                                onChange={() =>
                                    setForm({
                                        ...form,
                                        allowWeeklyHoliday: true
                                    })
                                }
                            />

                            지급

                        </label>

                        <label className="radio-inline">

                            <input
                                type="radio"
                                name="allowWeeklyHoliday"
                                checked={form.allowWeeklyHoliday === false}
                                onChange={() =>
                                    setForm({
                                        ...form,
                                        allowWeeklyHoliday: false
                                    })
                                }
                            />

                            미지급

                        </label>

                    </div>

                    <label>휴일수당</label>

                    <div className="radio-group">

                        <label className="radio-inline">

                            <input
                                type="radio"
                                checked={form.allowHoliday === true}
                                onChange={() =>
                                    setForm({
                                        ...form,
                                        allowHoliday: true
                                    })
                                }
                            />

                            지급

                        </label>

                        <label className="radio-inline">

                            <input
                                type="radio"
                                checked={form.allowHoliday === false}
                                onChange={() =>
                                    setForm({
                                        ...form,
                                        allowHoliday: false
                                    })
                                }
                            />

                            미지급

                        </label>

                    </div>

                    <label>휴게시간</label>

                    <div className="radio-group">

                        <label className="radio-inline">

                            <input
                                type="radio"
                                checked={form.breakEnabled}
                                onChange={() =>
                                    setForm({
                                        ...form,
                                        breakEnabled: true
                                    })
                                }
                            />

                            있음

                        </label>

                        <label className="radio-inline">

                            <input
                                type="radio"
                                checked={!form.breakEnabled}
                                onChange={() =>
                                    setForm({
                                        ...form,
                                        breakEnabled: false
                                    })
                                }
                            />

                            없음

                        </label>

                    </div>

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