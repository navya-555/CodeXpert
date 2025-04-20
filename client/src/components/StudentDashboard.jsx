import { useState, useEffect } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input'; // Added Input import
import {
  Users,
  BookOpen,
  ClipboardCheck,
  Calendar,
  BarChart,
  PlusCircle,
  Bell,
  Search,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const [activeTab, setActiveTab] = useState('overview');
  const [courseId, setCourseId] = useState(''); // Added state for course ID input
  const [joinLoading, setJoinLoading] = useState(false); // Added loading state for join button
  const [joinError, setJoinError] = useState(''); // Added error state
  const [joinSuccess, setJoinSuccess] = useState(''); // Added success message state

  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [student_name, setName] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentDashboardData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found. User may not be logged in.');
        return;
      }
  
      try {
        const response = await fetch('http://localhost:5000/api/student-dashboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setCourses(data.courses || []);
          setAssignments(data.assignments || []);
          setName(data.name || ''); 
        } else {
          console.error('Failed to fetch dashboard data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
  
    fetchStudentDashboardData();
  }, []);

  // Function to handle redirecting to playground with assignment ID
  const handleViewAssignment = (assignmentId) => {
    navigate(`/playground?assignmentId=${assignmentId}`);
  };

  // Function to navigate to playground without assignment ID
  const goToPlayground = () => {
    navigate('/playground');
  };

  // New function to handle joining a course
  const handleJoinCourse = async () => {
    if (!courseId.trim()) {
      setJoinError('Please enter a valid Course ID');
      return;
    }

    setJoinLoading(true);
    setJoinError('');
    setJoinSuccess('');

    const token = localStorage.getItem('authToken');
    if (!token) {
      setJoinError('You must be logged in to join a course');
      setJoinLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/courses/join', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ course_id: courseId }),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message
        setJoinSuccess(`Successfully joined course: ${data.course_title || 'Course'}`);
        setCourseId(''); // Clear input
        
        // Refresh courses list
        const updatedCoursesResponse = await fetch('http://localhost:5000/api/student-dashboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        const updatedData = await updatedCoursesResponse.json();
        if (updatedCoursesResponse.ok) {
          setCourses(updatedData.courses || []);
        }
      } else {
        setJoinError(data.message || 'Failed to join course');
      }
    } catch (error) {
      console.error('Error joining course:', error);
      setJoinError('An error occurred while joining the course');
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome {student_name}</h1>
          <p className="text-gray-600">Welcome back, Continue your learning journey.</p>
        </div>
        <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700">
          <BookOpen className="mr-2 h-4 w-4" /> Browse All Courses
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metrics Cards */}
            {[
              { title: 'Enrolled Courses', value: courses.length, icon: BookOpen },
              { title: 'Assignments', value: assignments.length, icon: CheckCircle },
            ].map((item, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <item.icon className="h-6 w-6 text-blue-600 mr-2" />
                    <span className="text-2xl font-bold">{item.value}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Course Progress + Assignments */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Implement basic button here*/}
          </div>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Course Management</CardTitle>
                <CardDescription>View and manage your courses</CardDescription>
              </div>
              
              {/* New Join Course Section */}
              <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                <Input
                  type="text"
                  placeholder="Enter Course ID"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full sm:w-auto"
                />
                <Button 
                  onClick={handleJoinCourse}
                  disabled={joinLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {joinLoading ? 'Joining...' : 'Join Course'}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Error and Success Messages */}
              {joinError && (
                <div className="bg-red-50 text-red-600 p-3 mb-4 rounded-md border border-red-200">
                  {joinError}
                </div>
              )}
              
              {joinSuccess && (
                <div className="bg-green-50 text-blue-600 p-3 mb-4 rounded-md border border-blue-200">
                  {joinSuccess}
                </div>
              )}
              
              <div className="space-y-6">
                {courses.length > 0 ? (
                  courses.map(course => (
                    <div
                      key={course.id}
                      className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start mb-3 md:mb-0">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mr-3">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{course.title}</h4>
                          <p className="text-sm text-gray-500">{course.lessons} lessons</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-6">You haven't joined any courses yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Assignment Management</CardTitle>
                <CardDescription>View and grade assignments</CardDescription>
              </div>
              <Button 
                className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700"
                onClick={goToPlayground}
              >
                View assignment
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {assignments.map(assignment => (
                  <div
                    key={assignment.id}
                    className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start mb-3 md:mb-0">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-blue-500 mr-3">
                        <ClipboardCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-sm text-gray-500">{assignment.course}</p>
                      </div>
                    </div>
                    <div className="self-center">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-indigo-600 hover:bg-indigo-50 whitespace-nowrap"
                        onClick={() => handleViewAssignment(assignment.id)}
                      >
                        View Assignment
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;