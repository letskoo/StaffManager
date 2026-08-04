import { useState } from "react";

import {
    getCompanyInfo,
    saveCompanyInfo,
} from "../documents/companyService";

import Header from "../components/Header";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

import {
    resetNoticeCards,
    resetAttendanceCards,
} from "../services/attendanceCardService";

import "../styles/setting.css";

function Setting() {

    const [currentPassword, setCurrentPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmOpen, setConfirmOpen] = useState(false);

    const [confirmTitle, setConfirmTitle] = useState("");

    const [confirmMessage, setConfirmMessage] = useState("");

    const [confirmText, setConfirmText] = useState("초기화");

    const [confirmAction, setConfirmAction] = useState(() => () => { });

    const [showToast, setShowToast] = useState(false);

    const [toastMessage, setToastMessage] = useState("");

    const [companyInfo, setCompanyInfo] = useState(() =>

        getCompanyInfo()

    );

    const openToast = (message) => {

        setToastMessage(message);

        setShowToast(true);

        setTimeout(() => {

            setShowToast(false);

        }, 3000);

    };

    const openConfirm = (
        title,
        message,
        action,
        buttonText = "초기화"
    ) => {

        setConfirmTitle(title);

        setConfirmMessage(message);

        setConfirmAction(() => action);

        setConfirmText(buttonText);

        setConfirmOpen(true);

    };

    return (

        <>

            <Header
                title="설정"
                registerText="문의하기"
                onRegister={() =>
                    window.open(
                        "https://developer-projects.vercel.app/projects.html",
                        "_blank"
                    )
                }
            />

            <div className="setting-page">

                <div className="setting-section">

                    <h2>데이터 초기화</h2>

                    <div className="setting-card">

                        <div className="setting-card-left">

                            <h3>직원 초기화</h3>

                            <p>등록된 직원 정보를 모두 삭제합니다.</p>

                        </div>

                        <div className="setting-card-right">

                            <button
                                className="setting-btn"
                                onClick={() =>
                                    openConfirm(
                                        "직원 초기화",
                                        "등록된 직원을 모두 삭제하시겠습니까?",
                                        () => {

                                            localStorage.removeItem("employees");

                                            window.dispatchEvent(
                                                new Event("employeesUpdated")
                                            );

                                            openToast("직원이 초기화되었습니다.");

                                        }
                                    )
                                }
                            >
                                초기화
                            </button>

                        </div>

                    </div>

                    <div className="setting-card">

                        <div className="setting-card-left">

                            <h3>공지 초기화</h3>

                            <p>등록된 공지를 모두 삭제합니다.</p>

                        </div>

                        <div className="setting-card-right">

                            <button
                                className="setting-btn"
                                onClick={() =>
                                    openConfirm(
                                        "공지 초기화",
                                        "등록된 공지를 모두 삭제하시겠습니까?",
                                        () => {

                                            resetNoticeCards();

                                            openToast("공지가 초기화되었습니다.");

                                        }
                                    )
                                }
                            >
                                초기화
                            </button>

                        </div>

                    </div>

                    <div className="setting-card">

                        <div className="setting-card-left">

                            <h3>정책 초기화</h3>

                            <p>정책을 기본값으로 복원합니다.</p>

                        </div>

                        <div className="setting-card-right">

                            <button
                                className="setting-btn"
                                onClick={() =>
                                    openConfirm(
                                        "정책 초기화",
                                        "정책을 기본값으로 복원하시겠습니까?",
                                        () => {

                                            localStorage.removeItem("policy");

                                            window.dispatchEvent(
                                                new Event("policyUpdated")
                                            );

                                            openToast("정책이 초기화되었습니다.");

                                        }
                                    )
                                }
                            >
                                초기화
                            </button>

                        </div>

                    </div>

                    <div className="setting-card">

                        <div className="setting-card-left">

                            <h3>전체 초기화</h3>

                            <p>프로그램의 모든 데이터를 삭제합니다.</p>

                        </div>

                        <div className="setting-card-right">

                            <button
                                className="setting-btn setting-btn-danger"
                                onClick={() =>
                                    openConfirm(
                                        "전체 초기화",
                                        "프로그램의 모든 데이터를 삭제하시겠습니까?",
                                        () => {

                                            localStorage.removeItem("employees");

                                            localStorage.removeItem("attendanceHistory");

                                            localStorage.removeItem("attendanceRecords");

                                            localStorage.removeItem("holidayCache");

                                            localStorage.removeItem("policy");

                                            window.dispatchEvent(
                                                new Event("policyUpdated")
                                            );

                                            resetAttendanceCards();

                                            window.dispatchEvent(
                                                new Event("employeesUpdated")
                                            );

                                            openToast("모든 데이터가 초기화되었습니다.");

                                        },
                                        "전체 초기화"
                                    )
                                }
                            >
                                전체 초기화
                            </button>

                        </div>

                    </div>

                </div>

                <div className="setting-section">

                    <h2>회사 정보</h2>

                    <div className="setting-company">

                        <div className="setting-company-grid">

                            <div className="setting-input-group">

                                <label>사업장명</label>

                                <input
                                    className="setting-input"
                                    value={companyInfo.companyName}
                                    onChange={(e) =>

                                        setCompanyInfo({

                                            ...companyInfo,

                                            companyName: e.target.value

                                        })

                                    }
                                />

                            </div>

                            <div className="setting-input-group">

                                <label>대표자명</label>

                                <input
                                    className="setting-input"
                                    value={companyInfo.ownerName}
                                    onChange={(e) =>

                                        setCompanyInfo({

                                            ...companyInfo,

                                            ownerName: e.target.value

                                        })

                                    }
                                />

                            </div>

                            <div className="setting-input-group">

                                <label>사업자등록번호</label>

                                <input
                                    className="setting-input"
                                    value={companyInfo.businessNumber}
                                    onChange={(e) =>

                                        setCompanyInfo({

                                            ...companyInfo,

                                            businessNumber: e.target.value

                                        })

                                    }
                                />

                            </div>

                            <div className="setting-input-group">

                                <label>대표전화</label>

                                <input
                                    className="setting-input"
                                    value={companyInfo.phone}
                                    onChange={(e) =>

                                        setCompanyInfo({

                                            ...companyInfo,

                                            phone: e.target.value

                                        })

                                    }
                                />

                            </div>

                        </div>

                        <div className="setting-input-group">

                            <label>사업장 주소</label>

                            <textarea

                                value={companyInfo.address}

                                onChange={(e) =>

                                    setCompanyInfo({

                                        ...companyInfo,

                                        address: e.target.value

                                    })

                                }

                            />

                        </div>

                        <div className="setting-company-grid">

                            <div className="setting-input-group">

                                <label>문서 접두어</label>

                                <input

                                    className="setting-input"

                                    value={companyInfo.documentPrefix}

                                    onChange={(e) =>

                                        setCompanyInfo({

                                            ...companyInfo,

                                            documentPrefix: e.target.value,

                                        })

                                    }

                                />

                            </div>

                            <div className="setting-input-group">

                                <label>담당자</label>

                                <input

                                    className="setting-input"

                                    value={companyInfo.manager}

                                    onChange={(e) =>

                                        setCompanyInfo({

                                            ...companyInfo,

                                            manager: e.target.value,

                                        })

                                    }

                                />

                            </div>

                            <div className="setting-input-group">

                                <label>담당자 직책</label>

                                <input

                                    className="setting-input"

                                    value={companyInfo.managerPosition}

                                    onChange={(e) =>

                                        setCompanyInfo({

                                            ...companyInfo,

                                            managerPosition: e.target.value,

                                        })

                                    }

                                />

                            </div>

                        </div>

                        <div className="setting-password-footer">

                            <button

                                className="setting-btn"

                                onClick={() => {

                                    saveCompanyInfo(companyInfo);

                                    openToast("회사 정보가 저장되었습니다.");

                                }}

                            >

                                저장

                            </button>

                        </div>

                    </div>

                </div>

                <div className="setting-section">

                    <h2>보안</h2>

                    <div className="setting-password">

                        <div className="setting-input-group">

                            <label>현재 비밀번호</label>

                            <input
                                type="password"
                                className="setting-input"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                            />

                        </div>

                        <div className="setting-input-group">

                            <label>새 비밀번호</label>

                            <input
                                type="password"
                                className="setting-input"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                            />

                        </div>

                        <div className="setting-password-footer">

                            <button
                                className="setting-btn"
                                onClick={() => {

                                    const savedPassword =
                                        localStorage.getItem("adminPassword") || "1234";

                                    if (currentPassword !== savedPassword) {

                                        alert("현재 비밀번호가 올바르지 않습니다.");

                                        return;

                                    }

                                    if (!newPassword.trim()) {

                                        alert("새 비밀번호를 입력하세요.");

                                        return;

                                    }

                                    localStorage.setItem(
                                        "adminPassword",
                                        newPassword
                                    );

                                    setCurrentPassword("");

                                    setNewPassword("");

                                    openToast("비밀번호가 변경되었습니다.");

                                }}
                            >
                                비밀번호 변경
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            <ConfirmModal
                open={confirmOpen}
                title={confirmTitle}
                message={confirmMessage}
                confirmText={confirmText}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={() => {

                    confirmAction();

                    setConfirmOpen(false);

                }}
            />

            <Toast
                show={showToast}
                message={toastMessage}
            />

        </>

    );

}

export default Setting;