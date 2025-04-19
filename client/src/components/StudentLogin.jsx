import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from './ui/button';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';


const StudentLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError('');
    try {
      console.log("Received credential response:", credentialResponse);
      
      // Send the token to your Flask backend
      const response = await fetch('http://localhost:5000/api/auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id_token: credentialResponse.credential,
          user_type: 'student'
        }),
      });

      console.log("Response status:", response.status);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Google login failed');
      }

      // Save the authentication token to localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userType', 'student');
      
      // Navigate to the student dashboard
      navigate('/student-dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login. Please ensure the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/email-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          user_type: 'student'
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userType', 'student');
      navigate('/student-dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 min-h-screen flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-400 rounded-full opacity-10 blur-3xl"></div>
      
      <div className={`w-full max-w-md transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-blue-100">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700 flex items-center text-sm font-medium"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Home
            </button>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Student Login</h1>
            <p className="text-gray-500">Access your personalized learning dashboard</p>
          </div>
          
          <div className="mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.error("Google login failed");
                setError('Google login failed. Please try again.');
              }}
              size="large"
              width="100%"
              text="signin_with"
              shape="rectangular"
              logo_alignment="center"
            />
          </div>
          
          <div className="relative flex items-center justify-center mb-6">
            <hr className="w-full border-gray-300" />
            <span className="absolute bg-white px-3 text-sm text-gray-500">or</span>
          </div>
          
          <form onSubmit={handleEmailLogin}>
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800">Forgot password?</a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg"
                />
              </div>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Sign in with Email
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Create account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;