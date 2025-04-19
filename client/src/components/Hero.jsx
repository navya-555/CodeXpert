import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, BookOpen, GraduationCap, Code, ChevronRight } from 'lucide-react';

import Footer from './Footer';

const Hero = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [animateCode, setAnimateCode] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Start code animation after hero elements are visible
    const timer = setTimeout(() => setAnimateCode(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleStudentLogin = () => {
    navigate('/student-dashboard');
  };

  const handleTeacherLogin = () => {
    navigate('/teacher-dashboard');
  };

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 min-h-screen overflow-hidden">
      {/* Enhanced decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-400 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute top-40 right-20 w-40 h-40 bg-purple-300 rounded-full opacity-10 blur-2xl "></div>
      

      <div className="absolute bottom-40 right-40 opacity-20 animate-bounce duration-3000 delay-1000 hidden md:block">
        <div className="w-6 h-6 border-2 border-indigo-500 rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 pt-12 pb-16 relative z-10">
        {/* Top section with text and computer side by side */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-24">
          {/* Left side - Main text content */}
          <div className={`w-full md:w-1/2 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} flex flex-col items-center md:items-start text-center md:text-left mb-12 md:mb-0`}>
            <div className="mb-4 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-full">
              <Sparkles size={18} className="mr-2" />
              <span className="font-medium">AI-Powered Learning Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="text-gray-800">Effortless </span>
              <span className="text-blue-600">Learning</span>
              <br />
              <span className="text-gray-800">That Makes your Life </span>
              <span className="text-blue-600">Easier</span>
            </h1>
            
            <p className="text-xl text-gray-500 max-w-2xl mb-8 leading-relaxed">
              Schedule learning sessions with a single click. Go from struggling with concepts to mastering them with ease using CodeXpert, your favorite AI-powered learning companion.
            </p>
            
            <div className="w-full flex justify-center md:justify-start">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                onClick={() => navigate('/get-started')}
              >
                Get Started
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          </div>
          
          {/* Right side - Computer/AI visual */}
          <div className={`w-full md:w-2/5 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative mx-auto" style={{ maxWidth: "450px" }}>
              {/* Laptop base */}
              <div className="relative z-10">
                {/* Screen */}
                <div className="bg-gray-800 rounded-t-xl overflow-hidden border-8 border-gray-700 shadow-lg">
                  {/* Screen content */}
                  <div className="relative aspect-video bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 overflow-hidden">
                    {/* AI visualization */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-white shadow-lg animate-pulse flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                          <Code size={32} className="text-white" />
                        </div>
                      </div>
                      
                      {/* Orbiting elements */}
                      <div className="absolute w-full h-full animate-spin" style={{ animationDuration: '10s' }}>
                        <div className="absolute top-10 left-1/2 w-6 h-6 rounded-full bg-blue-500 opacity-70"></div>
                      </div>
                      <div className="absolute w-full h-full animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }}>
                        <div className="absolute top-5 left-1/3 w-4 h-4 rounded-full bg-purple-500 opacity-70"></div>
                      </div>
                      <div className="absolute w-full h-full animate-spin" style={{ animationDuration: '8s' }}>
                        <div className="absolute top-12 right-1/4 w-5 h-5 rounded-full bg-indigo-400 opacity-70"></div>
                      </div>
                    </div>
                    
                    {/* CodeXpert text */}
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <p className="text-white font-medium text-lg">CodeXpert</p>
                      <p className="text-blue-100 text-sm">Your learning companion</p>
                    </div>
                  </div>
                </div>
                
                {/* Laptop base/keyboard */}
                <div className="bg-gray-700 h-4 rounded-b-lg"></div>
                <div className="bg-gray-800 h-1 rounded-b-xl mx-10"></div>
              </div>
              
              {/* Reflection/shadow effect */}
              <div className="absolute -bottom-8 left-0 right-0 h-8 bg-gradient-to-b from-black to-transparent opacity-20 blur-md rounded-full mx-10"></div>
              
              {/* Floating elements around the laptop */}
              {/* <div className="absolute -top-10 -right-8 w-14 h-14 rounded-lg bg-blue-100 border border-blue-200 shadow-lg flex items-center justify-center transform rotate-12 animate-bounce" style={{ animationDuration: '2s' }}>
                <BookOpen size={22} className="text-blue-500" />
              </div>
              <div className="absolute -bottom-10 -left-10 w-14 h-14 rounded-lg bg-indigo-100 border border-indigo-200 shadow-lg flex items-center justify-center transform -rotate-6 animate-bounce" style={{ animationDuration: '2s' }}>
                <GraduationCap size={24} className="text-indigo-500" />
              </div> */}
            </div>
          </div>
        </div>
        
        {/* Bottom section with code on left and text on right */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-24">
          {/* Left side - Code animation */}
          <div className={`w-full md:w-1/2 mb-12 md:mb-0 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="mx-auto md:ml-0 md:mr-8" style={{ maxWidth: "500px" }}>
              <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center px-4 py-2 bg-gray-800">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 text-xs text-gray-400">learning_session.py</div>
                </div>
                <div className="p-4 font-mono text-sm">
                  <div className={`text-green-400 transition-opacity duration-500 ${animateCode ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-blue-400">import</span> CodeXpert
                  </div>
                  <div className={`text-white transition-opacity duration-500 delay-200 ${animateCode ? 'opacity-100' : 'opacity-0'}`}>
                    <br/>
                    <span className="text-purple-400">def</span> <span className="text-yellow-300">start_learning_session</span>():
                  </div>
                  <div className={`pl-4 text-white transition-opacity duration-500 delay-300 ${animateCode ? 'opacity-100' : 'opacity-0'}`}>
                    session = CodeXpert.<span className="text-yellow-300">create_session</span>(<span className="text-green-300">"physics"</span>)
                  </div>
                  <div className={`pl-4 text-white transition-opacity duration-500 delay-500 ${animateCode ? 'opacity-100' : 'opacity-0'}`}>
                    knowledge = session.<span className="text-yellow-300">analyze_student_needs</span>()
                  </div>
                  <div className={`pl-4 text-white transition-opacity duration-500 delay-700 ${animateCode ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-purple-400">return</span> session.<span className="text-yellow-300">generate_personalized_plan</span>(knowledge)
                  </div>
                  <div className={`text-white transition-opacity duration-500 delay-1000 ${animateCode ? 'opacity-100' : 'opacity-0'}`}>
                    <br/>
                    <span className="text-green-400"># CodeXpert is ready to help you master any subject</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Feature text */}
          <div className={`w-full md:w-1/2 transition-all duration-1000 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center md:text-left md:ml-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Personalized Learning</span> for Everyone
              </h2>
              <p className="text-lg text-gray-400 mb-6">
                Our AI-powered platform adapts to your unique learning style and pace. Whether you're preparing for exams, learning new skills, or exploring complex topics, CodeXpert provides customized guidance every step of the way.
              </p>
              
            </div>
          </div>
        </div>
        
        {/* Login options section */}
        <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} flex flex-col md:flex-row gap-8 w-full max-w-4xl mx-auto`}>
          <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-blue-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl inline-block mb-4">
              <BookOpen size={24} />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">For Students</h3>
            <p className="text-gray-600 mb-6">Access personalized learning materials and get instant help with your studies anytime, anywhere.</p>
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl py-5 font-medium"
              onClick={handleStudentLogin}
            >
              Student Login <ChevronRight size={18} className="ml-1" />
            </Button>
          </div>
          
          <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-blue-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl inline-block mb-4">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">For Teachers</h3>
            <p className="text-gray-600 mb-6">Create and manage courses, track student progress and provide feedback with AI assistance.</p>
            <Button 
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl py-5 font-medium"
              onClick={handleTeacherLogin}
            >
              Teacher Login <ChevronRight size={18} className="ml-1" />
            </Button>
          </div>
        </div>

    
        <Footer/>
      </div>
    </div>
  );
};

export default Hero;