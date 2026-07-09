import useEmployees from "../hooks/useEmployees";

import {
    getMonthlySalaryByMonth,
    getRetirement,
} from "../services/salaryService";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

import "../styles/dashboard.css";

function DashboardCharts() {

    const { employees } = useEmployees();

    const year = new Date().getFullYear();

    const chartData = Array.from({ length: 12 }, (_, index) => {

        const monthNumber = index + 1;

        const month = `${year}-${String(monthNumber).padStart(2, "0")}`;

        return {
            month: `${monthNumber}월`,
            salary: employees.reduce(
                (sum, employee) =>
                    sum + getMonthlySalaryByMonth(employee, month),
                0
            ),
            retirement: employees.reduce(
                (sum, employee) =>
                    sum + (getRetirement(employee) || 0),
                0
            ),
        };

    });

    return (

        <div className="detail-card">

            <h2>월별 급여 · 퇴직금</h2>

            <div className="salary-chart dashboard-chart">

                <ResponsiveContainer
                    width="100%"
                    height={300}
                >

                    <LineChart
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 20,
                            left: 20,
                            bottom: 20,
                        }}
                    >

                        <CartesianGrid
                            stroke="#f0f0f0"
                            strokeDasharray="4 4"
                        />

                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 13 }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
                            tickFormatter={(value) =>
                                value.toLocaleString()
                            }
                            tick={{ fontSize: 13 }}
                            axisLine={false}
                            tickLine={false}
                            width={80}
                        />

                        <Tooltip
                            formatter={(value) =>
                                `${Number(value).toLocaleString()}원`
                            }
                        />

                        <Line
                            type="monotone"
                            dataKey="salary"
                            name="급여"
                            stroke="#2563eb"
                            strokeWidth={4}
                            dot={{ r: 4 }}
                            activeDot={{ r: 7 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="retirement"
                            name="퇴직금"
                            stroke="#16a34a"
                            strokeWidth={4}
                            dot={{ r: 4 }}
                            activeDot={{ r: 7 }}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}

export default DashboardCharts;