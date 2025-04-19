// TeacherDashboard.jsx
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
  Search
} from 'lucide-react';


const TeacherDashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const [activeTab, setActiveTab] = useState('overview');

  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [teacher_name, setName] = useState();

  useEffect(() => {
    const fetchTeacherDashboardData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found. User may not be logged in.');
        return;
      }
  
      try {
        const response = await fetch('http://localhost:5000/api/teacher-dashboard', {
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
        } else {
          console.error('Failed to fetch dashboard data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
  
    fetchTeacherDashboardData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welome {teacher_name}</h1>
          <p className="text-gray-600">Welcome Professor, Manage your courses and students.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Course
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for courses, students, or assignments..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="analytics" className="hidden md:block">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BookOpen className="h-6 w-6 text-indigo-600 mr-2" />
                  <span className="text-2xl font-bold">8</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Assignments Created</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <ClipboardCheck className="h-6 w-6 text-indigo-600 mr-2" />
                  <span className="text-2xl font-bold">42</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Implement basic buttions here*/}
          </div>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Course Management</CardTitle>
                <CardDescription>View and manage your courses</CardDescription>
              </div>
              <Button className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700">
                <PlusCircle className="mr-2 h-4 w-4" /> New Course
              </Button>
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
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Assignments
                      </Button>
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                        Manage
                      </Button>
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
              <Button className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Assignment
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
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mr-3">
                        <ClipboardCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-sm text-gray-500">{assignment.course}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                        Grade
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>View insights and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500">Analytics content will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboard;