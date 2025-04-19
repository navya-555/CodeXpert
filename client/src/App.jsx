import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import Hero from './components/Hero';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout><Hero /></AppLayout>} />
        <Route path="/student-dashboard" element={<AppLayout><StudentDashboard /></AppLayout>} />
        <Route path="/teacher-dashboard" element={<AppLayout><TeacherDashboard /></AppLayout>} />
      </Routes>
    </Router>
  );
}

export default App;