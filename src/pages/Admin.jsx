import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

function Admin() {
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#f5f6f8",
            }}
        >
            <Sidebar />

            <main
                style={{
                    flex: 1,
                    paddingTop: "20px",
                    paddingLeft: "40px",
                    paddingRight: "40px",
                    paddingBottom: "80px",
                }}
            >
                <Outlet />
            </main>

        </div>
    );
}

export default Admin;