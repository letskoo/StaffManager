import { NavLink, useNavigate } from "react-router-dom";

import "../styles/sidebar.css";

function Sidebar() {

    const navigate = useNavigate();

    const handleLogout = () => {

        if (!window.confirm("로그아웃 하시겠습니까?")) {
            return;
        }

        sessionStorage.removeItem("adminAuth");

        navigate("/");

    };

    return (
        <aside className="sidebar">

            <div>

                <h1 className="sidebar-logo">
                    Staff Manager
                </h1>

                <nav className="sidebar-menu">

                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        대시보드
                    </NavLink>

                    <NavLink
                        to="/admin/employee"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        직원
                    </NavLink>

                    <NavLink
                        to="/admin/notice"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        공지
                    </NavLink>

                    <NavLink
                        to="/admin/policy"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        정책
                    </NavLink>

                    <NavLink
                        to="/admin/setting"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        설정
                    </NavLink>

                </nav>

                <button
                    className="sidebar-logout"
                    onClick={handleLogout}
                >
                    로그아웃
                </button>

            </div>

            <div className="sidebar-footer">

                <div className="sidebar-footer-title">
                    Staff Manager
                </div>

                <div className="sidebar-footer-version">
                    Version 1.0.0
                </div>

            </div>

        </aside>
    );
}

export default Sidebar;