import { useEffect } from "react";

import { Routes, Route } from "react-router-dom";

import { syncNationalHolidays } from "./services/HolidayService";

import WorkPad from "./pages/WorkPad";
import Admin from "./pages/Admin";

import Dashboard from "./pages/Dashboard";
import Employee from "./pages/Employee";
import Notice from "./pages/Notice";
import Policy from "./pages/Policy";
import Setting from "./pages/Setting";

import EmployeeDetail from "./pages/EmployeeDetail";

function App() {

    useEffect(() => {

        const year = new Date().getFullYear();

        syncNationalHolidays(year);

        syncNationalHolidays(year + 1);

    }, []);

    return (
        <Routes>

            <Route
                path="/"
                element={<WorkPad />}
            />

            <Route
                path="/admin"
                element={<Admin />}
            >

                <Route
                    index
                    element={<Dashboard />}
                />

                <Route
                    path="employee"
                    element={<Employee />}
                />

                <Route
                    path="employee/:employeeNo"
                    element={<EmployeeDetail />}
                />

                <Route
                    path="notice"
                    element={<Notice />}
                />

                <Route
                    path="policy"
                    element={<Policy />}
                />

                <Route
                    path="setting"
                    element={<Setting />}
                />

            </Route>

        </Routes>
    );
}

export default App;