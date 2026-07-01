import { NavLink } from "react-router-dom";

import "../styles/sidebar.css";

function Sidebar() {
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