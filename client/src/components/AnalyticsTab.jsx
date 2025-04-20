import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import axios from 'axios';

const AnalyticsTab = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch courses on mount
  useEffect(() => {
    axios.get('http://localhost:5000/courses')
      .then(res => setCourses(res.data))

      .catch(err => console.error("Failed to fetch courses", err));
  }, []);

  // Fetch assignments when course changes
  useEffect(() => {
    if (!selectedCourse) return;
    axios.get(`http://localhost:5000/assignments/${selectedCourse}`)
      .then(res => setAssignments(res.data))
      .catch(err => console.error("Failed to fetch assignments", err));
  }, [selectedCourse]);

  // Fetch analytics data
  const fetchAnalytics = async (selectedAssignment) => {
    setLoading(true);
    setAnalyticsData(null);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/class-analytics', { id: selectedAssignment });
      setAnalyticsData(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentChange = (e) => {
    const assignmentId = e.target.value;
    setSelectedAssignment(assignmentId);
    if (assignmentId) {
      fetchAnalytics(assignmentId);
    }
  };

  // Prepare data for charts
  const {
    avg_score,
    avg_time,
    question_distribution = {},
    score_distribution = [],
    time_distribution = [],
  } = analyticsData || {};

  const questionData = Object.entries(question_distribution).map(([q, count]) => ({
    questions_attempted: q,
    students: count,

  }));

  const createHistogramBins = (values, binSize = 10) => {
    if (!values.length) return [];
    const min = Math.floor(Math.min(...values) / binSize) * binSize;
    const max = Math.ceil(Math.max(...values) / binSize) * binSize;
    const bins = [];

    for (let start = min; start < max; start += binSize) {
      const end = start + binSize;
      bins.push({
        range: `${start}-${end}`,
        count: values.filter(val =>
          val >= start && (val < end || (val === max && end >= max))
        ).length
      });
    }

    return bins;
  };

  const scoreHistogram = createHistogramBins(score_distribution, 10);
  const timeHistogram = createHistogramBins(time_distribution, 10);

  return (
    <div className="space-y-8">
      {/* Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Select Course</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setSelectedAssignment('');
              setAnalyticsData(null);
            }}
          >
            <option value="">-- Choose a course --</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Select Assignment</label>
          <select
            value={selectedAssignment}
            onChange={handleAssignmentChange}
            className="border px-2 py-1 rounded"
          >
            <option value="">-- Select Assignment --</option>
            {assignments.map((assignment) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.id}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* Loading and Error */}
      {loading && <p className="text-center text-gray-500 py-4">Loading analytics...</p>}
      {error && <p className="text-center text-red-500 py-4">{error}</p>}
      {!loading && !analyticsData && selectedAssignment && !error && (
        <p className="text-center text-gray-500 py-4">No data available for this assignment.</p>
      )}

      {/* Charts */}
      {analyticsData && !loading && (
        <>
          <div className="text-center text-lg font-semibold">
            <p>Average Score: <span className="text-blue-600">{avg_score}</span></p>
            <p>Average Time: <span className="text-green-600">{avg_time}</span> seconds</p>
          </div>

          {/* Question Distribution */}
          <div className="w-full h-[300px]">
            <h3 className="text-center mb-2 font-medium">Question Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={questionData} margin={{ bottom: 30 }}>
                <XAxis dataKey="questions_attempted" label={{ value: 'Questions Attempted', position: 'insideBottom', offset: -12, dx: -30 }} />
                <YAxis
                  label={{
                    value: 'Number of Students',
                    angle: -90,
                    position: 'insideLeft',
                    dy: 50 // <-- moves the label down
                  }}
                />
                <Tooltip />
                <Bar dataKey="students" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Score Histogram */}
          <div className="w-full h-[300px] mt-10">
            <h3 className="text-center font-semibold mt-6">Score Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreHistogram} margin={{ bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" label={{ value: 'Score Range', position: 'insideBottom', offset: -12 }} />
                <YAxis label={{ value: 'Student Count', angle: -90, position: 'insideLeft', dy: 30 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Time Histogram */}
          <div className="w-full h-[300px]">
            <h3 className="text-center font-medium mb-2">Time Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeHistogram} margin={{ bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range"  label={{ value: 'Time Range (s)', position: 'insideBottom', offset: -12 }}/>
                <YAxis  label={{ value: 'Student Count', angle: -90, position: 'insideLeft', dy: 30 }}/>
                <Tooltip />
                <Bar dataKey="count" fill="#8684c9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsTab;
