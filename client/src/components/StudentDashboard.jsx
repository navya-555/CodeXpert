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

const StudentDashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const [activeTab, setActiveTab] = useState('overview');

  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [student_name, setName] = useState();

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
          setName(data.name || ''); // Set the teacher's name
          set
        } else {
          console.error('Failed to fetch dashboard data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
  
    fetchStudentDashboardData();
  }, []);


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welceome {student_name}</h1>
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
              { title: 'Enrolled Courses', value: length(courses), icon: BookOpen },
              { title: 'Assignments', value: length(assignments), icon: CheckCircle },
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
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {courses.map(course => (
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
                ))}
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
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {assignments.map(assignment => (
                  <div
                    key={assignment.id}
                    className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start mb-3 md:mb-0">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mr-3">
                        <ClipboardCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-sm text-gray-500">{assignment.course}</p>
                      </div>
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
