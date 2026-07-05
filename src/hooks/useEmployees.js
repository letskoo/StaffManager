import { useState, useEffect } from "react";

export default function useEmployees() {

    const [employees, setEmployees] = useState([]);

    useEffect(() => {

        const saved =
            JSON.parse(localStorage.getItem("employees")) || [];

        setEmployees(saved);

    }, []);

    const saveEmployees = (list) => {

        setEmployees(list);

        localStorage.setItem(
            "employees",
            JSON.stringify(list)
        );

    };

    const addEmployee = (employee) => {

        const employeeNo =
            employee.phone.replace(/\D/g, "").slice(-4);

        const newEmployee = {

            ...employee,

            no: employeeNo,

            payAmount: Number(employee.payAmount),

            salary: "0원",

            retirement: "0원",

            status: "재직",

            workPolicy: {

                payType: employee.payType || "monthly",

                monthlySalary:

                    employee.payType === "monthly"

                        ? Number(employee.payAmount)

                        : 0,

                hourlyWage:

                    employee.payType === "hourly"

                        ? Number(employee.payAmount)

                        : 0,

                startTime:

                    employee.startTime || "09:00",

                endTime:

                    employee.endTime || "18:00",

                breakMinutes:

                    Number(employee.breakMinutes || 60),

                allowLate: false,

                allowEarlyLeave: false,

                allowOvertime: true,

                allowNight: false,

                allowHoliday: false,

            },

        };

        saveEmployees([
            ...employees,
            newEmployee
        ]);

    };

    const updateEmployee = (employee) => {

        const updated = employees.map((item) =>

            item.no === employee.no
                ? {

                    ...item,

                    ...employee,

                    payAmount: Number(employee.payAmount),

                    workPolicy: {

                        ...item.workPolicy,

                        ...employee.workPolicy,

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