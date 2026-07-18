import { useState, useEffect } from "react";

export default function useEmployees() {

    const [employees, setEmployees] = useState([]);

    useEffect(() => {

        const loadEmployees = () => {

            const saved =
                JSON.parse(
                    localStorage.getItem("employees")
                ) || [];

            setEmployees(saved);

        };

        loadEmployees();

        window.addEventListener(
            "storage",
            loadEmployees
        );

        window.addEventListener(
            "focus",
            loadEmployees
        );

        window.addEventListener(
            "employeesUpdated",
            loadEmployees
        );

        return () => {

            window.removeEventListener(
                "storage",
                loadEmployees
            );

            window.removeEventListener(
                "focus",
                loadEmployees
            );

            window.removeEventListener(
                "employeesUpdated",
                loadEmployees
            );

        };

    }, []);

    const saveEmployees = (list) => {

        setEmployees(list);

        localStorage.setItem(
            "employees",
            JSON.stringify(list)
        );

        window.dispatchEvent(
            new Event("employeesUpdated")
        );

    };

    const addEmployee = (employee) => {

    const employeeNo =
        employee.phone.replace(/\D/g, "").slice(-4);

    const payAmount =
        Math.round(
            Number(employee.payAmount) || 0
        );

    const payType =
        employee.payType || "monthly";

    const newEmployee = {

        ...employee,

        no: employeeNo,

        payType,

        payAmount,

        salary: "0원",

        retirement: "0원",

        status: "재직",

        workPolicy: {

            ...(employee.workPolicy || {}),

            payType,

            monthlySalary:
                payType === "monthly"
                    ? payAmount
                    : 0,

            hourlyWage:
                payType === "hourly"
                    ? payAmount
                    : 0,

                startTime:

                    employee.startTime || "09:00",

                endTime:

                    employee.endTime || "18:00",

                breakMinutes:

                    Number(employee.breakMinutes || 60),

                allowLate: false,

                allowEarlyLeave: false,

                allowOvertime:

                    employee.workPolicy?.allowOvertime ??

                    employee.allowOvertime ??

                    true,

                allowNight:

                    employee.workPolicy?.allowNight ??

                    employee.allowNight ??

                    false,

                allowHoliday:

                    employee.workPolicy?.allowHoliday ??

                    employee.allowHoliday ??

                    true,

                allowWeeklyHoliday:

                    employee.workPolicy?.allowWeeklyHoliday ??

                    employee.allowWeeklyHoliday ??

                    true,

            },

        };

        saveEmployees([
            ...employees,
            newEmployee
        ]);

    };

    const updateEmployee = (employee) => {

    const payAmount =
        Math.round(
            Number(employee.payAmount) || 0
        );

    const payType =
        employee.payType ||
        employee.workPolicy?.payType ||
        "monthly";

    const updated = employees.map((item) =>

        item.no === employee.no
            ? {

                ...item,

                ...employee,

                payType,

                payAmount,

                workPolicy: {

                    ...item.workPolicy,

                    ...employee.workPolicy,

                    payType,

                    monthlySalary:
                        payType === "monthly"
                            ? payAmount
                            : 0,

                    hourlyWage:
                        payType === "hourly"
                            ? payAmount
                            : 0,

                },

            }

            : item

    );

    saveEmployees(updated);

};

    const deleteEmployee = (employeeNo) => {

        const updated = employees.filter(

            (item) => item.no !== employeeNo

        );

        saveEmployees(updated);

    };

    return {

        employees,

        addEmployee,

        updateEmployee,

        deleteEmployee,

    };

}