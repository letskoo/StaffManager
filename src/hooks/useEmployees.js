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
                    ...employee,
                    payAmount: Number(employee.payAmount)
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