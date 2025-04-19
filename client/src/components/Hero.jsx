import { useState } from 'react';
import { Button } from './ui/button';
import Navbar from './Navbar';

// Dashboard Component
const Dashboard = ({ userType }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">{userType} Dashboard</h1>
      <p className="text-gray-600">Welcome to your {userType.toLowerCase()} dashboard!</p>
    </div>
  );
};

const Hero = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [userType, setUserType] = useState('');

  const handleLogin = (type) => {
    setUserType(type);
    setShowDashboard(true);
  };

  return (
    <>
      {showDashboard ? (
        <Dashboard userType={userType} />
      ) : (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
          <Navbar />
          <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Transform Learning with <span className="text-blue-600">AI-Powered</span> Tutoring
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mb-12">
              AiTutor provides personalized learning experiences with advanced AI technology.
              Whether you're a student seeking help or a teacher managing courses, we've got you covered.
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-lg">
              <div className="flex-1 bg-white rounded-lg shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">For Students</h3>
                <p className="text-gray-600 mb-6">Access personalized learning materials and get help with your studies</p>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleLogin('Student')}
                >
                  Student Login
                </Button>
              </div>
              
              <div className="flex-1 bg-white rounded-lg shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">For Teachers</h3>
                <p className="text-gray-600 mb-6">Create and manage courses, track student progress. </p>
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => handleLogin('Teacher')}
                >
                  Teacher Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;