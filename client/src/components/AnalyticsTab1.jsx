import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    PieChart,
    Pie,
    Cell,
} from "recharts";

const AnalyticsTab1 = () => {
    const [studentList, setStudentList] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [noData, setNoData] = useState(false);

    const assignmentId = "abcd2"; // replace with actual ID or props

    // Fetch student names on mount
    useEffect(() => {
        const fetchStudentNames = async () => {
            try {
                const res = await axios.get("http://localhost:5000/student-names");
                setStudentList(res.data);
            } catch (err) {
                console.error("Error fetching student names:", err);
            }
        };
        fetchStudentNames();
    }, []);

    // Fetch analytics data for selected student
    const fetchStudentData = async (name) => {
        setLoading(true);
        setNoData(false); // reset no data flag when fetching data
        try {
            const res = await axios.post("http://localhost:5000/student-analytics", {
                name,
                id: assignmentId,
            });
            console.log(res.data)
            // Check if data is available
            if (res.data && Object.keys(res.data).length === 0) {
                setNoData(true); // set no data flag if response is empty
                setData(null);
            } else {
                setData(res.data);
            }
        } catch (err) {
            console.error("Error fetching student analytics:", err);
            setData(null);
            setNoData(true); // set no data flag if error occurs
        } finally {
            setLoading(false);
        }
    };

    const handleStudentChange = (e) => {
        const selected = e.target.value;
        setSelectedStudent(selected);
        if (selected) fetchStudentData(selected);
    };

    // Destructure data safely
    const {
        question_parent_time = {},
        question_followup_time = {},
        question_parent_att = {},
        question_followup_att = {},
    } = data || {};

    // Process time data (Ensure data is available before mapping)
    const timeData = Object.keys(question_parent_time).map((q) => ({
        question: q,
        Parent: question_parent_time[q],
        Followup: question_followup_time[q],
    }));

    // Process attempt data (Ensure data is available before mapping)
    const attemptData = Object.keys(question_parent_att).map((q) => ({
        question: q,
        Parent: question_parent_att[q],
        Followup: question_followup_att[q],
    }));

    return (
        <div className="space-y-8">
            {/* Dropdown */}
            <div className="flex items-center justify-center gap-3 mb-4">
                <label className="text-sm font-medium" htmlFor="student-select">
                    Select Student:
                </label>
                <select
                    id="student-select"
                    value={selectedStudent}
                    onChange={handleStudentChange}
                    className="border px-2 py-1 rounded"
                >
                    <option value="">-- Choose a student --</option>
                    {studentList.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Display "No data available" message */}
            {selectedStudent && noData && (
                <p className="text-center text-gray-500 mt-6">No data available for this student.</p>
            )}

            {/* Loading */}
            {loading && <p className="text-center text-gray-500">Loading analytics...</p>}

            {/* Charts */}
            {!loading && data && !noData && (
                <>
                    {/* Time Chart */}
                    <div className="w-full h-[300px]">
                        <h3 className="text-center font-semibold mb-2">Time Spent per Question (s)</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={timeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="question" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Parent" fill="#4f46e5" />
                                <Bar dataKey="Followup" fill="#60a5fa" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Attempt Chart */}
                    <div className="w-full h-[300px]">
                        <h3 className="text-center font-semibold mb-2">Attempts per Question</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attemptData} margin={{ bottom: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="question" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Parent" fill="#10b981" />
                                <Bar dataKey="Followup" fill="#fbbf24" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {data.get_error && Object.keys(data.get_error).length > 0 && (
                        <div className="w-full h-[300px] mt-6">
                            <h3 className="text-center font-semibold mb-2">Error Distribution</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={Object.entries(data.get_error).map(([error, count]) => ({
                                            name: error,
                                            value: count,
                                        }))}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label
                                    >
                                        {Object.entries(data.get_error).map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={["#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"][index % 7]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}


                </>
            )}
        </div>
    );
};

export default AnalyticsTab1;
