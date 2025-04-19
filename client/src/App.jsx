import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AppLayout from './layout/AppLayout';
import Hero from './components/Hero';
import StudentLogin from './components/StudentLogin';
import TeacherLogin from './components/TeacherLogin';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
// import Playground from './components/Playground';

// Protected route component
const ProtectedRoute = ({ children, userType }) => {
  const authToken = localStorage.getItem('authToken');
  const storedUserType = localStorage.getItem('userType');
  
  if (!authToken || storedUserType !== userType) {
    // Redirect to the appropriate login page
    return <Navigate to={userType === 'student' ? '/student-login' : '/teacher-login'} />;
  }
  
  return children;
};

function App() {
  // This is used to check if the auth token is still valid on app load
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const verifyToken = async () => {
      const authToken = localStorage.getItem('authToken');
      
      if (authToken) {
        try {
          // Verify token with backend
          const response = await fetch('http://localhost:5000/api/auth/verify-token', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });
          
          if (!response.ok) {
            // Clear invalid token
            localStorage.removeItem('authToken');
            localStorage.removeItem('userType');
          }
        } catch (error) {
          console.error('Token verification error:', error);
          // Clear token on error
          localStorage.removeItem('authToken');
          localStorage.removeItem('userType');
        }
      }
      
      setIsLoading(false);
    };
    
    verifyToken();
  }, []);
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout><Hero /></AppLayout>} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route 
          path="/student-dashboard" 
          element={
            <ProtectedRoute userType="student">
              <AppLayout><StudentDashboard /></AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher-dashboard" 
          element={
            <ProtectedRoute userType="teacher">
              <AppLayout><TeacherDashboard /></AppLayout>
            </ProtectedRoute>
          } 
        />
        {/* <Route path="/playground" element={<Playground />} /> */}
        <Route path="/get-started" element={<Navigate to="/student-login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;