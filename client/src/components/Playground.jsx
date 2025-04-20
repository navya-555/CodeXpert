import { useState, useEffect } from 'react';
import { Check, Play, Code, ChevronDown, RefreshCw, Copy } from 'lucide-react';
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
    }
  }, [currentQuestion, selectedLanguage, questions]);

  // Handle question selection
  const handleQuestionSelect = (index) => {
    setCurrentQuestion(index);
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

  // Handle running the code
  const handleRunCode = async () => {
    setIsRunning(true);
    setResult(''); // Clear previous result before running new code
  
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
          question: questions[currentQuestion]
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
      }
  
      // Handle approval status from backend
      if (approved === 1) {
        resultMessage += `\n\n✅ Your solution was approved. Great job!`;
        const newCompleted = [...completedQuestions];
        newCompleted[currentQuestion] = true;
        setCompletedQuestions(newCompleted);
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
        </div>

        <div className="flex items-center space-x-3">
          {/* Code/Output toggle moved to the top */}
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
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-gray-600">
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