import {
    Fragment,
    useEffect,
    useState,
} from "react";

import "../styles/modal.css";

const HOURS = Array.from(
    { length: 24 },
    (_, index) =>
        String(index + 1).padStart(2, "0")
);

const MINUTES = Array.from(
    { length: 12 },
    (_, index) =>
        String(index * 5).padStart(2, "0")
);

function splitTime(time = "09:00") {

    const [
        savedHour = "09",
        savedMinute = "00",
    ] = time.split(":");

    return {

        hour:
            savedHour === "00"
                ? "24"
                : savedHour,

        minute:
            savedHour === "00"
                ? "00"
                : savedMinute,

    };

}

function mergeTime(hour, minute) {

    /*
     * 화면에서는 24:00으로 표시하지만
     * 기존 계산 로직과의 호환을 위해
     * 저장할 때는 00:00으로 변환한다.
     */
    if (hour === "24") {

        return "00:00";

    }

    return `${hour}:${minute}`;

}

function TimeWheel({
    value,
    onChange,
    disabled = false,
}) {

    const {
        hour,
        minute,
    } = splitTime(value);

    const minuteOptions =
        hour === "24"
            ? ["00"]
            : MINUTES;

    const handleHourChange = (nextHour) => {

        const nextMinute =
            nextHour === "24"
                ? "00"
                : minute;

        onChange(
            mergeTime(
                nextHour,
                nextMinute
            )
        );

    };

    const handleMinuteChange = (nextMinute) => {

        onChange(
            mergeTime(
                hour,
                nextMinute
            )
        );

    };

    return (

        <div
            className={`time-wheel ${disabled
                    ? "time-wheel-disabled"
                    : ""
                }`}
        >

            <div className="time-wheel-column">

                <select
                    value={hour}
                    disabled={disabled}
                    aria-label="시간"
                    onChange={(event) =>
                        handleHourChange(
                            event.target.value
                        )
                    }
                >

                    {HOURS.map((item) => (

                        <option
                            key={item}
                            value={item}
                        >
                            {Number(item)}
                        </option>

                    ))}

                </select>

                <span className="time-wheel-unit">
                    시
                </span>

            </div>

            <span className="time-wheel-colon">
                :
            </span>

            <div className="time-wheel-column">

                <select
                    value={minute}
                    disabled={disabled}
                    aria-label="분"
                    onChange={(event) =>
                        handleMinuteChange(
                            event.target.value
                        )
                    }
                >

                    {minuteOptions.map((item) => (

                        <option
                            key={item}
                            value={item}
                        >
                            {item}
                        </option>

                    ))}

                </select>

                <span className="time-wheel-unit">
                    분
                </span>

            </div>

        </div>

    );

}

const initialForm = {
    name: "",
    phone: "",
    birth: "",
    address: "",
    join: "",
    payType: "hourly",
    payAmount: "",
    position: "",
    bank: "",

    accountNumber: "",

    accountHolder: "",

    memo: "",

    workDays: [],

    workTimeType: "same",

    startTime: "09:00",

    endTime: "18:00",

    weekSchedule: {},

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

        const weekSchedule =
            Object.fromEntries(

                form.workDays.map(day => [

                    day,

                    form.workTimeType === "same"

                        ? {

                            start: form.startTime,

                            end: form.endTime,

                        }

                        : {

                            start:
                                form.weekSchedule[day]?.start || "",

                            end:
                                form.weekSchedule[day]?.end || "",

                        }

                ])

            );

        const employeeData = {

            ...form,

            weekSchedule,

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
                        onWheel={(e) => e.currentTarget.blur()}
                        className="no-spinner"
                    />

                    <label>은행</label>

                    <input
                        name="bank"
                        value={form.bank}
                        onChange={handleChange}
                    />

                    <label>계좌번호</label>

                    <input
                        name="accountNumber"
                        value={form.accountNumber}
                        onChange={handleChange}
                    />

                    <label>예금주</label>

                    <input
                        name="accountHolder"
                        value={form.accountHolder}
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

                            <TimeWheel
                                value={form.startTime}
                                onChange={(nextTime) => {

                                    setForm({

                                        ...form,

                                        startTime: nextTime,

                                    });

                                }}
                            />

                            <label>퇴근시간</label>

                            <TimeWheel
                                value={form.endTime}
                                onChange={(nextTime) => {

                                    setForm({

                                        ...form,

                                        endTime: nextTime,

                                    });

                                }}
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
                            ].map(([key, label]) => {

                                const disabled =
                                    !form.workDays.includes(key);

                                const startValue =
                                    form.weekSchedule[key]?.start ||
                                    "09:00";

                                const endValue =
                                    form.weekSchedule[key]?.end ||
                                    "18:00";

                                return (

                                    <Fragment key={key}>

                                        <label>{label}</label>

                                        <div className="week-time-row">

                                            <TimeWheel
                                                value={startValue}
                                                disabled={disabled}
                                                onChange={(nextTime) => {

                                                    setForm({

                                                        ...form,

                                                        weekSchedule: {

                                                            ...form.weekSchedule,

                                                            [key]: {

                                                                ...(
                                                                    form.weekSchedule[key] ||
                                                                    {}
                                                                ),

                                                                start: nextTime,

                                                                end: endValue,

                                                            },

                                                        },

                                                    });

                                                }}
                                            />

                                            <span className="week-time-divider">
                                                ~
                                            </span>

                                            <TimeWheel
                                                value={endValue}
                                                disabled={disabled}
                                                onChange={(nextTime) => {

                                                    setForm({

                                                        ...form,

                                                        weekSchedule: {

                                                            ...form.weekSchedule,

                                                            [key]: {

                                                                ...(
                                                                    form.weekSchedule[key] ||
                                                                    {}
                                                                ),

                                                                start: startValue,

                                                                end: nextTime,

                                                            },

                                                        },

                                                    });

                                                }}
                                            />

                                        </div>

                                    </Fragment>

                                );

                            })}

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