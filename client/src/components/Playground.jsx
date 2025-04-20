import { useState, useEffect, useRef } from 'react';
import { Check, Play, Code, ChevronDown, RefreshCw, Copy, Clock, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import Editor from "@monaco-editor/react";
import { PROGRAMMING_LANGUAGES, UI_CONFIG } from './../constants';
import { useSearchParams } from 'react-router-dom';

const Playground = () => {
  // State for code input, selected question, and running status
  const [code, setCode] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('python'); // Default to python based on your API response
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [input, setInput] = useState(''); // For custom input
  const [result, setResult] = useState(''); // To store output or error from execution
  const [activeTab, setActiveTab] = useState('code'); // Track which tab is active: 'code' or 'output'
  const [questions, setQuestions] = useState([]); // Store fetched questions
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const assignmentId = searchParams.get('assignmentId');
  const [followupQuestion, setFollowupQuestion] = useState(null);
  const [showFollowup, setShowFollowup] = useState(false);
  
  // New state variables for tracking metrics
  const [codeRuns, setCodeRuns] = useState({}); // Track number of code runs per question
  const [questionTimers, setQuestionTimers] = useState({}); // Track time spent per question
  const [errorsEncountered, setErrorsEncountered] = useState({}); // Track errors encountered per question
  const [activeTime, setActiveTime] = useState(0); // Active time for current question in seconds
  const [mainQuestionApproved, setMainQuestionApproved] = useState({}); // Track if main question is approved
  const [followupQuestionApproved, setFollowupQuestionApproved] = useState({}); // Track if follow-up question is approved
  
  // Timer refs
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Fetch questions from the API
  useEffect(() => {
    const fetchQuestions = async (retryCount = 0) => {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
  
      try {
        const response = await fetch('http://localhost:5000/api/get-parent-question', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: assignmentId })
        });
  
        if (response.status === 123 && retryCount < 3) {
          const delay = (retryCount + 1) * 1000;
          console.warn(`Retrying... attempt ${retryCount + 1} in ${delay / 1000}s`);
          setTimeout(() => fetchQuestions(retryCount + 1), delay);
          return;
        }
  
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
  
        const data = await response.json();
        setQuestions(data.questions);
        setCompletedQuestions(Array(data.questions.length).fill(false));
        
        // Initialize metrics for each question
        const initialCodeRuns = {};
        const initialTimers = {};
        const initialErrors = {};
        const initialMainQuestionApproved = {};
        const initialFollowupQuestionApproved = {};
        
        data.questions.forEach((_, idx) => {
          initialCodeRuns[idx] = 0;
          initialTimers[idx] = 0;
          initialErrors[idx] = [];
          initialMainQuestionApproved[idx] = false;
          initialFollowupQuestionApproved[idx] = false;
        });
        
        setCodeRuns(initialCodeRuns);
        setQuestionTimers(initialTimers);
        setErrorsEncountered(initialErrors);
        setMainQuestionApproved(initialMainQuestionApproved);
        setFollowupQuestionApproved(initialFollowupQuestionApproved);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };
  
    if (assignmentId) {
      fetchQuestions();
    }
  }, [assignmentId]);

  // Fetch follow-up question when a question is completed
  const fetchFollowupQuestion = async (parentQuestion) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/get-followup-question', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parent_question: parentQuestion,
          code: code
        })
      });

      if (!response.ok) {
        if (response.status === 123) {
          console.warn("Follow-up question generation in progress, try again later");
          return null;
        }
        throw new Error('Failed to fetch follow-up question');
      }

      const data = await response.json();
      return data.followup_question;
    } catch (err) {
      console.error('Error fetching follow-up question:', err);
      return null;
    }
  };

  // Set initial code when question or language changes
  useEffect(() => {
    if (questions.length > 0) {
      // Since we don't have starter code in the API response, we'll provide a simple template
      const getStarterCode = () => {
        switch (selectedLanguage) {
          case 'python':
            return `# ${questions[currentQuestion].title}\n# ${questions[currentQuestion].problem_statement}\n\n# Write your code below\n\n`;
          case 'javascript':
            return `// ${questions[currentQuestion].title}\n// ${questions[currentQuestion].problem_statement}\n\n// Write your code below\n\n`;
          case 'java':
            return `// ${questions[currentQuestion].title}\n// ${questions[currentQuestion].problem_statement}\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}`;
          default:
            return `# ${questions[currentQuestion].title}\n# ${questions[currentQuestion].problem_statement}\n\n# Write your code below\n\n`;
        }
      };
      
      setCode(getStarterCode());
      setInput(questions[currentQuestion].sample_input || ''); // Set default input from question
      setResult(''); // Reset the result when switching questions
      setFollowupQuestion(null); // Reset follow-up question when switching questions
      setShowFollowup(false); // Hide follow-up panel when switching questions
      
      // Start timer for the new question
      startTimer();
    }
  }, [currentQuestion, selectedLanguage, questions]);

  // Start timer for current question
  const startTimer = () => {
    // First, save current question time
    if (startTimeRef.current && currentQuestion >= 0) {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setQuestionTimers(prev => ({
        ...prev,
        [currentQuestion]: (prev[currentQuestion] || 0) + timeSpent
      }));
    }
    
    // Stop existing timer if any
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Set up new timer
    startTimeRef.current = Date.now();
    setActiveTime(questionTimers[currentQuestion] || 0);
    
    timerRef.current = setInterval(() => {
      const timeElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setActiveTime((questionTimers[currentQuestion] || 0) + timeElapsed);
    }, 1000);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Save timer state when switching questions or when component unmounts
  useEffect(() => {
    return () => {
      if (startTimeRef.current && currentQuestion >= 0) {
        const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setQuestionTimers(prev => ({
          ...prev,
          [currentQuestion]: (prev[currentQuestion] || 0) + timeSpent
        }));
      }
    };
  }, [currentQuestion]);

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle question selection
  const handleQuestionSelect = (index) => {
    // Save time for current question before switching
    if (startTimeRef.current && currentQuestion >= 0) {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setQuestionTimers(prev => ({
        ...prev,
        [currentQuestion]: (prev[currentQuestion] || 0) + timeSpent
      }));
    }
    
    setCurrentQuestion(index);
    // Timer will be restarted in the useEffect that responds to currentQuestion changes
  };

  // Handle language selection
  const selectLanguage = (langId) => {
    setSelectedLanguage(langId);
    setShowLanguageDropdown(false);
  };

  // Handle code input and update line numbers
  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  // Toggle follow-up question display
  const toggleFollowup = () => {
    setShowFollowup(!showFollowup);
  };

  // Handle running the code
  const handleRunCode = async () => {
    setIsRunning(true);
    setResult(''); // Clear previous result before running new code
    
    // Increment code run counter
    setCodeRuns(prev => ({
      ...prev,
      [currentQuestion]: (prev[currentQuestion] || 0) + 1
    }));
    
    // Determine which question to use based on the toggle state
    const currentQuestionObj = showFollowup && followupQuestion 
      ? followupQuestion 
      : questions[currentQuestion];
  
    try {
      const response = await fetch('http://localhost:5000/run_code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          input,
          question: currentQuestionObj
        }),
      });
  
      const resultData = await response.json();
      const { stdout, stderr, approved, reason } = resultData;
  
      let resultMessage = '';
  
      // Include stdout if any
      if (stdout) {
        resultMessage += `Output:\n${stdout}`;
      }
  
      // Include stderr if any
      if (stderr) {
        resultMessage += `\n\nError:\n${stderr}`;
        
        // Track error
        if (stderr) {
          setErrorsEncountered(prev => ({
            ...prev,
            [currentQuestion]: [...(prev[currentQuestion] || []), {
              timestamp: new Date().toISOString(),
              error: stderr
            }]
          }));
        }
      }
  
      // Handle approval status from backend
      if (approved === 1) {
        resultMessage += `\n\n✅ Your solution was approved. Great job!`;
        
        if (!showFollowup) {
          // Main question solved
          setMainQuestionApproved(prev => ({
            ...prev,
            [currentQuestion]: true
          }));
          
          // Fetch follow-up question when solution is approved
          const followup = await fetchFollowupQuestion(questions[currentQuestion]);
          if (followup) {
            setFollowupQuestion(followup);
            resultMessage += `\n\n🎯 A follow-up question is available! Toggle it in the top bar.`;
          }
        } else {
          // Follow-up question solved
          setFollowupQuestionApproved(prev => ({
            ...prev,
            [currentQuestion]: true
          }));
          
          resultMessage += `\n\n🏆 You've successfully completed the follow-up challenge!`;
          
          // Mark as fully completed only when both main and follow-up are approved
          if (mainQuestionApproved[currentQuestion]) {
            const newCompleted = [...completedQuestions];
            newCompleted[currentQuestion] = true;
            setCompletedQuestions(newCompleted);
          }
        }
      } else if (approved === 0) {
        resultMessage += `\n\n🛑 Your solution was not approved.`;
        if (reason) {
          resultMessage += `\n📝 Reason: ${reason}`;
        }
      } else if (approved === null || typeof approved === 'undefined') {
        resultMessage += `\n\n⚠️ Could not determine approval status. Please check your output or try again.`;
      }
  
      setResult(resultMessage || 'Execution finished without output');
      setActiveTab('output');
  
    } catch (error) {
      console.error('Error running code:', error);
      setResult('Error running code: ' + error.message);
      
      // Track error
      setErrorsEncountered(prev => ({
        ...prev,
        [currentQuestion]: [...(prev[currentQuestion] || []), {
          timestamp: new Date().toISOString(),
          error: error.message
        }]
      }));
    }
  
    setIsRunning(false);
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <RefreshCw size={32} className="animate-spin text-blue-600 mb-4" />
        <p className="text-gray-700">Loading coding challenges...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <Button 
          onClick={() => window.location.reload()} 
          className={UI_CONFIG.BUTTON_STYLES.primary}
        >
          <RefreshCw size={16} className="mr-2" /> Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Top toolbar with question progress and tab toggle */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-blue-100 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="font-medium text-gray-700 flex items-center">
            <Code size={18} className="mr-2 text-blue-600" />
            <span>Coding Challenge</span>
          </div>
          <div className="flex items-center space-x-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => handleQuestionSelect(index)}
                className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all ${
                  currentQuestion === index
                    ? 'bg-blue-600 text-white border-blue-600'
                    : completedQuestions[index]
                      ? 'bg-green-100 text-green-600 border-green-200'
                      : mainQuestionApproved[index] && !followupQuestionApproved[index]
                        ? 'bg-yellow-100 text-yellow-600 border-yellow-200'
                        : 'bg-white text-gray-400 border-gray-200'
                }`}
              >
                {completedQuestions[index] ? (
                  <Check size={16} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
            ))}
          </div>
          
          {/* Timer display */}
          <div className="ml-4 text-sm font-medium flex items-center text-gray-700">
            <Clock size={16} className="mr-1.5 text-blue-600" />
            <span>{formatTime(activeTime)}</span>
          </div>
          
          {/* Code runs counter */}
          <div className="text-sm font-medium flex items-center text-gray-700">
            <Play size={16} className="mr-1.5 text-blue-600" />
            <span>Runs: {codeRuns[currentQuestion] || 0}</span>
          </div>
          
          {/* Error counter */}
          <div className="text-sm font-medium flex items-center text-gray-700">
            <AlertCircle size={16} className="mr-1.5 text-red-500" />
            <span>Errors: {errorsEncountered[currentQuestion]?.length || 0}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Follow-up question toggle - only visible when a follow-up is available */}
          {followupQuestion && mainQuestionApproved[currentQuestion] && (
            <Button
              onClick={toggleFollowup}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                showFollowup 
                  ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                  : 'bg-blue-50 text-blue-700 border border-blue-100'
              }`}
            >
              {showFollowup ? 'Hide Follow-up' : 'Show Follow-up'} 
            </Button>
          )}

          {/* Code/Output toggle */}
          <div className="bg-gray-100 rounded-lg p-0.5 flex">
            <Button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'code' 
                  ? 'bg-white text-blue-700 shadow-sm' 
                  : 'bg-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Code
            </Button>
            <Button
              onClick={() => setActiveTab('output')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'output' 
                  ? 'bg-white text-blue-700 shadow-sm' 
                  : 'bg-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Output
            </Button>
          </div>

          {/* Language selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <span className="mr-2">{PROGRAMMING_LANGUAGES.find(l => l.id === selectedLanguage)?.name}</span>
              <ChevronDown size={14} />
            </button>

            {showLanguageDropdown && (
              <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {PROGRAMMING_LANGUAGES.map(lang => (
                  <button
                    key={lang.id}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center"
                    onClick={() => selectLanguage(lang.id)}
                  >
                    {selectedLanguage === lang.id && (
                      <Check size={14} className="mr-2 text-blue-600" />
                    )}
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleRunCode}
            disabled={isRunning}
            className={`${UI_CONFIG.BUTTON_STYLES.primary} px-4`}
          >
            {isRunning ? (
              <RefreshCw size={16} className="mr-1.5 animate-spin" />
            ) : (
              <Play size={16} className="mr-1.5" />
            )}
            Run
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left side - Question description */}
        <div className="w-full md:w-2/5 lg:w-1/3 bg-white border-r border-blue-100 overflow-y-auto p-5">
          {questions.length > 0 && currentQuestion < questions.length && (
            <>
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">
                    {questions[currentQuestion].title}
                  </h2>
                  
                  {/* Question status indicators */}
                  <div className="flex items-center">
                    {mainQuestionApproved[currentQuestion] && !followupQuestionApproved[currentQuestion] && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                        Main Solved
                      </span>
                    )}
                    {completedQuestions[currentQuestion] && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Fully Complete
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Progress summary */}
                <div className="mt-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div>Time: {formatTime(activeTime)}</div>
                    <div>Runs: {codeRuns[currentQuestion] || 0}</div>
                    <div>Errors: {errorsEncountered[currentQuestion]?.length || 0}</div>
                  </div>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-gray-600">
                {/* Show the follow-up question if available and toggled on */}
                {followupQuestion && showFollowup? (
                  <>
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg mb-4">
                      <h3 className="text-orange-700 font-semibold">Follow-up Challenge</h3>
                      <h4 className="text-gray-800 font-medium mt-2">{followupQuestion.title}</h4>
                      <p className="whitespace-pre-line mt-2">{followupQuestion.problem_statement}</p>
                      
                      <div className="mt-4">
                        <h4 className="text-gray-700 font-semibold">Input Format</h4>
                        <p className="whitespace-pre-line">{followupQuestion.input_format}</p>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-gray-700 font-semibold">Output Format</h4>
                        <p className="whitespace-pre-line">{followupQuestion.output_format}</p>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-gray-700 font-semibold">Sample Input</h4>
                        <pre className="bg-gray-100 p-2 rounded-md text-sm overflow-x-auto">
                          {followupQuestion.sample_input}
                        </pre>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-gray-700 font-semibold">Sample Output</h4>
                        <pre className="bg-gray-100 p-2 rounded-md text-sm overflow-x-auto">
                          {followupQuestion.sample_output}
                        </pre>
                      </div>
                      
                      {followupQuestionApproved[currentQuestion] && (
                        <div className="mt-4 bg-green-50 p-2 rounded-md border border-green-200">
                          <p className="text-green-700 font-medium">Follow-up challenge completed! ✅</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-gray-700 font-semibold mt-2">Description</h3>
                    <p className="whitespace-pre-line">{questions[currentQuestion].problem_statement}</p>
                    
                    <div className="mt-4">
                      <h3 className="text-gray-700 font-semibold">Input Format</h3>
                      <p className="whitespace-pre-line">{questions[currentQuestion].input_format}</p>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-gray-700 font-semibold">Output Format</h3>
                      <p className="whitespace-pre-line">{questions[currentQuestion].output_format}</p>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-gray-700 font-semibold">Sample Input</h3>
                      <pre className="bg-gray-100 p-2 rounded-md text-sm overflow-x-auto">
                        {questions[currentQuestion].sample_input}
                      </pre>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-gray-700 font-semibold">Sample Output</h3>
                      <pre className="bg-gray-100 p-2 rounded-md text-sm overflow-x-auto">
                        {questions[currentQuestion].sample_output}
                      </pre>
                    </div>
                    
                    {mainQuestionApproved[currentQuestion] && (
                      <div className="mt-4 bg-yellow-50 p-2 rounded-md border border-yellow-200">
                        <p className="text-yellow-700 font-medium">
                          Main question solved! Complete the follow-up challenge to fully finish this task.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {/* Input Section */}
          <div className="mt-6">
            <h3 className="text-gray-700 font-semibold flex items-center">
              Custom Input:
            </h3>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your input here"
              className="w-full mt-2 p-3 border border-gray-200 rounded-md text-sm font-mono resize-y min-h-[100px] focus:border-blue-300 focus:ring focus:ring-blue-100 focus:outline-none"
            />
          </div>
          
          {/* Error log section */}
          {errorsEncountered[currentQuestion]?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-gray-700 font-semibold flex items-center">
                <AlertCircle size={16} className="mr-1.5 text-red-500" />
                Error History:
              </h3>
              <div className="mt-2 max-h-40 overflow-y-auto bg-gray-50 rounded-md">
                {errorsEncountered[currentQuestion].map((err, idx) => (
                  <div key={idx} className="p-2 text-xs border-b border-gray-200 last:border-0">
                    <div className="text-gray-500">{new Date(err.timestamp).toLocaleTimeString()}</div>
                    <div className="font-mono text-red-600 whitespace-pre-wrap">{err.error}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right side - Code editor or output based on active tab */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'code' ? (
            <div className="h-full bg-gray-900">
              <Editor
                height="100%"
                language={selectedLanguage}
                value={code}
                onChange={handleCodeChange}
                theme="vs-dark"
                options={{
                  fontSize: UI_CONFIG.EDITOR.fontSize,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  automaticLayout: true,
                  autoIndent: "advanced",
                  formatOnType: true,
                  formatOnPaste: true,
                }}
              />
            </div>
          ) : (
            <div className="h-full bg-gray-900 p-5 text-white overflow-y-auto">
              <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                <h3 className="text-lg font-semibold mb-3 text-blue-300">Execution Output</h3>
                {result ? (
                  <pre className="font-mono text-sm whitespace-pre-wrap">{result}</pre>
                ) : (
                  <div className="text-gray-400 italic">No output yet. Run your code to see results.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playground;